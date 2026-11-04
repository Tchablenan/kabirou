import { createHash } from "crypto";
import prisma from "@/lib/prisma";

/**
 * Limitation de débit partagée entre toutes les instances (table `rate_limits`).
 * Si la table n'existe pas ou si la base ne répond pas, on se rabat sur une
 * limite en mémoire (par instance) : moins stricte, mais jamais rien de bloqué à tort.
 *
 * Les clés (IP, e-mail…) sont hachées avant stockage : aucune donnée personnelle en clair.
 */

export type RateLimitResult = { ok: boolean; count: number; retryAfter: number };

const memory = new Map<string, { count: number; resetAt: number }>();
let warned = false;

function hashKey(key: string) {
  return createHash("sha256")
    .update(`${process.env.NEXTAUTH_SECRET ?? ""}:${key}`)
    .digest("hex")
    .slice(0, 48);
}

function fallback(error: unknown) {
  if (!warned) {
    warned = true;
    console.warn("rate-limit: table rate_limits indisponible, limite en mémoire utilisée", error);
  }
}

function memoryHit(key: string, windowSec: number, increment: boolean) {
  const now = Date.now();
  let entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowSec * 1000 };
    memory.set(key, entry);
  }
  if (increment) entry.count += 1;
  if (memory.size > 5000) {
    for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
  }
  return { count: entry.count, resetAt: entry.resetAt };
}

function result(count: number, limit: number, resetAt: number): RateLimitResult {
  return {
    ok: count <= limit,
    count,
    retryAfter: Math.max(0, Math.ceil((resetAt - Date.now()) / 1000)),
  };
}

/** Compte une tentative et indique si la limite est dépassée. */
export async function rateLimitHit(key: string, limit: number, windowSec: number): Promise<RateLimitResult> {
  const k = hashKey(key);
  try {
    const rows = await prisma.$queryRaw<{ count: number; reset_at: Date }[]>`
      INSERT INTO "rate_limits" ("key", "count", "reset_at")
      VALUES (${k}, 1, now() + make_interval(secs => ${windowSec}::float8))
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE WHEN "rate_limits"."reset_at" <= now() THEN 1 ELSE "rate_limits"."count" + 1 END,
        "reset_at" = CASE WHEN "rate_limits"."reset_at" <= now()
                          THEN now() + make_interval(secs => ${windowSec}::float8)
                          ELSE "rate_limits"."reset_at" END
      RETURNING "count", "reset_at"`;
    if (Math.random() < 0.02) {
      prisma.$executeRaw`DELETE FROM "rate_limits" WHERE "reset_at" < now() - interval '1 day'`.catch(() => {});
    }
    return result(Number(rows[0].count), limit, rows[0].reset_at.getTime());
  } catch (error) {
    fallback(error);
    const m = memoryHit(k, windowSec, true);
    return result(m.count, limit, m.resetAt);
  }
}

/** Indique si la limite est déjà atteinte, sans compter de tentative. */
export async function rateLimitPeek(key: string, limit: number): Promise<RateLimitResult> {
  const k = hashKey(key);
  try {
    const rows = await prisma.$queryRaw<{ count: number; reset_at: Date }[]>`
      SELECT "count", "reset_at" FROM "rate_limits" WHERE "key" = ${k} AND "reset_at" > now()`;
    if (!rows[0]) return { ok: true, count: 0, retryAfter: 0 };
    return { ...result(Number(rows[0].count), limit, rows[0].reset_at.getTime()), ok: Number(rows[0].count) < limit };
  } catch (error) {
    fallback(error);
    const entry = memory.get(k);
    if (!entry || entry.resetAt <= Date.now()) return { ok: true, count: 0, retryAfter: 0 };
    return { ...result(entry.count, limit, entry.resetAt), ok: entry.count < limit };
  }
}

/** Remet un compteur à zéro (ex. connexion réussie). */
export async function rateLimitReset(key: string) {
  const k = hashKey(key);
  memory.delete(k);
  try {
    await prisma.$executeRaw`DELETE FROM "rate_limits" WHERE "key" = ${k}`;
  } catch (error) {
    fallback(error);
  }
}

type HeaderSource = Headers | Record<string, string | string[] | undefined> | undefined;

/** Adresse IP du visiteur (Vercel renseigne x-forwarded-for avec la vraie IP). */
export function clientIp(headers: HeaderSource): string {
  const get = (name: string) => {
    if (!headers) return undefined;
    if (headers instanceof Headers) return headers.get(name) ?? undefined;
    const v = headers[name];
    return Array.isArray(v) ? v[0] : v;
  };
  return get("x-forwarded-for")?.split(",")[0]?.trim() || get("x-real-ip")?.trim() || "unknown";
}

/** Réponse 429 standard. */
export function tooManyRequests(retryAfter: number) {
  return new Response(JSON.stringify({ error: "Too many requests" }), {
    status: 429,
    headers: { "Content-Type": "application/json", "Retry-After": String(retryAfter || 60) },
  });
}

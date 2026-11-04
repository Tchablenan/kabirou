-- Sécurité : table de limitation de débit + suppression du réglage de test exposé publiquement

CREATE TABLE IF NOT EXISTS "rate_limits" (
    "key"      TEXT NOT NULL,
    "count"    INTEGER NOT NULL DEFAULT 0,
    "reset_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "rate_limits_pkey" PRIMARY KEY ("key")
);

CREATE INDEX IF NOT EXISTS "rate_limits_reset_at_idx" ON "rate_limits" ("reset_at");

-- Accessible uniquement par le serveur (Prisma), jamais via la clé publique Supabase
ALTER TABLE "rate_limits" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "rate_limits" FROM anon, authenticated;

DELETE FROM "settings" WHERE "key" = 'test';

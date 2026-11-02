"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export type TrustedCompany = {
  id: string;
  name: string;
  kind: "EMPLOYER" | "CLIENT";
  logoUrl: string | null;
  detailFr: string | null;
  detailEn: string | null;
  period: string | null;
  current: boolean;
  url: string | null;
};

function initials(name: string) {
  return name
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/**
 * Passe à `true` quand l'élément entre dans l'écran (une seule fois).
 * Pose aussi `data-armed` : les éléments ne sont masqués avant leur apparition
 * qu'une fois le JS chargé (sinon le contenu reste visible).
 */
function useInView<T extends HTMLElement>(ready: boolean) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.armed = "";
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ready]);
  return [ref, inView] as const;
}

function Pill({ company }: { company: TrustedCompany }) {
  const { t } = useTranslation();
  const content = company.logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element -- logos aux proportions variables
    <img src={company.logoUrl} alt="" loading="lazy" />
  ) : (
    <>
      <span className="kb-trusted-pill-logo">{initials(company.name)}</span>
      {company.name}
      {company.current && <span className="kb-trusted-dot" title={t("trusted.current")} />}
    </>
  );
  const className = `kb-trusted-pill${company.logoUrl ? " kb-trusted-pill--logo" : ""}`;

  // Le bandeau est masqué aux lecteurs d'écran (liste dédiée plus bas) : liens hors tabulation
  return company.url ? (
    <a className={className} href={company.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} title={company.name}>
      {content}
    </a>
  ) : (
    <span className={className} title={company.name}>
      {content}
    </span>
  );
}

function MarqueeRow({ items, reverse }: { items: TrustedCompany[]; reverse?: boolean }) {
  // On répète la liste pour remplir la largeur, puis on la double pour une boucle sans couture
  const base = useMemo(() => {
    const out: TrustedCompany[] = [];
    while (out.length < 10) out.push(...items);
    return out;
  }, [items]);

  return (
    <div className={`kb-trusted-marquee${reverse ? " is-reverse" : ""}`}>
      <div className="kb-trusted-marquee-track" style={{ ["--kb-duration" as string]: `${base.length * 4}s` }}>
        {[0, 1].map((copy) => base.map((c, i) => <Pill company={c} key={`${copy}-${i}-${c.id}`} />))}
      </div>
    </div>
  );
}

export default function TrustedBy({ initialCompanies }: { initialCompanies?: TrustedCompany[] }) {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState<TrustedCompany[]>(initialCompanies ?? []);

  // Si la requête serveur a échoué, on recharge côté navigateur
  useEffect(() => {
    if (initialCompanies) return;
    fetch("/api/companies")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setCompanies(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [initialCompanies]);

  const reversed = useMemo(() => [...companies].reverse(), [companies]);
  const [sectionRef, inView] = useInView<HTMLElement>(companies.length > 0);

  if (companies.length === 0) return null;

  const title = t("trusted.title");
  const highlight = t("trusted.title_highlight");
  const hiAt = highlight ? title.lastIndexOf(highlight) : -1;

  return (
    <section
      ref={sectionRef}
      className={`kb-trusted tmp-section-gapTop${inView ? " is-visible" : ""}`}
      id="clients"
      aria-labelledby="kb-trusted-title"
    >
      <div className="kb-trusted-bg" aria-hidden="true" />
      <div className="container">
        <header className="kb-trusted-head">
          <span className="kb-trusted-eyebrow kb-reveal">
            <span className="kb-trusted-eyebrow-dot" aria-hidden="true" />
            {t("trusted.subtitle")}
          </span>
          <h2 id="kb-trusted-title" className="kb-trusted-title kb-reveal">
            {hiAt >= 0 ? (
              <>
                {title.slice(0, hiAt)}
                <span className="kb-trusted-title-hi">{highlight}</span>
                {title.slice(hiAt + highlight.length)}
              </>
            ) : (
              title
            )}
          </h2>
          <p className="kb-trusted-intro kb-reveal">{t("trusted.intro")}</p>
        </header>
      </div>

      <div className="kb-trusted-marquees kb-reveal" aria-hidden="true">
        <MarqueeRow items={companies} />
        {companies.length >= 4 && <MarqueeRow items={reversed} reverse />}
      </div>

      {/* Version lisible par les lecteurs d'écran et les moteurs de recherche */}
      <ul className="visually-hidden">
        {companies.map((c) => (
          <li key={c.id}>
            {c.url ? (
              <a href={c.url} target="_blank" rel="noopener noreferrer">
                {c.name}
              </a>
            ) : (
              c.name
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

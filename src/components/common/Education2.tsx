"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Experience {
  id: string;
  titleFr: string;
  titleEn: string;
  organization: string;
  duration: string;
  type: "WORK" | "EDUCATION";
  descriptionFr: string | null;
  descriptionEn: string | null;
  displayOrder: number;
}

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let current = 0;
          const inc = Math.ceil(target / (1400 / 16));
          const timer = setInterval(() => {
            current += inc;
            if (current >= target) { setCount(target); clearInterval(timer); }
            else setCount(current);
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export interface ResumeStats {
  years: number;
  projects: number;
  countries: number;
}

const DEFAULT_STATS: ResumeStats = { years: 4, projects: 10, countries: 3 };

export default function Education({
  initialExperiences,
  initialStats,
}: {
  initialExperiences?: Experience[];
  initialStats?: Partial<ResumeStats>;
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "fr";
  const stats: ResumeStats = {
    years: initialStats?.years ?? DEFAULT_STATS.years,
    projects: initialStats?.projects ?? DEFAULT_STATS.projects,
    countries: initialStats?.countries ?? DEFAULT_STATS.countries,
  };
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences ?? []);
  const [isLoading, setIsLoading] = useState(!initialExperiences);

  useEffect(() => {
    if (initialExperiences) return;
    fetch("/api/experiences")
      .then((res) => res.json())
      .then((data) => setExperiences(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [initialExperiences]);

  const workExp = experiences.filter((e) => e.type === "WORK");
  const eduExp  = experiences.filter((e) => e.type === "EDUCATION");

  return (
    <section className="education-experience tmp-section-gapTop" id="resume">
      <div className="container">

        {/* ── Section header ── */}
        <div className="section-head mb--50">
          <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
            <span className="subtitle">{t("resume.subtitle")}</span>
          </div>
          <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
            {t("resume.title")}
          </h2>
          <p className="description section-sm tmp-scroll-trigger tmp-fade-in animation-order-3">
            {t("resume.description")}
          </p>
        </div>

        {/* ── Bandeau stats ── */}
        <div className="row g-4 mb-5 tmp-scroll-trigger tmp-fade-in animation-order-1">
          {[
            { value: stats.years,     suffix: "+", label: t("resume.stats_years"),     icon: "fa-solid fa-calendar-check" },
            { value: stats.projects,  suffix: "+", label: t("resume.stats_projects"),  icon: "fa-solid fa-briefcase"      },
            { value: stats.countries, suffix: "",  label: t("resume.stats_countries"), icon: "fa-solid fa-earth-africa"   },
          ].map((stat, i) => (
            <div className="col-lg-4 col-sm-4 col-12" key={i}>
              <div className="counter-card tmponhover text-center">
                <i
                  className={stat.icon}
                  aria-hidden="true"
                  style={{ fontSize: "1.4rem", color: "var(--color-primary)", display: "block", marginBottom: "12px" }}
                />
                <h3 className="counter counter-title">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="counter-para">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Colonnes Expériences / Formation ── */}
        <div className="row g-5">

          {/* ── Colonne gauche : Expériences pro ── */}
          <div className="col-lg-6">
            <h2 className="custom-title mb-32 tmp-scroll-trigger tmp-fade-in animation-order-1">
              {t("resume.experience_title")}
              <span>
                <Image alt="custom-line" src="/assets/images/custom-line/custom-line.png" width={81} height={6} />
              </span>
            </h2>

            {isLoading ? (
              <div className="experience-style-list">
                <div className="experience-list">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="resume-single-list" style={{ opacity: 0.4 }}>
                      <div className="inner">
                        <div className="heading">
                          <div className="title">
                            <div style={{ height: 24, width: 160, background: "var(--color-card)", borderRadius: 6, marginBottom: 8 }} />
                            <div style={{ height: 14, width: 100, background: "var(--color-gray-2)", borderRadius: 4 }} />
                          </div>
                          <div style={{ height: 36, width: 80, background: "var(--color-card)", borderRadius: 6 }} />
                        </div>
                        <div style={{ height: 14, width: "100%", background: "var(--color-gray-2)", borderRadius: 4, marginTop: 20 }} />
                        <div style={{ height: 14, width: "70%", background: "var(--color-gray-2)", borderRadius: 4, marginTop: 8 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : workExp.length === 0 ? (
              <p style={{ color: "var(--color-gray)" }}>{t("resume.empty_experience")}</p>
            ) : (
              <div className="experience-style-list">
                <div className="experience-list">
                  {workExp.map((item, index) => (
                    <div
                      key={item.id}
                      className={`resume-single-list tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}
                    >
                      <div className="inner">
                        <div className="heading">
                          <div className="title">
                            <h4>{locale === "fr" ? item.titleFr : item.titleEn}</h4>
                            <span>{item.organization}</span>
                          </div>
                          <div className="date-of-time">
                            <span>{item.duration}</span>
                          </div>
                        </div>
                        {(locale === "fr" ? item.descriptionFr : item.descriptionEn) && (
                          <p>{locale === "fr" ? item.descriptionFr : item.descriptionEn}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Colonne droite : Formation + Spécialités + Disponibilité ── */}
          <div className="col-lg-6">
            <h2 className="custom-title mb-32 tmp-scroll-trigger tmp-fade-in animation-order-1">
              {t("resume.education_title")}
              <span>
                <Image alt="custom-line" src="/assets/images/custom-line/custom-line.png" width={81} height={6} />
              </span>
            </h2>

            {isLoading ? (
              <div className="experience-style-list">
                <div className="experience-list">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="resume-single-list" style={{ opacity: 0.4 }}>
                      <div className="inner">
                        <div className="heading">
                          <div className="title">
                            <div style={{ height: 24, width: 160, background: "var(--color-card)", borderRadius: 6, marginBottom: 8 }} />
                            <div style={{ height: 14, width: 100, background: "var(--color-gray-2)", borderRadius: 4 }} />
                          </div>
                          <div style={{ height: 36, width: 80, background: "var(--color-card)", borderRadius: 6 }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : eduExp.length > 0 && (
              <div className="experience-style-list mb-5">
                <div className="experience-list">
                  {eduExp.map((item, index) => (
                    <div
                      key={item.id}
                      className={`resume-single-list tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}
                    >
                      <div className="inner">
                        <div className="heading">
                          <div className="title">
                            <h4>{locale === "fr" ? item.titleFr : item.titleEn}</h4>
                            <span>{item.organization}</span>
                          </div>
                          <div className="date-of-time">
                            <span>{item.duration}</span>
                          </div>
                        </div>
                        {(locale === "fr" ? item.descriptionFr : item.descriptionEn) && (
                          <p>{locale === "fr" ? item.descriptionFr : item.descriptionEn}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Langues ── */}
            <h2 className="custom-title mb-32 tmp-scroll-trigger tmp-fade-in animation-order-2">
              {locale === "fr" ? "Langues" : "Languages"}
              <span>
                <Image alt="custom-line" src="/assets/images/custom-line/custom-line.png" width={81} height={6} />
              </span>
            </h2>

            <div className="row g-3 mb-5">
              {[
                { flag: "🇫🇷", lang: "Français", levelFr: "Langue maternelle",  levelEn: "Native",            dots: 5 },
                { flag: "🇬🇧", lang: "Anglais",  levelFr: "Professionnel (B2)", levelEn: "Professional (B2)", dots: 4 },
              ].map((l, i) => (
                <div className="col-12" key={i}>
                  <div
                    className={`education-experience-card tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${i + 1}`}
                    style={{ padding: "20px 28px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>{l.flag}</span>
                        <div>
                          <h4 className="edu-title" style={{ marginBottom: "2px", fontSize: "16px" }}>{l.lang}</h4>
                          <p className="edu-sub-title" style={{ marginBottom: 0, fontSize: "13px" }}>
                            {locale === "fr" ? l.levelFr : l.levelEn}
                          </p>
                        </div>
                      </div>
                      {/* Dots de niveau */}
                      <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                        {Array.from({ length: 5 }).map((_, d) => (
                          <span
                            key={d}
                            style={{
                              width: "10px", height: "10px", borderRadius: "50%",
                              background: d < l.dots ? "var(--color-primary)" : "rgba(255,255,255,0.12)",
                              display: "inline-block",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Soft Skills ── */}
            <h2 className="custom-title mb-32 tmp-scroll-trigger tmp-fade-in animation-order-3">
              {locale === "fr" ? "Qualités" : "Soft Skills"}
              <span>
                <Image alt="custom-line" src="/assets/images/custom-line/custom-line.png" width={81} height={6} />
              </span>
            </h2>

            <div className="row g-3 mb-4">
              {[
                { icon: "fa-solid fa-lightbulb",        fr: "Autonomie",          en: "Autonomy"        },
                { icon: "fa-solid fa-people-group",     fr: "Esprit d'équipe",    en: "Team Spirit"     },
                { icon: "fa-solid fa-arrows-rotate",    fr: "Adaptabilité",       en: "Adaptability"    },
                { icon: "fa-solid fa-magnifying-glass", fr: "Rigueur",            en: "Thoroughness"    },
              ].map((skill, i) => (
                <div className="col-6" key={i}>
                  <div
                    className={`education-experience-card tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${i + 1}`}
                    style={{ padding: "22px 20px", textAlign: "center" }}
                  >
                    <i className={skill.icon} style={{ fontSize: "1.5rem", color: "var(--color-primary)", display: "block", marginBottom: "10px" }} />
                    <h4 className="edu-title" style={{ fontSize: "14px", marginBottom: 0 }}>
                      {locale === "fr" ? skill.fr : skill.en}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Disponibilité (badge compact) ── */}
            <div
              className="tmp-scroll-trigger tmp-fade-in animation-order-4"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 20px",
                borderRadius: "50px",
                border: "1px solid rgba(34,197,94,0.3)",
                background: "rgba(34,197,94,0.07)",
              }}
            >
              <span style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#22c55e", flexShrink: 0,
                animation: "edu2-pulse 2.5s ease-in-out infinite",
              }} />
              <span className="edu-sub-title" style={{ color: "#4ade80", fontSize: "14px", fontWeight: "600", marginBottom: 0 }}>
                {locale === "fr" ? "Disponible · Full-time · Freelance · Remote" : "Available · Full-time · Freelance · Remote"}
              </span>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @keyframes edu2-pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(34,197,94,0.15), 0 0 12px rgba(34,197,94,0.3); }
          50%       { box-shadow: 0 0 0 8px rgba(34,197,94,0.06), 0 0 22px rgba(34,197,94,0.5); }
        }
      `}</style>
    </section>
  );
}

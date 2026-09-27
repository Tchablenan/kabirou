"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import TyperComponent from "@/components/common/TyperComponent";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useEffect, useState } from "react";

const techChips = [
  { name: "Laravel", slug: "laravel" },
  { name: "React", slug: "react" },
  { name: "Django", slug: "django" },
  { name: "Flutter", slug: "flutter" },
  { name: "Spring Boot", slug: "spring" },
  { name: "Flask", slug: "flask" },
];

// Compteur animé de 0 à `target` (valeur finale directe si animations réduites)
function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

const ParticleComponent = dynamic(() => import("@/components/common/ParticleComponent"), {
  ssr: false,
});

export default function Hero({
  initialCvUrl,
  projectsCount = 10,
}: {
  initialCvUrl?: string;
  projectsCount?: number;
}) {
  const { t } = useTranslation();
  const projectsShown = useCountUp(projectsCount);
  const [cvUrl, setCvUrl] = useState<string>(initialCvUrl ?? "");

  useEffect(() => {
    if (initialCvUrl !== undefined) return;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setCvUrl(data.cv_url ?? ""))
      .catch(() => {});
  }, [initialCvUrl]);

  const typerStrings = [
    t("titles.fullstack_developer"),
    t("titles.web_developer"),
    t("titles.mobile_developer"),
  ];

  return (
    <div className="tmp-banner-one-area" id="home">
      <div className="container">
        <div className="banner-one-main-wrapper">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-2">
              <div className="hero-visual tmp-scroll-trigger tmp-zoom-in animation-order-1">
                <span className="hero-visual-orbit" aria-hidden="true" />
                <span className="hero-visual-glow" aria-hidden="true" />
                <div className="hero-visual-blob">
                  <Image
                    alt={t("a11y.hero_photo_alt")}
                    src="/assets/images/kbi/Kabi.webp"
                    width={542}
                    height={802}
                    priority
                    sizes="(max-width: 575px) 280px, (max-width: 991px) 340px, 420px"
                  />
                </div>
                {techChips.map((tech, i) => (
                  <span
                    key={tech.slug}
                    className={`hero-chip hero-chip--${tech.slug}`}
                    style={{ ["--chip-index" as string]: i }}
                  >
                    <Image src={`/assets/images/tech/${tech.slug}.svg`} alt="" width={16} height={16} unoptimized />
                    {tech.name}
                  </span>
                ))}
                <div className="hero-stat-card">
                  <span className="hero-stat-card-icon" aria-hidden="true">
                    <i className="fa-solid fa-check" />
                  </span>
                  <span className="hero-stat-card-text">
                    <strong>+{projectsShown} {t("hero.projects_word")}</strong>
                    <span>{t("hero.projects_done")}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-lg-1">
              <div className="inner">
                <span className="hero-availability tmp-scroll-trigger tmp-fade-in animation-order-1">
                  <span className="hero-availability-dot" aria-hidden="true" />
                  {t("hero.availability")}
                </span>
                <br />
                <span className="sub-title tmp-scroll-trigger tmp-fade-in animation-order-1">
                  {t("hero.iam")}
                </span>
                <h1 className="title mt--5 tmp-scroll-trigger tmp-fade-in animation-order-2">
                  {t("hero.name")} <br />
                  <span className="header-caption">
                    <span className="cd-headline clip is-full-width">
                      <span className="cd-words-wrapper">
                        <TyperComponent strings={typerStrings} />
                      </span>
                    </span>
                  </span>
                </h1>
                <p className="disc tmp-scroll-trigger tmp-fade-in animation-order-3">
                  {t("hero.description")}
                </p>
                <div className="button-area-banner-one tmp-scroll-trigger tmp-fade-in animation-order-4" style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                  <Link
                    href="#contacts"
                    className="tmp-btn hover-icon-reverse radius-round"
                  >
                    <span className="icon-reverse-wrapper">
                      <span className="btn-text">{t("hero.contact_button")}</span>
                      <span className="btn-icon">
                        <i className="fa-sharp fa-regular fa-arrow-right" />
                      </span>
                      <span className="btn-icon">
                        <i className="fa-sharp fa-regular fa-arrow-right" />
                      </span>
                    </span>
                  </Link>
                  {cvUrl && (
                  <a
                    href={cvUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tmp-btn radius-round tmp-btn-outline"
                  >
                    <span className="btn-inline-icon">
                      <i className="fa-solid fa-download" aria-hidden="true" />
                      {t("hero.download_cv")}
                    </span>
                  </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ParticleComponent
        options={{
          fullScreen: {
            enable: false,
            zIndex: -1,
          },
          particles: {
            number: {
              value: 15,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: ["#ffffff"],
            },
            shape: {
              type: "edge",
            },
            opacity: {
              value: { min: 0.3, max: 0.8 },
              random: true,
            },
            size: {
              value: { min: 0.1, max: 5 },
              random: true,
            },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: true,
                mode: "repulse",
              },
              onclick: {
                enable: true,
                mode: "push",
              },
              resize: true,
            },
          },
          retina_detect: true,
        }}
      />
    </div>
  );
}

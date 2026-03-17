"use client";

import ParticleComponent from "@/components/common/ParticleComponent";
import TyperComponent from "@/components/common/TyperComponent";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function Hero() {
  const { t } = useTranslation();

  const typerStrings = [
    t("titles.web_developer"),
    t("titles.mobile_developer"),
    t("titles.software_engineer"),
  ];

  return (
    <div className="tmp-banner-one-area" id="home">
      <div className="container">
        <div className="banner-one-main-wrapper">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-2">
              <div className="banner-right-content">
                <img
                  className="tmp-scroll-trigger tmp-zoom-in animation-order-1"
                  alt="banner-img"
                  src="/assets/images/kbi/Kabi.png"
                  width={542}
                  height={802}
                  style={{
                    objectFit: "cover",
                    maskImage: "radial-gradient(circle, black 60%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 100%)",
                  }}
                />
                <h2 className="banner-big-text-1 up-down">
                  {t("titles.backend").toUpperCase()}
                </h2>
                <h2 className="banner-big-text-2 up-down-2">
                  {t("titles.frontend").toUpperCase()}
                </h2>
              </div>
            </div>
            <div className="col-lg-6 order-lg-1">
              <div className="inner">
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
                <div className="button-area-banner-one tmp-scroll-trigger tmp-fade-in animation-order-4">
                  <Link
                    href="#portfolio"
                    className="tmp-btn hover-icon-reverse radius-round"
                  >
                    <span className="icon-reverse-wrapper">
                      <span className="btn-text">{t("hero.cv_button")}</span>
                      <span className="btn-icon">
                        <i className="fa-sharp fa-regular fa-arrow-right" />
                      </span>
                      <span className="btn-icon">
                        <i className="fa-sharp fa-regular fa-arrow-right" />
                      </span>
                    </span>
                  </Link>
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

"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

const highlights = [
  { key: "languages", icon: "fa-solid fa-language" },
  { key: "fullstack", icon: "fa-solid fa-rocket" },
  { key: "degree", icon: "fa-solid fa-graduation-cap" },
  { key: "communication", icon: "fa-solid fa-comments" },
];

export default function About({ cvUrl = "" }: { cvUrl?: string }) {
  const { t } = useTranslation();

  return (
    <section className="kb-about tmp-section-gapTop" id="about">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-5">
            <div className="kb-about-photo tmp-scroll-trigger tmp-fade-in animation-order-1">
              <Image
                src="/assets/images/kbi/kabirou-about.webp"
                alt={t("about.photo_alt")}
                width={822}
                height={1080}
                sizes="(max-width: 991px) 80vw, 420px"
              />
              <div className="kb-about-photo-tag">
                <i className="fa-solid fa-location-dot" aria-hidden="true" />
                {t("about.photo_tag")}
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="kb-about-content">
              <div className="section-head kb-about-head">
                <span className="subtitle p-subtitle tmp-scroll-trigger tmp-fade-in animation-order-1">
                  {t("about.subtitle")}
                </span>
                <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
                  {t("about.title")}
                </h2>
              </div>
              <p className="kb-about-text tmp-scroll-trigger tmp-fade-in animation-order-3">
                {t("about.paragraph_1")}
              </p>
              <p className="kb-about-text tmp-scroll-trigger tmp-fade-in animation-order-3">
                {t("about.paragraph_2")}
              </p>

              <ul className="kb-about-highlights">
                {highlights.map((item, i) => (
                  <li
                    key={item.key}
                    className={`kb-about-highlight tmp-scroll-trigger tmp-fade-in animation-order-${i + 1}`}
                  >
                    <span className="kb-about-highlight-icon" aria-hidden="true">
                      <i className={item.icon} />
                    </span>
                    <span>
                      <strong>{t(`about.highlights.${item.key}.title`)}</strong>
                      <span>{t(`about.highlights.${item.key}.text`)}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="kb-about-actions">
                {cvUrl && (
                  <a
                    href={cvUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tmp-btn hover-icon-reverse radius-round"
                  >
                    <span className="icon-reverse-wrapper">
                      <span className="btn-text">{t("hero.download_cv")}</span>
                      <span className="btn-icon">
                        <i className="fa-solid fa-download" />
                      </span>
                      <span className="btn-icon">
                        <i className="fa-solid fa-download" />
                      </span>
                    </span>
                  </a>
                )}
                <a href="#contacts" className="tmp-btn radius-round tmp-btn-outline">
                  <span className="btn-inline-icon">
                    <i className="fa-regular fa-paper-plane" aria-hidden="true" />
                    {t("about.contact")}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

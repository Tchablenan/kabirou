"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

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

export default function Education() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "fr";
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/experiences")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExperiences(data);
        } else {
          console.error("Data is not an array:", data);
          setExperiences([]);
        }
      })
      .catch((err) => console.error("Failed to fetch experiences", err))
      .finally(() => setIsLoading(false));
  }, []);

  const workExp = Array.isArray(experiences) ? experiences.filter(e => e.type === "WORK") : [];
  const eduExp = Array.isArray(experiences) ? experiences.filter(e => e.type === "EDUCATION") : [];

  return (
    <section className="education-experience tmp-section-gapTop" id="resume">
      <div className="container">
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
        <div className="experiences-wrapper">
          <div className="row">
            <div className="col-lg-6">
              <div className="experiences-wrap-left-content">
                <h2 className="custom-title mb-32 tmp-scroll-trigger tmp-fade-in animation-order-1">
                  {t("resume.experience_title")}
                  <span>
                    <img
                      loading="lazy"
                      alt="custom-line"
                      src="/assets/images/custom-line/custom-line.png"
                      width={81}
                      height={6}
                    />
                  </span>
                </h2>
                {workExp.map((item, index) => (
                  <div
                    className={`experience-content tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}
                    key={item.id}
                  >
                    <p className="ex-subtitle">{item.organization}</p>
                    <h2 className="ex-name">{locale === "fr" ? item.titleFr : item.titleEn}</h2>
                    <h3 className="ex-title">{item.duration}</h3>
                    <p className="ex-para">
                      {locale === "fr" ? item.descriptionFr : item.descriptionEn}
                    </p>
                  </div>
                ))}
                {!isLoading && workExp.length === 0 && (
                  <p className="mt-4">Aucune expérience renseignée.</p>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="experiences-wrap-right-content">
                <img
                  loading="lazy"
                  className="tmp-scroll-trigger tmp-zoom-in animation-order-1"
                  alt="expert-img"
                  src="/assets/images/kbi/5KB.jpeg"
                  width={945}
                  height={719}
                />
              </div>
            </div>
          </div>
        </div>
        <h2 className="custom-title mb-32 tmp-scroll-trigger tmp-fade-in animation-order-1 mt-5">
          {t("resume.education_title")}
          <span>
            <img
              loading="lazy"
              alt="custom-line"
              src="/assets/images/custom-line/custom-line.png"
              width={81}
              height={6}
            />
          </span>
        </h2>
        <div className="row g-5">
          {eduExp.map((item, index) => (
            <div className="col-lg-6 col-sm-6" key={item.id}>
              <div
                className={`education-experience-card tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}
              >
                <h4 className="edu-sub-title">{locale === "fr" ? item.titleFr : item.titleEn}</h4>
                <h2 className="edu-title">{item.duration}</h2>
                <p className="edu-para">
                  {locale === "fr" ? item.descriptionFr : item.descriptionEn}
                </p>
              </div>
            </div>
          ))}
          {!isLoading && eduExp.length === 0 && (
            <div className="col-12 text-center"><p>Aucun diplôme renseigné.</p></div>
          )}
        </div>
      </div>
    </section>
  );
}

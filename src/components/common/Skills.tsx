"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

interface Skill {
  id: string;
  name: string;
  iconUrl: string | null;
  category: "DEVELOPMENT" | "OTHERS";
  displayOrder: number;
}

export default function Skills({
  parentClass = "tmp-skill-area tmp-section-gapTop",
  initialSkills,
}: {
  parentClass?: string;
  initialSkills?: Skill[];
}) {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [skills, setSkills] = useState<Skill[]>(initialSkills ?? []);
  const [isLoading, setIsLoading] = useState(!initialSkills);

  const categories = [
    { id: "all", label: "skills.category_all" },
    { id: "DEVELOPMENT", label: "skills.category_development" },
    { id: "OTHERS", label: "skills.category_others" },
  ];

  useEffect(() => {
    if (initialSkills) return;
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => setSkills(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [initialSkills]);

  const filteredSkills = activeFilter === "all" 
    ? skills 
    : skills.filter(skill => skill.category === activeFilter);

  return (
    <div className={parentClass} id="skills">
      <div className="container">
        <div className="section-head mb--50 text-center">
            <span className="subtitle center-title tmp-scroll-trigger tmp-fade-in animation-order-1" style={{ display: 'block', marginBottom: '10px' }}>
                {t("skills.subtitle")}
            </span>
            <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
                {t("navigation.skills")}
            </h2>
        </div>

        {/* Filter Buttons */}
        <div className="filter-button-group d-flex justify-content-center align-items-center flex-row gap-3 mb--50" role="group" aria-label={t("skills.subtitle")}>
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    className={`skill-filter-btn ${activeFilter === cat.id ? "active" : ""}`}
                    onClick={() => setActiveFilter(cat.id)}
                    aria-pressed={activeFilter === cat.id}
                >
                    {t(cat.label)}
                </button>
            ))}
        </div>

        <div className="row g-4 justify-content-center">
          {isLoading && Array.from({ length: 12 }).map((_, i) => (
            <div className="col-lg-2 col-md-3 col-sm-4 col-6" key={`skel-${i}`}>
              <div className="skeleton-card" style={{ height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <div className="skeleton-box" style={{ width: '50px', height: '50px', borderRadius: '10px' }} />
                <div className="skeleton-box skeleton-box--soft" style={{ width: '70%', height: '12px' }} />
              </div>
            </div>
          ))}
          {!isLoading && filteredSkills.map((skill) => (
            <div className="col-lg-2 col-md-3 col-sm-4 col-6" key={skill.id}>
              <div className="skill-logo-card p-4 text-center tmponhover tmp-scroll-trigger tmp-zoom-in">
                {skill.iconUrl ? (
                  <Image
                    src={skill.iconUrl}
                    alt=""
                    width={50}
                    height={50}
                    className="skill-icon"
                  />
                ) : (
                  <span className="skill-icon-fallback" aria-hidden="true">
                    <i className="fa-solid fa-code" />
                  </span>
                )}
                <h6 className="heading heading-h6 mb-0 skill-name">
                  {skill.name}
                </h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

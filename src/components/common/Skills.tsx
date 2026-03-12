"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Skill {
  id: string;
  name: string;
  iconUrl: string | null;
  category: "DEVELOPMENT" | "OTHERS";
  displayOrder: number;
}

export default function Skills({
  parentClass = "tmp-skill-area tmp-section-gapTop",
}) {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: "all", label: "skills.category_all" },
    { id: "DEVELOPMENT", label: "skills.category_development" },
    { id: "OTHERS", label: "skills.category_others" },
  ];

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => setSkills(data))
      .catch((err) => console.error("Failed to fetch skills", err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredSkills = activeFilter === "all" 
    ? skills 
    : skills.filter(skill => skill.category === activeFilter);

  return (
    <div className={parentClass} id="skills">
      <div className="container">
        <div className="section-head mb--50 text-center">
            <span className="subtitle center-title tmp-scroll-trigger tmp-fade-in animation-order-1" style={{ display: 'block', marginBottom: '10px' }}>
                {t("services.subtitle")}
            </span>
            <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
                {t("navigation.skills")}
            </h2>
        </div>

        {/* Filter Buttons */}
        <div className="filter-button-group d-flex justify-content-center align-items-center flex-row gap-3 mb--50">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    className={`skill-filter-btn ${activeFilter === cat.id ? "active" : ""}`}
                    onClick={() => setActiveFilter(cat.id)}
                    style={{
                        padding: "10px 25px",
                        borderRadius: "10px",
                        border: "1px solid",
                        borderColor: activeFilter === cat.id ? "var(--color-primary)" : "rgba(255, 255, 255, 0.1)",
                        background: activeFilter === cat.id ? "var(--color-primary)" : "rgba(255, 255, 255, 0.03)",
                        color: "var(--color-white)",
                        fontSize: "15px",
                        fontWeight: "500",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        outline: "none",
                        display: "inline-block",
                        width: "auto"
                    }}
                >
                    {t(cat.label)}
                </button>
            ))}
        </div>

        <div className="row g-4 justify-content-center">
          {filteredSkills.map((skill, skillIndex) => (
            <div className="col-lg-2 col-md-3 col-sm-4 col-6" key={`${activeFilter}-${skillIndex}`}>
              <div 
                className="skill-logo-card p-4 text-center tmponhover tmp-scroll-trigger tmp-zoom-in"
                style={{
                   background: "rgba(255, 255, 255, 0.05)",
                   borderRadius: "15px",
                   border: "1px solid rgba(255, 255, 255, 0.1)",
                   transition: "all 0.3s ease",
                   cursor: "default",
                   height: "100%",
                   display: "flex",
                   flexDirection: "column",
                   alignItems: "center",
                   justifyContent: "center"
                }}
              >
                <img 
                  src={skill.iconUrl || ""} 
                  alt={skill.name} 
                  style={{ 
                    maxWidth: "50px", 
                    maxHeight: "50px", 
                    marginBottom: "15px",
                    filter: "grayscale(20%) brightness(1.1)",
                    objectFit: 'contain'
                  }} 
                />
                <h6 
                  className="heading heading-h6 mb-0" 
                  style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-white)" }}
                >
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

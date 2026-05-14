"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface StatItem {
  value: number;
  suffix: string;
  labelFr: string;
  labelEn: string;
  icon: string;
}

const stats: StatItem[] = [
  { value: 4,  suffix: "+", labelFr: "Ans d'exp.", labelEn: "Years exp.", icon: "fa-solid fa-calendar-check" },
  { value: 10, suffix: "+", labelFr: "Projets",    labelEn: "Projects",   icon: "fa-solid fa-briefcase"      },
  { value: 3,  suffix: "",  labelFr: "Pays",        labelEn: "Countries",  icon: "fa-solid fa-earth-africa"   },
];

const specialties = [
  {
    icon: "fa-solid fa-globe",
    titleFr: "Web",
    titleEn: "Web",
    tagsFr: ["React", "Next.js", "Laravel"],
    tagsEn: ["React", "Next.js", "Laravel"],
    color: "#61DAFB",
    bg: "rgba(97,218,251,0.08)",
    border: "rgba(97,218,251,0.2)",
  },
  {
    icon: "fa-solid fa-mobile-screen",
    titleFr: "Mobile",
    titleEn: "Mobile",
    tagsFr: ["Flutter", "Firebase"],
    tagsEn: ["Flutter", "Firebase"],
    color: "#54CAFF",
    bg: "rgba(84,202,255,0.08)",
    border: "rgba(84,202,255,0.2)",
  },
  {
    icon: "fa-solid fa-server",
    titleFr: "Backend",
    titleEn: "Backend",
    tagsFr: ["API REST", "MySQL", "Supabase"],
    tagsEn: ["REST API", "MySQL", "Supabase"],
    color: "#FF014F",
    bg: "rgba(255,1,79,0.07)",
    border: "rgba(255,1,79,0.2)",
  },
];

const techStack = [
  { name: "React.js",   color: "rgba(97,218,251,0.13)",  border: "rgba(97,218,251,0.35)"  },
  { name: "Next.js",    color: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.2)"  },
  { name: "Laravel",    color: "rgba(255,45,32,0.11)",   border: "rgba(255,45,32,0.35)"   },
  { name: "Flutter",    color: "rgba(84,202,255,0.11)",  border: "rgba(84,202,255,0.35)"  },
  { name: "TypeScript", color: "rgba(49,120,198,0.13)",  border: "rgba(49,120,198,0.4)"   },
  { name: "MySQL",      color: "rgba(0,117,143,0.13)",   border: "rgba(0,117,143,0.4)"    },
  { name: "Firebase",   color: "rgba(255,196,0,0.11)",   border: "rgba(255,196,0,0.35)"   },
  { name: "Supabase",   color: "rgba(62,207,142,0.11)",  border: "rgba(62,207,142,0.35)"  },
];

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
          const increment = Math.ceil(target / (1400 / 16));
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) { setCount(target); clearInterval(timer); }
            else setCount(current);
          }, 16);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function ExperiencePanel() {
  const { i18n } = useTranslation();
  const locale = i18n.language || "fr";

  return (
    <div style={{
      background: "linear-gradient(160deg, rgba(20,20,25,0.9) 0%, rgba(30,10,20,0.95) 100%)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: "24px",
      overflow: "hidden",
      boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
    }}>

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(255,1,79,0.18) 0%, rgba(255,1,79,0.04) 60%, transparent 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "28px 32px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Cercle décoratif */}
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "160px", height: "160px", borderRadius: "50%",
          background: "rgba(255,1,79,0.08)", border: "1px solid rgba(255,1,79,0.12)",
        }} />
        <div style={{
          position: "absolute", top: "-10px", right: "-10px",
          width: "80px", height: "80px", borderRadius: "50%",
          background: "rgba(255,1,79,0.06)", border: "1px solid rgba(255,1,79,0.1)",
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative" }}>
          {/* Avatar initiales */}
          <div style={{
            width: "52px", height: "52px", borderRadius: "14px",
            background: "linear-gradient(135deg, #FF014F 0%, #cc0040 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 8px 24px rgba(255,1,79,0.35)",
            fontSize: "1.1rem", fontWeight: "800", color: "#fff",
            letterSpacing: "1px",
          }}>
            KB
          </div>
          <div>
            <p style={{ fontSize: "1rem", fontWeight: "700", color: "#fff", margin: "0 0 3px" }}>
              Kabirou Djantchiemo
            </p>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.4 }}>
              {locale === "fr" ? "Développeur Web & Mobile Full Stack" : "Full Stack Web & Mobile Developer"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Corps ── */}
      <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "26px" }}>

        {/* ── Stats animés ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "20px 8px 16px",
                textAlign: "center",
                transition: "border-color 0.3s, transform 0.3s",
                cursor: "default",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,1,79,0.45)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <i className={stat.icon} style={{ fontSize: "1.1rem", color: "#FF014F", marginBottom: "10px", display: "block", opacity: 0.9 }} />
              <div style={{ fontSize: "2.2rem", fontWeight: "800", color: "#fff", lineHeight: 1, marginBottom: "6px" }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.9px" }}>
                {locale === "fr" ? stat.labelFr : stat.labelEn}
              </div>
            </div>
          ))}
        </div>

        {/* ── Séparateur ── */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

        {/* ── Spécialités ── */}
        <div>
          <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "2.5px", fontWeight: "700", marginBottom: "14px" }}>
            {locale === "fr" ? "Spécialités" : "Specialties"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {specialties.map((spec) => (
              <div
                key={spec.titleFr}
                style={{
                  background: spec.bg,
                  border: `1px solid ${spec.border}`,
                  borderRadius: "14px",
                  padding: "18px 10px 16px",
                  textAlign: "center",
                  transition: "transform 0.3s, border-color 0.3s",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = spec.color + "55";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = spec.border;
                }}
              >
                <i className={spec.icon} style={{ fontSize: "1.5rem", color: spec.color, marginBottom: "10px", display: "block" }} />
                <p style={{ fontSize: "0.82rem", fontWeight: "700", color: "#fff", margin: "0 0 8px" }}>
                  {locale === "fr" ? spec.titleFr : spec.titleEn}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {(locale === "fr" ? spec.tagsFr : spec.tagsEn).map(tag => (
                    <span key={tag} style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.4 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tech Stack ── */}
        <div>
          <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "2.5px", fontWeight: "700", marginBottom: "12px" }}>
            {locale === "fr" ? "Stack Technique" : "Tech Stack"}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
            {techStack.map(tech => (
              <span
                key={tech.name}
                style={{
                  padding: "5px 14px",
                  background: tech.color,
                  border: `1px solid ${tech.border}`,
                  borderRadius: "50px",
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: "500",
                  transition: "transform 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLSpanElement).style.transform = "scale(1.07)"}
                onMouseLeave={e => (e.currentTarget as HTMLSpanElement).style.transform = "scale(1)"}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* ── Disponibilité ── */}
        <div style={{
          background: "rgba(34,197,94,0.07)",
          border: "1px solid rgba(34,197,94,0.22)",
          borderRadius: "14px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}>
          <span style={{
            width: "10px", height: "10px", borderRadius: "50%",
            background: "#22c55e", flexShrink: 0,
            animation: "ep-pulse 2.5s ease-in-out infinite",
          }} />
          <div>
            <p style={{ color: "#4ade80", fontWeight: "700", fontSize: "0.88rem", margin: "0 0 2px" }}>
              {locale === "fr" ? "Disponible pour de nouveaux projets" : "Available for new projects"}
            </p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.74rem", margin: 0 }}>
              Full-time · Freelance · Remote
            </p>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes ep-pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.18), 0 0 10px rgba(34,197,94,0.28); }
          50%       { box-shadow: 0 0 0 7px rgba(34,197,94,0.07), 0 0 22px rgba(34,197,94,0.5);  }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useTranslation } from "react-i18next";
// import Appointment from "./Appointment";

type PortfolioItem = {
  id?: string;
  imageSrc?: string;
  imageUrl?: string | null;
  title: string;
  key?: string;
  slug?: string;
  link?: string;
  features?: string[];
  tags?: string[];
  categories?: string[];
  descriptionFr?: string | null;
  descriptionEn?: string | null;
  impactTitleFr?: string | null;
  impactTitleEn?: string | null;
  impactContentFr?: string | null;
  impactContentEn?: string | null;
  projectDate?: string | null;
  myRoleFr?: string | null;
  myRoleEn?: string | null;
};

interface ProjectDetailsProps {
  portfolioItem: PortfolioItem;
}

export default function ProjectDetails({ portfolioItem }: ProjectDetailsProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "fr";

  const defaultFeatures = [
    "Ui/visual Design",
    "App Development",
    "Software Developer"
  ];

  const featuresToDisplay = portfolioItem.features || defaultFeatures;
  const image = portfolioItem.imageUrl || portfolioItem.imageSrc || "/assets/images/portfolio/portfolio-01.jpg";
  
  const content = locale === "fr" 
    ? (portfolioItem.descriptionFr || (portfolioItem.key ? t(`portfolio.projects.${portfolioItem.key}.content`) : t("portfolio.description")))
    : (portfolioItem.descriptionEn || (portfolioItem.key ? t(`portfolio.projects.${portfolioItem.key}.content`) : t("portfolio.description")));

  const impactTitle = locale === "fr"
    ? (portfolioItem.impactTitleFr || (portfolioItem.key ? t(`portfolio.projects.${portfolioItem.key}.impact_title`) : "Impact du Projet"))
    : (portfolioItem.impactTitleEn || (portfolioItem.key ? t(`portfolio.projects.${portfolioItem.key}.impact_title`) : "Project Impact"));

  const impactContent = locale === "fr"
    ? (portfolioItem.impactContentFr || (portfolioItem.key ? t(`portfolio.projects.${portfolioItem.key}.impact_content`) : t("portfolio.description")))
    : (portfolioItem.impactContentEn || (portfolioItem.key ? t(`portfolio.projects.${portfolioItem.key}.impact_content`) : t("portfolio.description")));

  const myRole = locale === "fr"
    ? (portfolioItem.myRoleFr || (portfolioItem.key ? t(`portfolio.projects.${portfolioItem.key}.role`) : "Développeur"))
    : (portfolioItem.myRoleEn || (portfolioItem.key ? t(`portfolio.projects.${portfolioItem.key}.role`) : "Developer"));

  const tagsToShow = portfolioItem.tags && portfolioItem.tags.length > 0 
    ? portfolioItem.tags 
    : (portfolioItem.id ? [] : ["React", "Next.js", "Tailwind"]);

  return (
    <div className="project-details-area-wrapper tmp-section-gap">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="project-details-thumnail-wrap">
              <img
                loading="lazy"
                alt="thumbnail"
                src={image}
                width={1290}
                height={560}
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
          <div className="col-lg-8">
            <div className="project-details-content-wrap">
              <h2 className="title">
                {portfolioItem.key
                  ? t(`portfolio.projects.${portfolioItem.key}.title`)
                  : portfolioItem.title}
              </h2>
              <div className="docs whitespace-pre-wrap">
                {content}
              </div>

              {featuresToDisplay.length > 0 && (
                <div className="check-box-wrap">
                  <h3 className="mini-title">{t("portfolio.details.features_title")}</h3>
                  <ul>
                    {featuresToDisplay.map((featureKey, index) => (
                      <li key={index}>
                        <h4 className="check-box-item">
                          <span>
                            <i className="fa-solid fa-circle-check" />
                          </span>
                          {t(`portfolio.features.${featureKey}`)}
                        </h4>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <h2 className="mini-title">
                {impactTitle}
              </h2>
              <div className="docs whitespace-pre-wrap">
                {impactContent}
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="signle-side-bar project-details-area tmponhover">
              <div className="header">
                <h3 className="title">{t("portfolio.details.title")}</h3>
              </div>
              <div className="body">
                <div className="project-details-info">
                  {t("portfolio.details.name")}: <span>{portfolioItem.key ? t(`portfolio.projects.${portfolioItem.key}.title`) : portfolioItem.title}</span>
                </div>
                <div className="project-details-info">
                  {t("portfolio.details.author")}: <span>Kabirou Djantchiemo</span>
                </div>
                <div className="project-details-info">
                  {t("portfolio.details.date")}: <span>{portfolioItem.projectDate || "2024"}</span>
                </div>
                <div className="project-details-info">
                  {t("portfolio.details.tags")}: <span>{portfolioItem.categories?.join(", ") || "Software"}</span>
                </div>
                <div className="project-details-info">
                  {t("portfolio.details.my_role")}: <span>{myRole}</span>
                </div>
                
                {tagsToShow.length > 0 && (
                  <div className="project-details-info mt--20">
                    <div className="flex flex-wrap gap-2 mt-2">
                       {tagsToShow.map((tag, i) => (
                         <span key={i} className="px-2 py-1 bg-muted text-xs rounded-md border border-border">
                           {tag}
                         </span>
                       ))}
                    </div>
                  </div>
                )}

                {portfolioItem.link && (
                  <div className="project-details-info mt--30">
                    <a 
                      href={portfolioItem.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="tmp-btn w-100 text-center"
                      style={{ 
                        display: 'block', 
                        padding: '12px', 
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    >
                      {t("portfolio.details.visit_website")} <i className="fa-solid fa-arrow-up-right" style={{ marginLeft: '8px', fontSize: '12px' }} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

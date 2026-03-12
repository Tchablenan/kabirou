"use client";

import ProjectDetails from "@/components/projects/ProjectDetails";
import { allPortfolioItems } from "@/data/portfolio";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Header3 from "@/components/headers/Header3";
import Header5 from "@/components/headers/Header5";
import Footer1 from "@/components/footers/Footer1";
import Copyright from "@/components/footers/Copyright";
import React from "react";

import { useState, useEffect } from "react";

export default function ProjectDetailsPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "fr";
  const params = useParams();
  const { slug } = params;
  const [portfolioItem, setPortfolioItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchProject();
    }
  }, [slug]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/by-slug/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setPortfolioItem(data);
      } else {
        setPortfolioItem(null);
      }
    } catch (error) {
      setPortfolioItem(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!portfolioItem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">Projet Introuvable</h1>
        <Link href={`/${locale}`} className="tmp-btn">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <>
      <Header3 />
      <Header5 />
      <div className="page-with-left-header dashboard-style-header index-seven">
          <div className="breadcrumb-area breadcrumb-bg">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="breadcrumb-inner text-center">
                    <h1 className="title split-collab">
                      {portfolioItem.title}
                    </h1>
                    <ul className="page-list">
                      <li className="tmp-breadcrumb-item">
                        <Link href={`/${locale}`}>{t("navigation.home")}</Link>
                      </li>
                      <li className="icon">
                        <i className="fa-solid fa-angle-right" />
                      </li>
                      <li className="tmp-breadcrumb-item active">
                        {t("portfolio.details.title")}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProjectDetails portfolioItem={portfolioItem} />
          <Footer1 />
          <Copyright />
      </div>
    </>
  );
}

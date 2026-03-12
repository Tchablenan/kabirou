"use client";

import BlogDetails from "@/components/blog/BlogDetails";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Header3 from "@/components/headers/Header3";
import Header5 from "@/components/headers/Header5";
import Footer1 from "@/components/footers/Footer1";
import Copyright from "@/components/footers/Copyright";
import React, { useState, useEffect } from "react";

export default function BlogPostPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "fr";
  const params = useParams();
  const { slug } = params;
  const [blog, setBlog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blogs/by-slug/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setBlog(data);
      } else {
        setBlog(null);
      }
    } catch (error) {
      setBlog(null);
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

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">{locale === "fr" ? "Article Introuvable" : "Post Not Found"}</h1>
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
                      {locale === "fr" ? blog.titleFr : blog.titleEn}
                    </h1>
                    <ul className="page-list">
                      <li className="tmp-breadcrumb-item">
                        <Link href={`/${locale}`}>{t("navigation.home")}</Link>
                      </li>
                      <li className="icon">
                        <i className="fa-solid fa-angle-right" />
                      </li>
                      <li className="tmp-breadcrumb-item active">
                        {t("navigation.blog")}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <BlogDetails blog={blog} />
          <Footer1 />
          <Copyright />
      </div>
    </>
  );
}

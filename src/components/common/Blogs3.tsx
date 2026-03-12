"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface BlogPost {
  id: string;
  titleEn: string;
  titleFr: string;
  slug: string;
  imageUrl: string;
  author: string;
  date: string;
  displayOrder: number;
}

export default function Blogs3({
  parentClass = "blog-and-news-are tmp-section-gap",
  isLight = false,
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "fr";
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBlogs(data);
        }
      })
      .catch((err) => console.error("Failed to fetch blogs", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className={parentClass} id="blog">
      <div className="container">
        <div className="section-head mb--50">
          <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
            <span className="subtitle">{t("navigation.blog")}</span>
          </div>
          <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
            {t("blog.title")}
          </h2>
        </div>
        <div className="row">
          {blogs.map((blog, index) => (
            <div key={blog.id} className="col-lg-4 col-md-6 col-sm-6">
              <div
                className={`blog-card tmp-hover-link tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}
              >
                <div className="img-box">
                  <Link
                    href={`/blog-details/${blog.slug}`}
                  >
                    <img
                      loading="lazy"
                      className="img-primary hidden-on-mobile"
                      alt={locale === "fr" ? blog.titleFr : blog.titleEn}
                      width={410}
                      height={294}
                      src={blog.imageUrl || "/assets/images/blog/blog-img-4.jpg"}
                    />
                    <img
                      loading="lazy"
                      className="img-secondary"
                      alt={locale === "fr" ? blog.titleFr : blog.titleEn}
                      width={410}
                      height={294}
                      src={blog.imageUrl || "/assets/images/blog/blog-img-4.jpg"}
                    />
                  </Link>
                  <ul className="blog-tags">
                    <li>
                      <span className="tag-icon">
                        <i className="fa-regular fa-user" />
                      </span>
                      {blog.author || "Admin"}
                    </li>
                    <li>
                      <span className="tag-icon">
                        <i className="fa-solid fa-calendar-days" />
                      </span>
                      {blog.date}
                    </li>
                  </ul>
                </div>
                <div className="blog-content-wrap">
                  <h3 className="blog-title v2">
                    <Link
                      className="link"
                      href={`/blog-details/${blog.slug}`}
                    >
                      {locale === "fr" ? blog.titleFr : blog.titleEn}
                    </Link>
                  </h3>
                  <Link
                    href={`/blog-details/${blog.slug}`}
                    className="read-more-btn v2"
                  >
                    {locale === "fr" ? "Lire la suite" : "Read More"}{" "}
                    <span className="read-more-icon">
                      <i className="fa-solid fa-angle-right" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {!isLoading && blogs.length === 0 && (
            <div className="col-12 text-center">
              <p>{locale === "fr" ? "Aucun article de blog pour le moment." : "No blog posts yet."}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

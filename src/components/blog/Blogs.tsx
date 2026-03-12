import { blogData } from "@/data/blogs";
import BlogSidebar from "./BlogSidebar";

import Link from "next/link";
export default function Blogs({ allBlogs = blogData, isLight = false }) {
  return (
    <div className="blog-classic-area-wrapper tmp-section-gap">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            {allBlogs.slice(0, 3).map((blog, i) => (
              <div
                key={i}
                className={`blog-classic-card tmp-scroll-trigger tmponhover tmp-fade-in ${
                  i + 1
                }`}
              >
                <div className="img-box">
                  <Link
                    href={`/blog-details${isLight ? "-white" : ""}/${blog.slug}`}
                  >
                    <img
                      loading="lazy"
                      className="img-primary hidden-on-mobile"
                      alt={"blog.altText"}
                      src={blog.imageSrc}
                      width={850}
                      height={462}
                    />
                    <img
                      loading="lazy"
                      className="img-secondary"
                      alt={"blog.altText"}
                      src={blog.imageSrc}
                      width={850}
                      height={462}
                    />
                  </Link>
                </div>
                <div className="blog-classic-content">
                  <div className="blog-classic-tag">
                    <ul>
                      <li>
                        <div className="tag-wrap">
                          <i className="fa-solid fa-tag" />
                          <h4 className="tag-title">Web design</h4>
                        </div>
                      </li>
                      <li>
                        <div className="tag-wrap">
                          <i className="fa-regular fa-comment" />
                          <h4 className="tag-title">Comments (05)</h4>
                        </div>
                      </li>
                      <li>
                        <div className="tag-wrap">
                          <i className="fa-solid fa-calendar-day" />
                          <h4 className="tag-title">Comments (05)</h4>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <h2 className="title">
                    <Link
                      href={`/blog-details${isLight ? "-white" : ""}/${
                        blog.slug
                      }`}
                    >
                      {blog.title}
                    </Link>
                  </h2>
                  <p className="para">{blog.description}</p>
                  <div className="tmp-button-here">
                    <Link
                      className="tmp-btn hover-icon-reverse radius-round btn-border btn-md"
                      href={`/blog-details${isLight ? "-white" : ""}/${
                        blog.slug
                      }`}
                    >
                      <span className="icon-reverse-wrapper">
                        <span className="btn-text">Read More</span>
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
            ))}
            {allBlogs.length ? (
              <div className="tmp-pagination-button">
                <a href="#" className="pagination-btn">
                  <i className="fa-sharp fa-regular fa-arrow-left" />
                </a>
                <a href="#" className="pagination-btn active">
                  1
                </a>
                <a href="#" className="pagination-btn">
                  2
                </a>
                <a href="#" className="pagination-btn">
                  3
                </a>
                <a href="#" className="pagination-btn">
                  <i className="fa-sharp fa-regular fa-arrow-right" />
                </a>
              </div>
            ) : (
              <h3 className="text-center">No Blogs Found</h3>
            )}
          </div>
          <div className="col-lg-4">
            <BlogSidebar isLight={isLight} />
          </div>
        </div>
      </div>
    </div>
  );
}

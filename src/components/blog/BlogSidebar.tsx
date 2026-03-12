import { allBlogs, categories, posts, tags } from "@/data/blogs";

import Link from "next/link";
import { slugify } from "@/utlis/slugify";

export default function BlogSidebar({ isLight = false }) {
  return (
    <div className="tmp-sidebar">
      <div className="signle-side-bar search-area tmponhover">
        <div className="body">
          <div className="search-area">
            <input type="text" placeholder="Type here" required />
            <button>
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </div>
        </div>
      </div>
      <div className="signle-side-bar recent-post-area tmponhover">
        <div className="header">
          <h3 className="title">Category</h3>
        </div>
        <div className="body">
          {categories.map((post, index) => (
            <Link
              href={`/blog${isLight ? "-white" : ""}/category/${slugify(
                post.title
              )}`}
              className="single-post"
              key={index}
            >
              <span className="single-post-left">
                <i className="fa-solid fa-arrow-right" />
                <span className="post-title">{post.title}</span>
              </span>
              <span className="post-num">
                (
                {
                  allBlogs.filter(
                    (blog) =>
                      "categories" in blog &&
                      blog.categories?.includes(post.title)
                  ).length
                }
                )
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className="signle-side-bar recent-post-area tmponhover">
        <div className="header">
          <h3 className="title">Recent Post</h3>
        </div>
        <div className="body">
          {posts.map((post) => (
            <div key={post.id} className="single-post-card tmp-hover-link">
              <div className="single-post-card-img">
                <img
                  loading="lazy"
                  alt=""
                  src={post.imageSrc}
                  width={82}
                  height={92}
                />
              </div>
              <div className="single-post-right">
                <div className="single-post-top">
                  <i className="fa-regular fa-folder-open" />
                  <p className="post-title">{post.category}</p>
                </div>
                <h3 className="post-title">
                  <Link
                    className="link"
                    href={`/blog-details${isLight ? "-white" : ""}/${post.slug}`}
                  >
                    {post.title}
                  </Link>
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="signle-side-bar tmponhover">
        <div className="header">
          <h3 className="title">About Me</h3>
        </div>
        <div className="body">
          <div className="about-me-details">
            <div className="about-me-details-head">
              <div className="about-me-img">
                <img
                  loading="lazy"
                  alt="about-me-user-img"
                  src="/assets/images/blog/about-me-user-img.png"
                  width={600}
                  height={600}
                />
              </div>
              <div className="about-me-right-content">
                <h3 className="title">Fatima Afrafy</h3>
                <p className="para">UI/UX Designer</p>
                <div className="social-link">
                  <a href="#">
                    <i className="fa-brands fa-instagram" />
                  </a>
                  <a href="#">
                    <i className="fa-brands fa-linkedin-in" />
                  </a>
                  <a href="#">
                    <i className="fa-brands fa-twitter" />
                  </a>
                  <a href="#">
                    <i className="fa-brands fa-facebook-f" />
                  </a>
                </div>
              </div>
            </div>
            <p className="about-me-para">
              Aliquam eros justo, posuere loborti viverra ullamcorper posuere
              viverra .Aliquam eros justo, posuere justo, posuere.
            </p>
          </div>
        </div>
      </div>
      <div className="signle-side-bar tmponhover">
        <div className="header">
          <h3 className="title">Tags</h3>
        </div>
        <div className="body">
          <div className="tags-wrapper">
            {tags.map((tag, index) => (
              <Link
                href={`/blog${isLight ? "-white" : ""}/tag/${slugify(tag)}`}
                className="tag-link"
                key={index}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

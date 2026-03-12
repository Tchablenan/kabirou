import Link from "next/link";
import { portfolioItems12 } from "@/data/portfolio";

export default function Projects({ isLight = false }) {
  return (
    <section className="tmp-latest-portfolio tmp-section-gap">
      <div className="container">
        <div className="row">
          {portfolioItems12.map((item) => (
            <div
              key={item.id} // Use the unique ID as the key
              className="col-lg-6 col-md-6 col-12" // Static column classes
            >
              <div className="latest-portfolio-card v5 tmp-hover-link">
                {" "}
                {/* Static card classes */}
                <div className="portfoli-card-img">
                  {" "}
                  {/* Static img container classes */}
                  <div className="img-box v2">
                    {" "}
                    {/* Static img box classes */}
                    {/* Link wrapper around images - href is static */}
                    <Link
                      href={`/project-details${isLight ? "-white" : ""}/${
                        item.slug
                      }`}
                    >
                      {/* Image Primary - dynamic src, alt, width, height */}
                      <img
                        loading="lazy"
                        className="img-primary hidden-on-mobile"
                        alt={item.title} // Using item.title for alt
                        src={item.imageSrc}
                        width={item.width} // Using width from data
                        height={item.height} // Using height from data
                      />
                      {/* Image Secondary - dynamic src, alt, width, height */}
                      <img
                        loading="lazy"
                        className="img-secondary"
                        alt={item.title} // Using item.title for alt
                        src={item.imageSrc}
                        width={item.width} // Using width from data
                        height={item.height} // Using height from data
                      />
                    </Link>
                  </div>
                  {/* Icon Link after img-box - static href, classes, icon */}
                  {/* Included for all items, matching examples 2-4 */}
                  <Link
                    href={`/project-details${isLight ? "-white" : ""}/${
                      item.slug
                    }`}
                    className="img-link-icon"
                  >
                    <i className="fa-solid fa-arrow-up-long" />
                  </Link>
                </div>
                <div className="portfolio-card-content-wrap">
                  {" "}
                  {/* Static content wrap classes */}
                  <div className="content-left">
                    {" "}
                    {/* Static content left classes */}
                    <h3 className="portfolio-card-title">
                      {" "}
                      {/* Static title classes */}
                      {/* Title Link - static classes & href, dynamic text */}
                      <Link
                        className="link"
                        href={`/project-details${isLight ? "-white" : ""}/${
                          item.slug
                        }`}
                      >
                        {item.title} {/* Dynamic title text from data */}
                      </Link>
                    </h3>
                    <p className="portfoli-card-para">
                      {" "}
                      {/* Static paragraph classes */}
                      {item.description}{" "}
                      {/* Dynamic paragraph text from data */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

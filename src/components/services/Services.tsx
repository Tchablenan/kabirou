import Link from "next/link";
import { services4 } from "@/data/services";

export default function Services({ isLight = false }) {
  return (
    <section className="latest-service-area tmp-section-gap">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-sm-6">
            {services4
              .filter((service) => service.column === 1)
              .map((service) => (
                <Link
                  href={`/service-details${isLight ? "-white" : ""}/${
                    service.slug
                  }`}
                  className={`service-card-v2 tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${service.animationOrder}`}
                  key={service.id}
                >
                  <h2 className="service-card-num">
                    <span>{service.num}</span>
                    {service.title}
                  </h2>
                  <p className="service-para">{service.description}</p>
                </Link>
              ))}
          </div>

          {/* Column 2 */}
          <div className="col-lg-6 col-sm-6">
            {services4
              .filter((service) => service.column === 2)
              .map((service) => (
                <Link
                  href={`/service-details${isLight ? "-white" : ""}/${
                    service.slug
                  }`}
                  className={`service-card-v2 tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${service.animationOrder}`}
                  key={service.id}
                >
                  <h2 className="service-card-num">
                    <span>{service.num}</span>
                    {service.title}
                  </h2>
                  <p className="service-para">{service.description}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

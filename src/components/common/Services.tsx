import { services } from "@/data/services";

import Link from "next/link";
export default function Services({ isLight = false }) {
  return (
    <section className="service-area tmp-section-gap">
      <div className="container">
        <div className="row justify-content-center">
          {services.map((service) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={service.id}>
              <div
                className={`service-card-v1 tmp-scroll-trigger tmp-fade-in animation-order-${service.animationOrder} tmp-link-animation`}
              >
                <div className="service-card-icon">
                  <i className={service.icon} />
                </div>
                <h4 className="service-title">
                  <Link
                    href={`/service-details${isLight ? "-white" : ""}/${
                      service.slug
                    }`}
                  >
                    {service.title}
                  </Link>
                </h4>
                <p className="service-para">{service.projects}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

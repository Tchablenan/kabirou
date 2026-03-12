"use client";

import { services2 } from "@/data/services";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function Services({
  parentClass = "latest-service-area tmp-section-gapTop",
  isLight = false,
}) {
  const { t } = useTranslation();
  return (
    <section className={parentClass} id="service">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-head text-center mb--50">
              <span className="subtitle p-subtitle">{t("services.subtitle")}</span>
              <h2 className="title split-collab">{t("services.title")}</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-sm-6">
            {services2
              .filter((service) => service.column === 1)
              .map((service) =>
                service.isLink ? (
                  <Link
                    href={`/service-details${isLight ? "-white" : ""}/${service.slug
                      }`}
                    className={`service-card-v2 tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${service.animationOrder}`}
                    key={service.id}
                  >
                    <h2 className="service-card-num">
                      <span>{service.num}</span>
                      {t(`services.${service.key}.title`)}
                    </h2>
                    <p className="service-para">{t(`services.${service.key}.description`)}</p>
                  </Link>
                ) : (
                  <div
                    className={`service-card-v2 tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${service.animationOrder}`}
                    key={service.id}
                  >
                    <h2 className="service-card-num">
                      <span>{service.num}</span>
                      {t(`services.${service.key}.title`)}
                    </h2>
                    <p className="service-para">{t(`services.${service.key}.description`)}</p>
                  </div>
                )
              )}
          </div>

          {/* Second column */}
          <div className="col-lg-6 col-sm-6">
            {services2
              .filter((service) => service.column === 2)
              .map((service) =>
                service.isLink ? (
                  <Link
                    href={`/service-details${isLight ? "-white" : ""}/${service.slug
                      }`}
                    className={`service-card-v2 tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${service.animationOrder}`}
                    key={service.id}
                  >
                    <h2 className="service-card-num">
                      <span>{service.num}</span>
                      {t(`services.${service.key}.title`)}
                    </h2>
                    <p className="service-para">{t(`services.${service.key}.description`)}</p>
                  </Link>
                ) : (
                  <div
                    className={`service-card-v2 tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${service.animationOrder}`}
                    key={service.id}
                  >
                    <h2 className="service-card-num">
                      <span>{service.num}</span>
                      {t(`services.${service.key}.title`)}
                    </h2>
                    <p className="service-para">{t(`services.${service.key}.description`)}</p>
                  </div>
                )
              )}
          </div>
        </div>
      </div>
    </section>
  );
}

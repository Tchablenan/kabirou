"use client";

import Link from "next/link";
import { pricingPlans } from "@/data/pricing";
import { useTranslation } from "react-i18next";

export default function Pricing({
  parentClass = "our-price-plan-area tmp-section-gapTop",
}) {
  const { t } = useTranslation();
  return (
    <section className={parentClass} id="pricing">
      <div className="container">
        <div className="section-head mb--50">
          <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
            <span className="subtitle">{t("pricing.subtitle")}</span>
          </div>
          <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
            {t("pricing.title")}
          </h2>
        </div>
        <div className="row align-items-center">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`col-lg-4 col-md-6 tmp-scroll-trigger tmp-fade-in animation-order-${plan.animationOrder}`}
            >
              <div
                className={`price-plan-card tmponhover blur-style-two ${plan.active ? "active" : ""
                  }`}
              >
                <span className="price-sub-title">{t(`pricing.${plan.key}`)}</span>
                <h3 className="main-price">{plan.price}</h3>
                <p className="per-month">{t("pricing.month")}</p>
                <div className="check-box">
                  <ul>
                    {plan.features.map((feature, i) => (
                      <li key={i}>
                        <div className="check-box-item">
                          <div className="box-icon">
                            <i className="fa-solid fa-circle-check" />
                          </div>
                          <p className="box-para">{t(`pricing.features.${feature}`)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="tmp-button-here">
                  <Link
                    className={`tmp-btn hover-icon-reverse btn-md radius-round ${plan.buttonStyle}`}
                    href="/contact"
                  >
                    <span className="icon-reverse-wrapper">
                      <span className="btn-text">{t("pricing.buy_now")}</span>
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
        </div>
      </div>
    </section>
  );
}

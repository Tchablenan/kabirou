"use client";

import Link from "next/link";
import Chat from "../common/Chat";
import ScrollTop from "../common/ScrollTop";
import Sidebar from "../headers/Sidebar";
import MobileMenu from "../headers/MobileMenu";
import MobileMenuOnepage from "../headers/MobileMenuOnepage";
import { footerLinks } from "@/data/footerLinks";
import { useTranslation } from "react-i18next";

export default function Footer1({
  darkLogo = "/assets/images/logo/white-logo-reeni.png",
  lightLogo = "/assets/images/logo/logo-white.png",
}) {
  const { t } = useTranslation();
  return (
    <>
      <footer className="footer-area footer-style-one-wrapper bg-color-footer bg_images tmp-section-gap">
        <div className="container">
          <div className="footer-main footer-style-one">
            <div className="row g-5">
              <div className="col-lg-5 col-md-6">
                <div className="single-footer-wrapper border-right mr--20">
                  <div className="logo">
                    <Link href={`/`}>
                      <img
                        loading="lazy"
                        className="logo-dark"
                        alt="Reeni - Personal Portfolio"
                        src={darkLogo}
                        width={121}
                        height={41}
                      />
                      <img
                        loading="lazy"
                        className="logo-white"
                        alt="Reeni - Personal Portfolio"
                        src={lightLogo}
                        width={121}
                        height={40}
                      />
                    </Link>
                  </div>
                  <p className="description">
                    {t("footer.get_ready")}
                  </p>
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="newsletter-form-1 mt--40"
                  >
                    <input type="email" placeholder={t("contact.email")} />
                    <span className="form-icon">
                      <i className="fa-regular fa-envelope" />
                    </span>
                  </form>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="single-footer-wrapper quick-link-wrap">
                  <h5 className="ft-title">{t("footer.quick_link")}</h5>
                  <ul className="ft-link tmp-link-animation dark-content">
                    {footerLinks.map((item, index) => (
                      <li key={index}>
                        <Link href={item.href}>{t(`navigation.${item.key}`)}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="single-footer-wrapper contact-wrap">
                  <h5 className="ft-title">{t("footer.contact")}</h5>
                  <ul className="ft-link tmp-link-animation">
                    <li>
                      <span className="ft-icon">
                        <i className="fa-solid fa-envelope" />
                      </span>
                      <a href="mailto:kdjantchiemo@gmail.com">kdjantchiemo@gmail.com</a>
                    </li>
                    <li>
                      <span className="ft-icon">
                        <i className="fa-solid fa-location-dot" />
                      </span>
                      Accra, Ghana
                    </li>
                    <li>
                      <span className="ft-icon">
                        <i className="fa-solid fa-phone" />
                      </span>
                      <a href="tel:+22892874467">+228 92874467</a> / <a href="tel:+2330552821916">+233 0552821916</a>
                    </li>
                  </ul>
                  <div className="social-link footer">
                    <a href="https://github.com/Tchablenan" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-github" />
                    </a>
                    <a href="https://linkedin.com/in/kabirou-djantchiemo" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-linkedin-in" />
                    </a>
                    <a href="https://twitter.com/tchablenan" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-twitter" />
                    </a>
                    <a href="#">
                      <i className="fa-brands fa-facebook-f" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>{" "}
      <Chat />
      <ScrollTop />
      <Sidebar />
      <MobileMenu />
      <MobileMenuOnepage />
    </>
  );
}

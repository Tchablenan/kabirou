"use client";

import Nav1 from "./Nav1";
import Link from "next/link";
import { useModalUI } from "@/context/ModalUIContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Header1({
  darkLogo = "/assets/images/logo/white-logo-reeni.png",
  lightLogo = "/assets/images/logo/logo-white.png",
}) {
  const { openModal } = useModalUI();
  const [isSticky, setIsSticky] = useState(false);
  const { i18n } = useTranslation();
  const locale = i18n.language || "fr";

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsSticky(window.scrollY > 150);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <header
      className={`tmp-header-area-start header-one header--sticky header--transparent ${
        isSticky ? "sticky" : ""
      } `}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="header-content">
              <div className="logo">
                <Link href={`/${locale}`}>
                  <img
                    loading="lazy"
                    className="logo-dark"
                    alt="Reeni - Personal Portfolio HTML Template for developers and freelancers"
                    src={darkLogo}
                    width={121}
                    height={41}
                  />
                  <img
                    loading="lazy"
                    className="logo-white"
                    alt="Reeni - Personal Portfolio HTML Template for developers and freelancers"
                    src={lightLogo}
                    width={121}
                    height={40}
                  />
                </Link>
              </div>
              <nav className="tmp-mainmenu-nav d-none d-xl-block">
                <Nav1 />
              </nav>
              <div className="tmp-header-right">
                <div className="social-share-wrapper d-none d-md-block">
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
                <div className="actions-area">
                  <div className="tmp-side-collups-area d-none d-xl-block">
                    <button
                      className="tmp-menu-bars tmp_button_active"
                      onClick={() => openModal("sidebar")}
                    >
                      <i className="fa-regular fa-bars-staggered" />
                    </button>
                  </div>
                  <div className="tmp-side-collups-area d-block d-xl-none">
                    <button
                      className="tmp-menu-bars humberger_menu_active"
                      onClick={() => openModal("mobileMenu1")}
                    >
                      <i className="fa-regular fa-bars-staggered" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

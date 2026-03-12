"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import OnepageNavMobile from "./OnepageNavMobile";
import { useModalUI } from "@/context/ModalUIContext";
import { useTranslation } from "react-i18next";

export default function MobileMenuOnepage() {
  const menuRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const { openModals, closeModal } = useModalUI();
  const { i18n } = useTranslation();
  const locale = i18n.language || "fr";
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as Node;

      if (menuRef.current && menuRef.current.contains(target)) {
        if (innerRef.current && innerRef.current.contains(target)) {
          // Click inside innerRef — do nothing
        } else {
          closeModal("mobileMenu2");
        }
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [closeModal]);

  return (
    <div className="d-block d-xl-none">
      <div
        ref={menuRef}
        className={`tmp-popup-mobile-menu mobile-menu-onepage ${
          openModals.mobileMenu2 ? "active" : ""
        }`}
      >
        <div ref={innerRef} className="inner">
          <div className="header-top">
            <div className="logo">
              <Link href={`/${locale}`} className="logo-area">
                <img
                  loading="lazy"
                  className="logo-dark"
                  alt="Reeni - Personal Portfolio HTML Template for developers and freelancers"
                  src="/assets/images/logo/white-logo-reeni.png"
                  width={121}
                  height={41}
                />
                <img
                  loading="lazy"
                  className="logo-white"
                  alt="Reeni - Personal Portfolio HTML Template for developers and freelancers"
                  src="/assets/images/logo/logo-white.png"
                  width={121}
                  height={40}
                />
              </Link>
            </div>
            <div className="close-menu">
              <button
                className="close-button tmp-round-action-btn"
                onClick={() => closeModal("mobileMenu2")}
              >
                <i className="fa-sharp fa-light fa-xmark" />
              </button>
            </div>
          </div>
          <OnepageNavMobile />
          <div className="social-wrapper mt--40">
            <span className="subtitle">find with me</span>
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
          {/* social area end */}
        </div>
      </div>
    </div>
  );
}

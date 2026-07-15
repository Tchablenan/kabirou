"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import OnepageNavMobile from "./OnepageNavMobile";
import { useModalUI } from "@/context/ModalUIContext";
import { useTranslation } from "react-i18next";
import SocialLinks from "../common/SocialLinks";

export default function MobileMenuOnepage() {
  const menuRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const { openModals, closeModal } = useModalUI();
  const { t, i18n } = useTranslation();
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
                  alt={t("a11y.logo_alt")}
                  src="/assets/images/kbi/4KB.webp"
                  style={{ 
                    width: "80px", 
                    height: "80px", 
                    borderRadius: "50%", 
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              </Link>
            </div>
            <div className="close-menu">
              <button
                className="close-button tmp-round-action-btn"
                onClick={() => closeModal("mobileMenu2")}
                aria-label={t("a11y.close_menu")}
              >
                <i className="fa-sharp fa-light fa-xmark" aria-hidden="true" />
              </button>
            </div>
          </div>
          <OnepageNavMobile />
          <div className="social-wrapper mt--40">
            <span className="subtitle">find with me</span>
            <div className="social-link">
                <SocialLinks />
            </div>
          </div>
          {/* social area end */}
        </div>
      </div>
    </div>
  );
}

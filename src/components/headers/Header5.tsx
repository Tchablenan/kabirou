"use client";

import { useModalUI } from "@/context/ModalUIContext";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Header5() {
  const { openModal } = useModalUI();
  const [isSticky, setIsSticky] = useState(false);
  const { i18n } = useTranslation();
  const locale = i18n.language || "fr";

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`tmp-header-area-mobile header--sticky ${isSticky ? "sticky" : ""
        }`}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="header-mobile-inner d-flex justify-content-between align-items-center">
              <div className="logo">
                <Link href={`/${locale}`}>
                  <img
                    src="/assets/images/logo/logo-01.png"
                    alt="corporate_logo"
                    width={121}
                    height={41}
                  />
                </Link>
              </div>
              <div className="header-right-mobile d-flex align-items-center gap-3">
                <LanguageSwitcher />
                <button
                  className="tmp-hamburger-menu"
                  onClick={() => openModal("mobileMenu2")}
                >
                  <i className="fa-sharp fa-regular fa-bars" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

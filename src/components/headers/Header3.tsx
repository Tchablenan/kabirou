"use client";

import Link from "next/link";
import Image from "next/image";
import OnepageNav2 from "./OnepageNav2";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import SocialLinks from "../common/SocialLinks";

export default function Header3() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "fr";

  return (
    <div className="d-none d-xl-block header-style-2 header-left">
      <header className="tmp-header-area d-flex align-items-start flex-column header-left-sticky">
        <div className="inner-wrapper">
          <div className="logo-area">
            <Link href={`/${locale}`}>
              <Image
                alt={t("a11y.logo_alt")}
                src="/assets/images/kbi/4KB.webp"
                width={350}
                height={350}
                priority
                style={{ objectFit: "cover", width: "100%", height: "auto", aspectRatio: "1/1" }}
              />
            </Link>
          </div>
          <nav
            id="sideNavs"
            className="mainmenu-nav navbar-example2 onepagenav"
          >
            <ul className="primary-menu nav nav-pills">
              <OnepageNav2 />
            </ul>
          </nav>
          <LanguageSwitcher />
          <div className="footer">
            <div className="social-share-style-1">
              <span className="title">Find With Me</span>
              <div className="social-link">
                <SocialLinks />
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

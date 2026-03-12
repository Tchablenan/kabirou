import Link from "next/link";
import OnepageNav2 from "./OnepageNav2";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useTranslation } from "react-i18next";
export default function Header3() {
  const { i18n } = useTranslation();
  const locale = i18n.language || "fr";

  return (
    <div className="d-none d-xl-block header-style-2 header-left">
      <header className="tmp-header-area d-flex align-items-start flex-column header-left-sticky">
        <div className="inner-wrapper">
          <div className="logo-area">
            <Link href={`/${locale}`}>
              <img
                loading="lazy"
                alt="personal-logo"
                src="/assets/images/kbi/4KB.jpeg"
                width={350}
                height={350}
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
                <a href="https://github.com/Tchablenan" target="_blank" rel="noreferrer">
                  <i className="fa-brands fa-github" />
                </a>
                <a href="https://linkedin.com/in/kabirou-djantchiemo" target="_blank" rel="noreferrer">
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
          </div>
        </div>
      </header>
    </div>
  );
}

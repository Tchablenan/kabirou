"use client";

import { menuItems } from "@/data/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useModalUI } from "@/context/ModalUIContext";
import { useTranslation } from "react-i18next";

export default function MobileMenu() {
  const { openModals, closeModal } = useModalUI();
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const locale = i18n.language || "fr";
  const menuRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [activeParent, setActiveParent] = useState(-1);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as Node;

      if (menuRef.current && menuRef.current.contains(target)) {
        if (innerRef.current && innerRef.current.contains(target)) {
          // Click inside innerRef — do nothing
        } else {
          closeModal("mobileMenu1");
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
        className={`tmp-popup-mobile-menu ${
          openModals.mobileMenu1 ? "active" : ""
        }`}
      >
        <div ref={innerRef} className="inner">
          <div className="header-top">
            <div className="logo">
              <Link href={`/${locale}`} className="logo-area">
                <img
                  loading="lazy"
                  className="logo-dark"
                  alt="Reeni - Personal Portfolio"
                  src="/assets/images/logo/white-logo-reeni.png"
                  width={121}
                  height={41}
                />
                <img
                  loading="lazy"
                  className="logo-white"
                  alt="Reeni - Personal Portfolio"
                  src="/assets/images/logo/logo-white.png"
                  width={121}
                  height={40}
                />
              </Link>
            </div>
            <div className="close-menu">
              <button
                className="close-button tmp-round-action-btn"
                onClick={() => closeModal("mobileMenu1")}
              >
                <i className="fa-sharp fa-light fa-xmark" />
              </button>
            </div>
          </div>
          <ul className="tmp-mainmenu">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`${item.hasDropdown ? "has-dropdown" : ""} ${
                  item.submenu
                    ? item.submenu.some(
                        (elm) =>
                          elm.href.split("/")[1] == pathname.split("/")[1]
                      )
                      ? "menu-item-open"
                      : ""
                    : ""
                }`}
              >
                {item.isLink ? (
                  <Link
                    className={`${
                      item.href.split("/")[1] == pathname.split("/")[1]
                        ? "active"
                        : ""
                    }`}
                    href={item.href.startsWith("/") ? `/${locale}${item.href}` : item.href}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href.startsWith("/") ? `/${locale}${item.href}` : item.href}
                    onClick={() =>
                      setActiveParent((pre) => (pre == index ? -1 : index))
                    }
                    className={activeParent == index ? "open" : ""}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <i className="fa-regular fa-chevron-down" />
                    )}
                  </a>
                )}

                {item.hasDropdown && (
                  <ul
                    className="submenu"
                    style={{
                      display: activeParent == index ? "block" : "none",
                    }}
                  >
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          className={`${
                            subItem.href.split("/")[1] == pathname.split("/")[1]
                              ? "active"
                              : ""
                          }`}
                          href={subItem.href.startsWith("/") ? `/${locale}${subItem.href}` : subItem.href}
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

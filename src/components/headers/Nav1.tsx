"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems, menuItemsLight } from "@/data/menu";
import { useTranslation } from "react-i18next";

export default function Nav1() {
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const locale = i18n.language || "fr";

  return (
    <>
      <ul className="tmp-mainmenu dark-content">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`${item.hasDropdown ? "has-dropdown" : ""} ${
              item.submenu
                ? item.submenu.some(
                    (elm) => elm.href.split("/")[1] == pathname.split("/")[1]
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
              <a href={item.href.startsWith("/") ? `/${locale}${item.href}` : item.href}>
                {item.label}
                {item.hasDropdown && (
                  <i className="fa-regular fa-chevron-down" />
                )}
              </a>
            )}

            {item.hasDropdown && (
              <ul className="submenu">
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
      <ul className="tmp-mainmenu light-content">
        {menuItemsLight.map((item, index) => (
          <li
            key={index}
            className={`${item.hasDropdown ? "has-dropdown" : ""} ${
              item.submenu
                ? item.submenu.some(
                    (elm) => elm.href.split("/")[1] == pathname.split("/")[1]
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
              <a href={item.href.startsWith("/") ? `/${locale}${item.href}` : item.href}>
                {item.label}
                {item.hasDropdown && (
                  <i className="fa-regular fa-chevron-down" />
                )}
              </a>
            )}

            {item.hasDropdown && (
              <ul className="submenu">
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
    </>
  );
}

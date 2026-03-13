"use client";

import { useModalUI } from "@/context/ModalUIContext";
import { useEffect, useState, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const navItems = [
  { id: 1, href: "#home", text: "Home" },
  { id: 2, href: "#skills", text: "Skills" },
  { id: 3, href: "#service", text: "Service" },
  { id: 4, href: "#resume", text: "Experiences" },
  { id: 5, href: "#portfolio", text: "Portfolio" },
  { id: 6, href: "#blog", text: "Blog" },
  { id: 7, href: "#contacts", text: "Contact" },
];

export default function OnepageNavMobile({
  sectionIds = navItems,
  activeClass = "current",
}) {
  const { closeModal } = useModalUI();
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(
    sectionIds[0].href.replace("#", "")
  );

  useEffect(() => {
    // Create an IntersectionObserver to track visibility of sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Update active section when the section is visible in the viewport
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-50% 0px", // Trigger when section is 50% visible
      }
    );

    // Observe each section
    setTimeout(() => {
      sectionIds.forEach((elm) => {
        const element = document.querySelector(elm.href);
        if (element) {
          observer.observe(element);
        }
      });
    });
    return () => {
      // Cleanup the observer when the component unmounts
      observer.disconnect();
    };
  }, [sectionIds]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const locale = i18n.language || "fr";
    
    const isHomePage = pathname === "/" || pathname === `/${locale}` || pathname === `/${locale}/`;

    if (isHomePage) {
      e.preventDefault();
      document
        .querySelector(id)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      closeModal("mobileMenu2");
    } else {
      e.preventDefault();
      // Go back to home page with the anchor
      router.push(`/${locale}${id}`);
      closeModal("mobileMenu1");
      closeModal("mobileMenu2");
    }
  };

  return (
    <ul className="tmp-mainmenu onepagenav-click">
      {navItems.map((item) => (
        <li
          key={item.id}
          className={
            activeSection == item.href.replace("#", "")
              ? activeClass
              : "nav-item"
          }
        >
          <a
            className="smoth-animation"
            onClick={(e) => handleClick(e, item.href)}
            href={item.href}
          >
            {t(`navigation.${item.text.toLowerCase()}`)}
          </a>
        </li>
      ))}
    </ul>
  );
}

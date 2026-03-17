"use client";

import { menuItems } from "@/data/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useModalUI } from "@/context/ModalUIContext";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/hooks/useProfile";
import OnepageNavMobile from "./OnepageNavMobile";

export default function MobileMenu() {
  const { openModals, closeModal } = useModalUI();
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const { profile } = useProfile();
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
                  alt="personal-logo"
                  src="/assets/images/kbi/4KB.jpeg"
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
                onClick={() => closeModal("mobileMenu1")}
              >
                <i className="fa-sharp fa-light fa-xmark" />
              </button>
            </div>
          </div>
          <OnepageNavMobile />
          
          <div className="footer mt--40">
            <div className="social-share-style-1">
              <span className="title">Find With Me</span>
              <div className="social-link">
                {profile?.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-github" />
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-linkedin-in" />
                  </a>
                )}
                {profile?.twitterUrl && (
                  <a href={profile.twitterUrl} target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-twitter" />
                  </a>
                )}
                {profile?.facebookUrl && (
                  <a href={profile.facebookUrl} target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-facebook-f" />
                  </a>
                )}
                
                {/* Fallback social links if none are provided */}
                {!profile?.githubUrl && !profile?.linkedinUrl && !profile?.twitterUrl && !profile?.facebookUrl && (
                   <>
                    <a href="https://github.com/Tchablenan" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-github" />
                    </a>
                    <a href="https://linkedin.com/in/kabirou-djantchiemo" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-linkedin-in" />
                    </a>
                   </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

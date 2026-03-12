"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const pathname = usePathname();

    // Determine current locale from URL
    const segments = pathname.split("/");
    const currentLocale = (segments[1] === "en" || segments[1] === "fr") ? segments[1] : "fr";
    const nextLocale = currentLocale === "en" ? "fr" : "en";

    const handleLocaleChange = () => {
        const nextSegments = [...segments];
        if (nextSegments[1] === "en" || nextSegments[1] === "fr") {
            nextSegments[1] = nextLocale;
        } else {
            nextSegments.splice(1, 0, nextLocale);
        }
        
        const nextPath = nextSegments.join("/") || "/";
        
        // 1. Update i18n state immediately for instant feedback
        i18n.changeLanguage(nextLocale);
        
        // 2. Update address bar SILENTLY to avoid Next.js remounting the layout
        // This prevents the page from flickering or resetting to top
        window.history.replaceState(null, "", nextPath);
    };

    return (
        <div className="language-switcher-wrapper mt--20 mb--20">
            <button
                onClick={handleLocaleChange}
                className="tmp-btn radius-round"
                style={{
                    padding: "5px 15px",
                    fontSize: "14px",
                    minWidth: "60px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent",
                    color: "var(--color-white)",
                    transition: "all 0.3s ease"
                }}
            >
                <i className="fa-solid fa-globe" style={{ fontSize: "12px" }}></i>
                <span style={{ fontWeight: 600, textTransform: "uppercase" }}>
                    {currentLocale === "en" ? "FR" : "EN"}
                </span>
            </button>
        </div>
    );
}

"use client";

import { useEffect } from "react";

export function VisitTracker() {
  useEffect(() => {
    // We increment the visit count once when the public site is loaded
    // We use a simple sessionStorage check to avoid multi-counting during the same session in development
    if (typeof window !== "undefined" && !sessionStorage.getItem("site_visited")) {
      fetch("/api/visitors/increment", { method: "POST" })
        .then(() => {
          sessionStorage.setItem("site_visited", "true");
        })
        .catch((err) => console.error("Failed to track visit:", err));
    }
  }, []);

  return null;
}

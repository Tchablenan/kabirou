"use client";

import { useProfile } from "@/hooks/useProfile";

// Fallback shown while the profile loads or if no URL is set in the admin
const FALLBACK_LINKS = {
  githubUrl: "https://github.com/Tchablenan",
  linkedinUrl: "https://linkedin.com/in/kabirou-djantchiemo",
  twitterUrl: null as string | null,
  facebookUrl: null as string | null,
};

export default function SocialLinks() {
  const { profile } = useProfile();

  const hasAny =
    profile?.githubUrl ||
    profile?.linkedinUrl ||
    profile?.twitterUrl ||
    profile?.facebookUrl;

  const links = hasAny ? profile : FALLBACK_LINKS;

  const items = [
    { url: links?.githubUrl, icon: "fa-github", label: "GitHub" },
    { url: links?.linkedinUrl, icon: "fa-linkedin-in", label: "LinkedIn" },
    { url: links?.twitterUrl, icon: "fa-twitter", label: "Twitter / X" },
    { url: links?.facebookUrl, icon: "fa-facebook-f", label: "Facebook" },
  ];

  return (
    <>
      {items
        .filter((item) => item.url)
        .map((item) => (
          <a
            key={item.label}
            href={item.url!}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
          >
            <i className={`fa-brands ${item.icon}`} aria-hidden="true" />
          </a>
        ))}
    </>
  );
}

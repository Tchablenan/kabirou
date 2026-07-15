import type { Metadata } from "next";
// import "../../../public/assets/css/custom.css";
import "react-toastify/dist/ReactToastify.css";
import { ModalUIProvider } from "@/context/ModalUIContext";
import GlobaleffectProvider from "@/components/common/GlobaleffectProvider";
import I18nProvider from "@/context/I18nProvider";
import AuthProvider from "@/context/AuthProvider";
import { ToastContainer } from "react-toastify";
import prisma from "@/lib/prisma";

const BASE_URL = "https://djantchiemo-kabirou.vercel.app";

const SEO_TEXT = {
  fr: {
    title: "Kabirou Djantchiemo | Développeur Web & Mobile — React.js, Laravel",
    description:
      "Kabirou Djantchiemo, développeur Web & Mobile fullstack (React.js, Next.js, Laravel, Flutter) basé à Accra, Ghana. Disponible en freelance et à distance — découvrez mes projets et contactez-moi.",
    ogLocale: "fr_FR",
  },
  en: {
    title: "Kabirou Djantchiemo | Web & Mobile Developer — React.js, Laravel",
    description:
      "Kabirou Djantchiemo, fullstack Web & Mobile developer (React.js, Next.js, Laravel, Flutter) based in Accra, Ghana. Available for freelance and remote work — check out my projects and get in touch.",
    ogLocale: "en_US",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO_TEXT[locale === "en" ? "en" : "fr"];

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: seo.title,
      template: "%s | Kabirou Djantchiemo",
    },
    description: seo.description,
    keywords: [
      "Kabirou Djantchiemo",
      "Développeur Web",
      "Développeur Mobile",
      "Web Developer",
      "Mobile Developer",
      "Fullstack",
      "Freelance",
      "React.js",
      "Next.js",
      "Laravel",
      "Flutter",
      "Accra",
      "Ghana",
      "Togo",
      "Lomé",
      "Développeur React Afrique",
      "Remote developer",
    ],
    authors: [{ name: "Kabirou Djantchiemo" }],
    creator: "Kabirou Djantchiemo",
    openGraph: {
      type: "website",
      locale: seo.ogLocale,
      url: `${BASE_URL}/${locale}`,
      title: seo.title,
      description: seo.description,
      siteName: "Kabirou Djantchiemo Portfolio",
      images: [
        {
          url: `${BASE_URL}/assets/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Kabirou Djantchiemo — Développeur Web & Mobile",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [`${BASE_URL}/assets/images/og-image.jpg`],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        "fr-FR": `${BASE_URL}/fr`,
        "en-US": `${BASE_URL}/en`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "google7eb8047818001ca5",
    },
  };
}

// import Metronic styles
import "@/styles/metronic/globals.css";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch user data for JSON-LD
  let user = null;
  try {
    user = await prisma.user.findFirst();
  } catch (error) {
    // Silently ignore DB connection errors during dev to prevent Next.js error overlay
  }
  
  const name = user?.name || "Kabirou Djantchiemo";
  const title =
    (locale === "fr" ? user?.professionalTitleFr : user?.professionalTitleEn) ||
    (locale === "fr" ? "Développeur Web & Mobile" : "Web & Mobile Developer");
  const description =
    (locale === "fr" ? user?.aboutFr : user?.aboutEn) ||
    SEO_TEXT[locale === "en" ? "en" : "fr"].description;

  const sameAs = [user?.githubUrl, user?.linkedinUrl, user?.twitterUrl, user?.facebookUrl].filter(Boolean);
  if (sameAs.length === 0) {
    sameAs.push("https://github.com/Tchablenan", "https://linkedin.com/in/kabirou-djantchiemo");
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: name,
    jobTitle: title,
    url: BASE_URL,
    image: `${BASE_URL}/assets/images/og-image.jpg`,
    email: "mailto:kdjantchiemo@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Accra",
      addressCountry: "GH",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Institut Africain d'Informatique (IAI-Togo)",
    },
    knowsAbout: [
      "React.js",
      "Next.js",
      "Laravel",
      "Flutter",
      "Django",
      "Java",
      "Python",
      "JavaScript",
      "TypeScript",
      "PHP",
      "MySQL",
      "MongoDB",
      "Firebase",
      "API REST",
    ],
    knowsLanguage: ["fr", "en"],
    sameAs,
    description: description,
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <I18nProvider locale={locale}>
            <ModalUIProvider>
              <GlobaleffectProvider>
                {children}
                <ToastContainer />
              </GlobaleffectProvider>
            </ModalUIProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

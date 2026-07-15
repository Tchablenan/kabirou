import type { Metadata } from "next";
// import "../../../public/assets/css/custom.css";
import "react-toastify/dist/ReactToastify.css";
import { ModalUIProvider } from "@/context/ModalUIContext";
import GlobaleffectProvider from "@/components/common/GlobaleffectProvider";
import I18nProvider from "@/context/I18nProvider";
import AuthProvider from "@/context/AuthProvider";
import { ToastContainer } from "react-toastify";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: {
    default: "Kabirou Djantchiemo | Web & Mobile Developer Portfolio",
    template: "%s | Kabirou Djantchiemo",
  },
  description:
    "Portfolio de Kabirou Djantchiemo - Développeur Web & Mobile Fullstack passionné, spécialisé en React.js, Next.js et Laravel.",
  keywords: [
    "Kabirou Djantchiemo",
    "Développeur Web",
    "Mobile Developer",
    "Fullstack",
    "Portfolio",
    "Freelance",
    "React",
    "Next.js",
    "Laravel",
  ],
  authors: [{ name: "Kabirou Djantchiemo" }],
  creator: "Kabirou Djantchiemo",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://djantchiemo-kabirou.vercel.app",
    title: "Kabirou Djantchiemo | Web & Mobile Developer",
    description:
      "Découvrez le portfolio de Kabirou Djantchiemo, développeur passionné par la création de solutions web et mobiles innovantes.",
    siteName: "Kabirou Djantchiemo Portfolio",
    images: [
      {
        url: "https://djantchiemo-kabirou.vercel.app/assets/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kabirou Djantchiemo — Développeur Web & Mobile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kabirou Djantchiemo | Web & Mobile Developer",
    description: "Portfolio de développeur Web & Mobile Fullstack.",
    images: ["https://djantchiemo-kabirou.vercel.app/assets/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://djantchiemo-kabirou.vercel.app/fr",
    languages: {
      "fr-FR": "https://djantchiemo-kabirou.vercel.app/fr",
      "en-US": "https://djantchiemo-kabirou.vercel.app/en",
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
  const title = locale === "fr" ? user?.professionalTitleFr : user?.professionalTitleEn;
  const description = locale === "fr" ? user?.aboutFr : user?.aboutEn;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: name,
    jobTitle: title,
    url: "https://djantchiemo-kabirou.vercel.app",
    sameAs: [user?.githubUrl, user?.linkedinUrl, user?.twitterUrl, user?.facebookUrl].filter(Boolean),
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

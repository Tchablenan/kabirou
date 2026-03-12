import type { Metadata } from "next";
// import "../../../public/assets/css/custom.css";
import "react-toastify/dist/ReactToastify.css";
import { ModalUIProvider } from "@/context/ModalUIContext";
import GlobaleffectProvider from "@/components/common/GlobaleffectProvider";
import I18nProvider from "@/context/I18nProvider";
import AuthProvider from "@/context/AuthProvider";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Kabirou Djantchiemo || Web & Mobile Developer Portfolio",
  description: "Kabirou Djantchiemo Portfolio - Freelancer & Developer",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
      </head>
      <body>
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

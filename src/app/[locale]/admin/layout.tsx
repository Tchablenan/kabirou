"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { LayoutProvider } from "@/components/layouts/layout-1/components/context";
import { Main } from "@/components/layouts/layout-1/components/main";

// Import Metronic styles
import "@/styles/metronic/globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!session) return null;

  // Don't show layout on login page
  if (pathname.includes("/admin/login")) {
    return <>{children}</>;
  }

  return (
    <div className="light antialiased flex min-h-screen w-full flex-col text-base text-foreground bg-background">
      <LayoutProvider>
        <Main>
          <div className="container-fluid py-6 lg:py-10 flex-grow">
            {children}
          </div>
        </Main>
      </LayoutProvider>
    </div>
  );
}

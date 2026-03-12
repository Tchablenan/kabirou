import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "fr"];
const defaultLocale = "fr";

export default withAuth(
  function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the pathname is missing a locale
    const pathnameIsMissingLocale = locales.every(
      (locale) =>
        !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
      if (
        pathname.startsWith("/assets/") ||
        pathname.startsWith("/favicon/") ||
        pathname.startsWith("/api/") ||
        pathname.includes(".")
      ) {
        return;
      }

      return NextResponse.redirect(
        new URL(`/${defaultLocale}${pathname}`, request.url)
      );
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Check if it's an admin route
        const isAdminRoute = pathname.match(/\/(en|fr)\/admin/) || pathname.startsWith("/admin");
        const isLoginPage = pathname.includes("/admin/login");

        if (isAdminRoute && !isLoginPage) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: "/fr/admin/login",
    },
  }
);

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|api|assets|favicon).*)",
    // Optional: only run on root (/)
    "/",
  ],
};

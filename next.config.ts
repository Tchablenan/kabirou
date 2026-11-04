import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Politique de sécurité du contenu : seules les ressources du site lui-même sont exécutées.
// - 'unsafe-inline' (scripts) : nécessaire aux scripts d'hydratation de Next.js et au JSON-LD
// - images : toute source https (logos et icônes saisis depuis le back-office)
// - vercel.live : barre d'outils des déploiements de prévisualisation Vercel
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://vercel.live${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://vercel.live wss://ws-us3.pusher.com${isDev ? " ws: http://localhost:*" : ""}`,
  "frame-src https://vercel.live",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "seowehsfdtbolakosopf.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      // Static assets — immutable cache 1 year
      {
        source: "/assets/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/media/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/favicon/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
      // API routes — no client-side caching (handled per-route with s-maxage)
      {
        source: "/api/(.*)",
        headers: [{ key: "Vary", value: "Accept-Encoding, Accept-Language" }],
      },
      // Security headers for all pages
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "react-toastify",
    ],
  },
};

export default nextConfig;

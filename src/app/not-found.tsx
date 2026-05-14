import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#161616",
        color: "#fff",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <span
          style={{
            fontSize: "8rem",
            fontWeight: "800",
            lineHeight: "1",
            background: "linear-gradient(135deg, #FF014F, #ff6b6b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </span>
      </div>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          marginBottom: "1rem",
          color: "#ffffff",
        }}
      >
        Page introuvable
      </h1>
      <p
        style={{
          fontSize: "1.1rem",
          color: "rgba(255,255,255,0.6)",
          maxWidth: "420px",
          lineHeight: "1.6",
          marginBottom: "2.5rem",
        }}
      >
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "#FF014F",
          color: "#fff",
          padding: "0.85rem 2rem",
          borderRadius: "50px",
          fontWeight: "600",
          fontSize: "0.95rem",
          textDecoration: "none",
          transition: "opacity 0.2s",
        }}
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}

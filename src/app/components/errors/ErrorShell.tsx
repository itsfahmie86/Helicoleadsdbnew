/**
 * ErrorShell.tsx
 * Shared wrapper untuk semua standalone error pages (401, 403, 500, 404-standalone).
 * Menampilkan HelicoLeads branding bar di atas, konten di tengah, dan footer support.
 */

import { ReactNode } from "react";
import { useNavigate } from "react-router";
import { Home, ArrowLeft } from "lucide-react";

interface ErrorShellProps {
  children: ReactNode;
}

export function ErrorShell({ children }: ErrorShellProps) {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}
    >
      {/* ── Branding Bar ─────────────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between flex-shrink-0"
        style={{
          height: "56px",
          background: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          padding: "0 24px",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            style={{
              width: 32,
              height: 32,
              background: "#0F1F3D",
              borderRadius: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 800 }}>H</span>
          </div>
          <div>
            <p style={{ color: "#0F1F3D", fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
              HelicoLeads
            </p>
            <p style={{ color: "#94A3B8", fontSize: 10, lineHeight: 1.2 }}>Lead Intelligence</p>
          </div>
        </div>

        {/* Quick nav */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 transition-all"
            style={{
              padding: "6px 12px",
              background: "transparent",
              border: "1px solid #E2E8F0",
              borderRadius: "7px",
              color: "#64748B",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#CBD5E1")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")}
          >
            <ArrowLeft size={13} />
            Kembali
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 transition-all"
            style={{
              padding: "6px 12px",
              background: "#0F1F3D",
              border: "1px solid transparent",
              borderRadius: "7px",
              color: "#FFFFFF",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1E3A5F")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#0F1F3D")}
          >
            <Home size={13} />
            Dashboard
          </button>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer
        className="flex-shrink-0 flex items-center justify-center gap-1.5 py-5"
        style={{ borderTop: "1px solid #F1F5F9" }}
      >
        <span style={{ color: "#94A3B8", fontSize: "12px" }}>
          Butuh bantuan?
        </span>
        <a
          href="mailto:support@helicoleads.com"
          style={{ color: "#4F46E5", fontSize: "12px", fontWeight: 500 }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.textDecoration = "none")}
        >
          support@helicoleads.com
        </a>
        <span style={{ color: "#E2E8F0", fontSize: "12px" }}>•</span>
        <span style={{ color: "#94A3B8", fontSize: "12px" }}>
          Status sistem:{" "}
          <span style={{ color: "#16A34A", fontWeight: 600 }}>Operasional</span>
        </span>
      </footer>
    </div>
  );
}

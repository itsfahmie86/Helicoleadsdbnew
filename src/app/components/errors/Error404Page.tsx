/**
 * Error404Page.tsx — Halaman Tidak Ditemukan
 *
 * Digunakan oleh React Router sebagai wildcard route ("*").
 * Dua varian:
 *   - Dengan sidebar (di-render sebagai child Layout) — untuk navigasi internal yang salah
 *   - Standalone via <Error404Standalone> — untuk URL yang benar-benar tidak dikenal
 */

import { useNavigate, useLocation } from "react-router";
import { FileSearch, ArrowLeft, Home, Sparkles } from "lucide-react";
import { ErrorShell } from "./ErrorShell";

/* ─── Shared content card ─────────────────────────────────────────────────── */
function Error404Content() {
  const navigate = useNavigate();
  const location = useLocation();
  const attemptedPath = location.pathname;

  return (
    <div className="w-full max-w-[480px] mx-auto">

      {/* Ghost number */}
      <div className="relative flex items-center justify-center mb-2 select-none pointer-events-none">
        <span
          aria-hidden="true"
          style={{
            fontSize: "clamp(120px, 20vw, 180px)",
            fontWeight: 800,
            color: "#EEF2FF",
            lineHeight: 1,
            letterSpacing: "-6px",
            userSelect: "none",
          }}
        >
          404
        </span>
      </div>

      {/* Card */}
      <div
        className="w-full flex flex-col items-center text-center p-8"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "8px",
          marginTop: "-32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Icon badge */}
        <div
          className="flex items-center justify-center mb-5"
          style={{
            width: 56,
            height: 56,
            background: "#EEF2FF",
            borderRadius: "8px",
            border: "1px solid #C7D2FE",
          }}
        >
          <FileSearch size={24} style={{ color: "#4F46E5" }} />
        </div>

        {/* Code + title */}
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3"
          style={{
            background: "#EEF2FF",
            border: "1px solid #C7D2FE",
            borderRadius: "6px",
          }}
        >
          <span style={{ color: "#4F46E5", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
            ERROR 404
          </span>
        </div>

        <h1
          style={{
            color: "#0F1F3D",
            fontSize: "20px",
            fontWeight: 700,
            marginBottom: "10px",
            lineHeight: 1.25,
          }}
        >
          Halaman Tidak Ditemukan
        </h1>

        <p
          style={{
            color: "#64748B",
            fontSize: "13px",
            lineHeight: 1.65,
            marginBottom: "6px",
            maxWidth: "360px",
          }}
        >
          URL yang kamu ketik mungkin salah, link sudah tidak aktif, atau halaman
          telah dipindahkan ke lokasi lain.
        </p>

        {/* Attempted path hint */}
        {attemptedPath && attemptedPath !== "/" && (
          <div
            className="flex items-center gap-2 px-3 py-2 mb-6 mt-2"
            style={{
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "6px",
            }}
          >
            <span style={{ color: "#94A3B8", fontSize: "12px" }}>URL:</span>
            <code
              style={{
                color: "#DC2626",
                fontSize: "12px",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontWeight: 500,
              }}
            >
              {attemptedPath}
            </code>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 flex-1 py-2.5 transition-all"
            style={{
              background: "#FFFFFF",
              color: "#0F1F3D",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              width: "100%",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#FFFFFF")}
          >
            <ArrowLeft size={14} />
            Halaman Sebelumnya
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 flex-1 py-2.5 transition-all"
            style={{
              background: "#4F46E5",
              color: "#FFFFFF",
              border: "1px solid transparent",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              width: "100%",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#4338CA")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#4F46E5")}
          >
            <Home size={14} />
            Ke Dashboard
          </button>
        </div>

        {/* Quick links */}
        <div className="flex items-center gap-3 mt-5 pt-5 w-full flex-wrap justify-center"
          style={{ borderTop: "1px solid #F1F5F9" }}>
          <span style={{ color: "#94A3B8", fontSize: "11px" }}>Mungkin yang dicari:</span>
          {[
            { label: "Cari Leads", path: "/new-search" },
            { label: "Database", path: "/database-leads" },
            { label: "Inteligensi AI", path: "/ai-intelligence" },
          ].map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="flex items-center gap-1 transition-all"
              style={{ color: "#4F46E5", fontSize: "12px", fontWeight: 500 }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              <Sparkles size={10} />
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Versi DENGAN sidebar (dalam Layout) ────────────────────────────────── */
export function Error404Page() {
  return (
    <div
      className="flex-1 flex items-center justify-center p-6"
      style={{ background: "#F8FAFC", minHeight: "100%" }}
    >
      <Error404Content />
    </div>
  );
}

/* ─── Versi STANDALONE (tanpa sidebar) ──────────────────────────────────── */
export function Error404Standalone() {
  return (
    <ErrorShell>
      <Error404Content />
    </ErrorShell>
  );
}

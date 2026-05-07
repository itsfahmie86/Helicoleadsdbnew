/**
 * Error401Page.tsx — Belum Login / Session Expired
 *
 * Trigger:
 *   Backend → redirect ke /401 atau navigate('/401')
 *   Frontend interceptor → router.navigate('/401')
 *
 * URL params yang didukung:
 *   ?msg=Pesan+kustom → ditampilkan sebagai deskripsi tambahan
 *   ?redirect=/dashboard → setelah login, redirect ke halaman ini
 */

import { useNavigate, useSearchParams } from "react-router";
import { ShieldOff, LogIn, Home, Clock } from "lucide-react";
import { ErrorShell } from "./ErrorShell";

export function Error401Page() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const customMsg = params.get("msg");
  const redirectAfter = params.get("redirect") ?? "/";

  return (
    <ErrorShell>
      <div className="w-full max-w-[480px] mx-auto">

        {/* Ghost number */}
        <div className="relative flex items-center justify-center mb-2 select-none pointer-events-none">
          <span
            aria-hidden="true"
            style={{
              fontSize: "clamp(120px, 20vw, 180px)",
              fontWeight: 800,
              color: "#FEF3C7",
              lineHeight: 1,
              letterSpacing: "-6px",
              userSelect: "none",
            }}
          >
            401
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
              background: "#FFFBEB",
              borderRadius: "8px",
              border: "1px solid #FDE68A",
            }}
          >
            <ShieldOff size={24} style={{ color: "#D97706" }} />
          </div>

          {/* Code tag */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3"
            style={{
              background: "#FFFBEB",
              border: "1px solid #FDE68A",
              borderRadius: "6px",
            }}
          >
            <span style={{ color: "#D97706", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
              ERROR 401 — UNAUTHORIZED
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
            Sesi Anda Telah Berakhir
          </h1>

          <p
            style={{
              color: "#64748B",
              fontSize: "13px",
              lineHeight: 1.65,
              marginBottom: "16px",
              maxWidth: "360px",
            }}
          >
            {customMsg
              ? customMsg
              : "Anda perlu login ulang untuk melanjutkan. Sesi Anda mungkin telah kedaluwarsa demi menjaga keamanan akun."}
          </p>

          {/* Session info box */}
          <div
            className="flex items-center gap-3 px-4 py-3 mb-6 w-full"
            style={{
              background: "#FFFBEB",
              border: "1px solid #FDE68A",
              borderRadius: "8px",
              textAlign: "left",
            }}
          >
            <Clock size={16} style={{ color: "#D97706", flexShrink: 0 }} />
            <p style={{ color: "#92400E", fontSize: "12px", lineHeight: 1.5 }}>
              Sesi login otomatis kedaluwarsa setelah{" "}
              <strong>30 menit</strong> tidak aktif untuk melindungi akun Anda.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 flex-1 py-2.5 transition-all"
              style={{
                background: "#FFFFFF",
                color: "#64748B",
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
              <Home size={14} />
              Halaman Utama
            </button>

            <button
              onClick={() => {
                // Arahkan ke halaman login dengan redirect parameter
                // Ganti path ini dengan route login yang sebenarnya saat backend sudah siap
                navigate(`/login?redirect=${encodeURIComponent(redirectAfter)}`);
              }}
              className="flex items-center justify-center gap-2 flex-1 py-2.5 transition-all"
              style={{
                background: "#D97706",
                color: "#FFFFFF",
                border: "1px solid transparent",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                width: "100%",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#B45309")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#D97706")}
            >
              <LogIn size={14} />
              Login Ulang
            </button>
          </div>

          {/* Help text */}
          <p
            style={{
              color: "#94A3B8",
              fontSize: "11px",
              marginTop: "16px",
              lineHeight: 1.5,
            }}
          >
            Jika masalah terus berlanjut meski sudah login ulang,{" "}
            <a
              href="mailto:support@helicoleads.com"
              style={{ color: "#4F46E5", fontWeight: 500 }}
            >
              hubungi support
            </a>
            .
          </p>
        </div>
      </div>
    </ErrorShell>
  );
}

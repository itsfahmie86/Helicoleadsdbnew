/**
 * Error403Page.tsx — Akses Ditolak (Forbidden)
 *
 * Trigger:
 *   Backend → redirect ke /403 atau navigate('/403')
 *   Frontend permission check → router.navigate('/403')
 *
 * URL params yang didukung:
 *   ?msg=Pesan+kustom → deskripsi tambahan
 *   ?feature=Nama+Fitur → nama fitur yang dicoba diakses
 *   ?reason=admin|premium → jenis restriksi (menentukan CTA)
 */

import { useNavigate, useSearchParams } from "react-router";
import { Lock, ArrowLeft, Crown, Home, ChevronRight } from "lucide-react";
import { ErrorShell } from "./ErrorShell";

export function Error403Page() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const customMsg  = params.get("msg");
  const featureName = params.get("feature");
  const reason     = params.get("reason") ?? "premium"; // "admin" | "premium"

  const isPremium = reason !== "admin";

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
              color: "#F5F3FF",
              lineHeight: 1,
              letterSpacing: "-6px",
              userSelect: "none",
            }}
          >
            403
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
              background: "#F5F3FF",
              borderRadius: "8px",
              border: "1px solid #DDD6FE",
            }}
          >
            <Lock size={24} style={{ color: "#7C3AED" }} />
          </div>

          {/* Code tag */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3"
            style={{
              background: "#F5F3FF",
              border: "1px solid #DDD6FE",
              borderRadius: "6px",
            }}
          >
            <span style={{ color: "#7C3AED", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
              ERROR 403 — FORBIDDEN
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
            Akses Ditolak
          </h1>

          {/* Feature name highlight */}
          {featureName && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-3"
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
              }}
            >
              <span style={{ color: "#94A3B8", fontSize: "12px" }}>Fitur:</span>
              <span style={{ color: "#0F1F3D", fontSize: "12px", fontWeight: 600 }}>
                {featureName}
              </span>
            </div>
          )}

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
              : isPremium
              ? "Fitur ini hanya tersedia untuk pengguna paket Pro atau Enterprise. Upgrade sekarang untuk mendapatkan akses penuh."
              : "Anda tidak memiliki hak akses admin yang diperlukan untuk halaman ini. Hubungi administrator workspace Anda."}
          </p>

          {/* Permission info box */}
          <div
            className="flex items-start gap-3 px-4 py-3 mb-6 w-full"
            style={{
              background: "#F5F3FF",
              border: "1px solid #DDD6FE",
              borderRadius: "8px",
              textAlign: "left",
            }}
          >
            <Crown size={16} style={{ color: "#7C3AED", flexShrink: 0, marginTop: "1px" }} />
            <div>
              <p style={{ color: "#5B21B6", fontSize: "12px", fontWeight: 600, marginBottom: "2px" }}>
                {isPremium ? "Diperlukan: Paket Pro atau Enterprise" : "Diperlukan: Hak Akses Admin"}
              </p>
              <p style={{ color: "#6D28D9", fontSize: "12px", lineHeight: 1.5 }}>
                {isPremium
                  ? "Akun Anda saat ini menggunakan paket Free. Upgrade untuk akses penuh."
                  : "Hubungi admin workspace untuk mengubah level akses akun Anda."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              onClick={() => navigate(-1)}
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
              <ArrowLeft size={14} />
              Kembali
            </button>

            {isPremium ? (
              <button
                onClick={() => navigate("/pricing")}
                className="flex items-center justify-center gap-2 flex-1 py-2.5 transition-all"
                style={{
                  background: "#7C3AED",
                  color: "#FFFFFF",
                  border: "1px solid transparent",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#6D28D9")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#7C3AED")}
              >
                <Crown size={14} />
                Lihat Paket Upgrade
                <ChevronRight size={13} />
              </button>
            ) : (
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 flex-1 py-2.5 transition-all"
                style={{
                  background: "#0F1F3D",
                  color: "#FFFFFF",
                  border: "1px solid transparent",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1E3A5F")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#0F1F3D")}
              >
                <Home size={14} />
                Ke Dashboard
              </button>
            )}
          </div>

          {/* Benefit teaser (only for premium gate) */}
          {isPremium && (
            <div className="w-full mt-5 pt-5" style={{ borderTop: "1px solid #F1F5F9" }}>
              <p style={{ color: "#94A3B8", fontSize: "11px", marginBottom: "10px" }}>
                Yang Anda dapatkan dengan paket Pro:
              </p>
              <div className="flex flex-col gap-2">
                {[
                  "Unlimited AI Lead Search per bulan",
                  "Analisis sentimen mendalam dengan Claude AI",
                  "Export CSV & integrasi CRM",
                ].map((b) => (
                  <div key={b} className="flex items-center gap-2">
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        background: "#F0FDF4",
                        border: "1px solid #BBF7D0",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1 4L3 6L7 2" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span style={{ color: "#64748B", fontSize: "12px", textAlign: "left" }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorShell>
  );
}

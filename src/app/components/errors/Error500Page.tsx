/**
 * Error500Page.tsx — Internal Server Error
 *
 * Trigger:
 *   Backend → redirect ke /500 atau navigate('/500')
 *   API interceptor → router.navigate('/500', { state: { msg: error.message } })
 *
 * URL params yang didukung:
 *   ?msg=Deskripsi+error → pesan error kustom dari backend
 *   ?code=DB_CONN → kode error internal untuk ditampilkan ke user power
 *   ?ref=abc123 → request ID / trace ID untuk dikomunikasikan ke support
 */

import { useNavigate, useSearchParams } from "react-router";
import { AlertTriangle, RefreshCw, Home, MessageSquare, Copy, Check } from "lucide-react";
import { useState } from "react";
import { ErrorShell } from "./ErrorShell";

export function Error500Page() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [copied, setCopied] = useState(false);

  const customMsg  = params.get("msg");
  const errorCode  = params.get("code");
  const refId      = params.get("ref");

  // Generate a pseudo trace ID if none provided
  const traceId = refId ?? `HLC-${Date.now().toString(36).toUpperCase()}`;

  const handleCopyTrace = async () => {
    try {
      await navigator.clipboard.writeText(traceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
    }
  };

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
              color: "#FEF2F2",
              lineHeight: 1,
              letterSpacing: "-6px",
              userSelect: "none",
            }}
          >
            500
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
              background: "#FEF2F2",
              borderRadius: "8px",
              border: "1px solid #FECACA",
            }}
          >
            <AlertTriangle size={24} style={{ color: "#DC2626" }} />
          </div>

          {/* Code tag */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3"
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "6px",
            }}
          >
            <span style={{ color: "#DC2626", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
              ERROR 500 — SERVER ERROR
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
            Terjadi Kesalahan Server
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
              : "Server kami mengalami gangguan yang tidak terduga. Tim teknis kami telah diberitahu dan sedang menangani masalah ini."}
          </p>

          {/* Error detail box */}
          <div
            className="flex flex-col gap-2 px-4 py-3.5 mb-6 w-full"
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "8px",
              textAlign: "left",
            }}
          >
            {/* Error code */}
            {errorCode && (
              <div className="flex items-center justify-between gap-2">
                <span style={{ color: "#94A3B8", fontSize: "11px" }}>Kode Error:</span>
                <code
                  style={{
                    color: "#DC2626",
                    fontSize: "11px",
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    fontWeight: 600,
                    background: "#FEE2E2",
                    padding: "1px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {errorCode}
                </code>
              </div>
            )}

            {/* Trace ID */}
            <div className="flex items-center justify-between gap-2">
              <span style={{ color: "#94A3B8", fontSize: "11px" }}>Trace ID:</span>
              <div className="flex items-center gap-1.5">
                <code
                  style={{
                    color: "#7F1D1D",
                    fontSize: "11px",
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    fontWeight: 500,
                  }}
                >
                  {traceId}
                </code>
                <button
                  onClick={handleCopyTrace}
                  title="Salin trace ID"
                  style={{
                    padding: "2px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: copied ? "#16A34A" : "#94A3B8",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            <div className="mt-1">
              <p style={{ color: "#B91C1C", fontSize: "11px", lineHeight: 1.5 }}>
                Simpan Trace ID ini jika ingin melaporkan masalah ke tim support kami.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              onClick={() => window.location.reload()}
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
              <RefreshCw size={14} />
              Muat Ulang
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 flex-1 py-2.5 transition-all"
              style={{
                background: "#DC2626",
                color: "#FFFFFF",
                border: "1px solid transparent",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                width: "100%",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#B91C1C")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#DC2626")}
            >
              <Home size={14} />
              Ke Dashboard
            </button>
          </div>

          {/* Support CTA */}
          <div className="w-full mt-5 pt-5" style={{ borderTop: "1px solid #F1F5F9" }}>
            <p style={{ color: "#94A3B8", fontSize: "11px", marginBottom: "10px" }}>
              Masalah berulang? Hubungi kami langsung:
            </p>
            <button
              onClick={() => {
                const subject = encodeURIComponent(`[Error 500] Laporan Masalah Server - ${traceId}`);
                const body = encodeURIComponent(
                  `Halo Tim Support HelicoLeads,\n\nSaya mengalami error 500 dengan detail berikut:\n\nTrace ID: ${traceId}${errorCode ? `\nKode Error: ${errorCode}` : ""}${customMsg ? `\nPesan: ${customMsg}` : ""}\n\nMohon bantuan untuk menyelesaikan masalah ini.\n\nTerima kasih.`
                );
                window.location.href = `mailto:support@helicoleads.com?subject=${subject}&body=${body}`;
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 transition-all"
              style={{
                background: "#F8FAFC",
                color: "#4F46E5",
                border: "1px solid #C7D2FE",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#EEF2FF")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")}
            >
              <MessageSquare size={13} />
              Laporkan ke Support (dengan Trace ID)
            </button>
          </div>
        </div>
      </div>
    </ErrorShell>
  );
}

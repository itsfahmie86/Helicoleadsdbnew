/**
 * ErrorsDemoPage.tsx — Halaman preview semua error pages
 * Accessible di: /errors-demo (hanya untuk development/QA)
 * Backend dev bisa langsung klik dan lihat semua error pages dari sini.
 */

import { useNavigate } from "react-router";
import {
  FileSearch,
  ShieldOff,
  Lock,
  AlertTriangle,
  ExternalLink,
  Code2,
  Copy,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const errorPages = [
  {
    code: 404,
    title: "Halaman Tidak Ditemukan",
    desc: "URL salah ketik, link rusak, atau halaman dipindahkan.",
    icon: FileSearch,
    accent: "#4F46E5",
    accentBg: "#EEF2FF",
    accentBorder: "#C7D2FE",
    path: "/404-demo",
    params: [],
    tag: "Routing wildcard (*)",
  },
  {
    code: 401,
    title: "Belum Login / Session Expired",
    desc: "User belum terautentikasi atau session kedaluwarsa.",
    icon: ShieldOff,
    accent: "#D97706",
    accentBg: "#FFFBEB",
    accentBorder: "#FDE68A",
    path: "/401",
    params: [
      { key: "msg", example: "Token Anda telah kedaluwarsa" },
      { key: "redirect", example: "/dashboard" },
    ],
    tag: "Route: /401",
  },
  {
    code: 403,
    title: "Akses Ditolak",
    desc: "Sudah login tapi tidak punya akses (fitur premium, hak admin).",
    icon: Lock,
    accent: "#7C3AED",
    accentBg: "#F5F3FF",
    accentBorder: "#DDD6FE",
    path: "/403",
    params: [
      { key: "feature", example: "Export CSV" },
      { key: "reason", example: "premium | admin" },
      { key: "msg", example: "Pesan kustom" },
    ],
    tag: "Route: /403",
  },
  {
    code: 500,
    title: "Internal Server Error",
    desc: "Error di backend / database / server crash.",
    icon: AlertTriangle,
    accent: "#DC2626",
    accentBg: "#FEF2F2",
    accentBorder: "#FECACA",
    path: "/500",
    params: [
      { key: "msg", example: "Database connection failed" },
      { key: "code", example: "DB_CONN_ERR" },
      { key: "ref", example: "TRC-abc123" },
    ],
    tag: "Route: /500",
  },
];

const codeSnippets = [
  {
    label: "Axios Interceptor",
    lang: "typescript",
    code: `import { handleHttpError } from '@/app/lib/errorNavigation';

axios.interceptors.response.use(null, (error) => {
  handleHttpError(error.response?.status, {
    message: error.response?.data?.message,
    traceId: error.response?.data?.traceId,
    feature: error.response?.data?.feature,
  });
  return Promise.reject(error);
});`,
  },
  {
    label: "Dalam Komponen React",
    lang: "typescript",
    code: `import { useNavigateToError } from '@/app/lib/errorNavigation';

function MyComponent() {
  const navigateToError = useNavigateToError();

  const handleAction = async () => {
    try {
      await riskyApiCall();
    } catch (err) {
      if (err.status === 403) {
        navigateToError(403, {
          feature: 'Export CSV',
          reason: 'premium',
        });
      }
    }
  };
}`,
  },
  {
    label: "Hard Redirect (outside React)",
    lang: "typescript",
    code: `import { redirectToError } from '@/app/lib/errorNavigation';

// Di service, middleware, atau non-React code:
redirectToError(401);
redirectToError(403, { feature: 'Admin Panel', reason: 'admin' });
redirectToError(500, { msg: 'DB crash', ref: 'TRC-xyz' });`,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        background: copied ? "#F0FDF4" : "#1E293B",
        border: `1px solid ${copied ? "#BBF7D0" : "#334155"}`,
        color: copied ? "#16A34A" : "#94A3B8",
        borderRadius: "5px",
        padding: "4px 8px",
        fontSize: "11px",
        fontWeight: 600,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        transition: "all 0.15s",
      }}
    >
      <Copy size={11} />
      {copied ? "Tersalin!" : "Salin"}
    </button>
  );
}

export function ErrorsDemoPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen p-5 md:p-6 lg:p-8"
      style={{ background: "#F8FAFC", color: "#0F1F3D" }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className="w-8 h-8 flex items-center justify-center flex-shrink-0"
            style={{ background: "#0F1F3D", borderRadius: "8px" }}
          >
            <AlertTriangle size={15} style={{ color: "#FFFFFF" }} />
          </div>
          <h1 style={{ color: "#0F1F3D", fontSize: "22px", fontWeight: 700 }}>
            Error Pages — Preview & Dokumentasi
          </h1>
          <span
            style={{
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              color: "#16A34A",
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "4px",
              letterSpacing: "0.3px",
            }}
          >
            DEV ONLY
          </span>
        </div>
        <p style={{ color: "#64748B", fontSize: "14px" }}>
          Preview semua halaman error dan dokumentasi cara integrasi dengan backend.
        </p>
      </div>

      {/* Error page cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {errorPages.map((ep) => {
          const Icon = ep.icon;
          return (
            <div
              key={ep.code}
              className="p-5 flex flex-col gap-4"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
              }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: ep.accentBg,
                      border: `1px solid ${ep.accentBorder}`,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} style={{ color: ep.accent }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        style={{
                          fontSize: "22px",
                          fontWeight: 800,
                          color: ep.accent,
                          letterSpacing: "-0.5px",
                          lineHeight: 1,
                        }}
                      >
                        {ep.code}
                      </span>
                      <span
                        style={{
                          background: ep.accentBg,
                          border: `1px solid ${ep.accentBorder}`,
                          color: ep.accent,
                          fontSize: "10px",
                          fontWeight: 600,
                          padding: "1px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {ep.tag}
                      </span>
                    </div>
                    <p style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>
                      {ep.title}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (ep.code === 404) {
                      navigate("/halaman-yang-tidak-ada-sama-sekali");
                    } else {
                      navigate(ep.path);
                    }
                  }}
                  className="flex items-center gap-1.5 flex-shrink-0 transition-all"
                  style={{
                    background: ep.accentBg,
                    border: `1px solid ${ep.accentBorder}`,
                    color: ep.accent,
                    borderRadius: "7px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity = "0.8")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity = "1")
                  }
                >
                  Preview
                  <ExternalLink size={12} />
                </button>
              </div>

              <p style={{ color: "#64748B", fontSize: "12px", lineHeight: 1.6 }}>
                {ep.desc}
              </p>

              {/* Query params */}
              {ep.params.length > 0 && (
                <div>
                  <p style={{ color: "#94A3B8", fontSize: "11px", fontWeight: 600, marginBottom: "6px", letterSpacing: "0.3px" }}>
                    URL PARAMS YANG DIDUKUNG
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {ep.params.map((param) => (
                      <div key={param.key} className="flex items-center gap-2">
                        <code
                          style={{
                            background: "#F1F5F9",
                            color: "#4F46E5",
                            fontSize: "11px",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            flexShrink: 0,
                          }}
                        >
                          ?{param.key}
                        </code>
                        <span style={{ color: "#64748B", fontSize: "11px" }}>
                          Contoh: <em>{param.example}</em>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Quick link with params example */}
                  {ep.params.length > 0 && ep.code !== 404 && (
                    <button
                      onClick={() => {
                        const paramStr = ep.params
                          .map((p) => `${p.key}=${encodeURIComponent(p.example)}`)
                          .join("&");
                        navigate(`${ep.path}?${paramStr}`);
                      }}
                      className="flex items-center gap-1.5 mt-2.5 transition-all"
                      style={{ color: ep.accent, fontSize: "12px", fontWeight: 500 }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.opacity = "0.7")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.opacity = "1")
                      }
                    >
                      <ChevronRight size={12} />
                      Preview dengan semua params
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Code snippets */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-7 h-7 flex items-center justify-center"
            style={{ background: "#EEF2FF", borderRadius: "8px" }}
          >
            <Code2 size={14} style={{ color: "#4F46E5" }} />
          </div>
          <div>
            <h2 style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 700, lineHeight: 1 }}>
              Cara Integrasi Backend
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>
              Salin kode di bawah dan sesuaikan dengan stack Anda
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {codeSnippets.map((snippet) => (
            <div
              key={snippet.label}
              style={{
                background: "#0F1F3D",
                border: "1px solid #1E3A5F",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {/* Code header */}
              <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: "1px solid #1E3A5F" }}
              >
                <span style={{ color: "#94A3B8", fontSize: "11px", fontWeight: 600 }}>
                  {snippet.label}
                </span>
                <CopyButton text={snippet.code} />
              </div>

              {/* Code block */}
              <pre
                style={{
                  padding: "16px",
                  margin: 0,
                  overflow: "auto",
                  fontSize: "11px",
                  lineHeight: 1.7,
                  color: "#E2E8F0",
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                <code>{snippet.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

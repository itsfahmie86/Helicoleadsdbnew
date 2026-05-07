import { Target, Bell, ArrowRight, Zap, Users, BarChart3 } from "lucide-react";
import { useState } from "react";

// ─── Feature preview items ─────────────────────────────────────────────────────
const features = [
  {
    icon: Zap,
    iconBg: "#EEF2FF",
    iconColor: "#4F46E5",
    title: "Multi-Channel Outreach",
    desc: "Kirim pesan ke WhatsApp, Email, dan LinkedIn dari satu campaign.",
  },
  {
    icon: Users,
    iconBg: "#F0FDF4",
    iconColor: "#16A34A",
    title: "Segmentasi Leads Otomatis",
    desc: "Kelompokkan leads berdasarkan pain score, lokasi, dan kategori bisnis.",
  },
  {
    icon: BarChart3,
    iconBg: "#FFFBEB",
    iconColor: "#D97706",
    title: "Analytics & Tracking",
    desc: "Pantau open rate, reply rate, dan konversi setiap campaign secara real-time.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function CampaignsPage() {
  const [notified, setNotified] = useState(false);
  const [email, setEmail] = useState("");

  const handleNotify = () => {
    if (email.trim()) setNotified(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 md:p-10"
      style={{ background: "#F8FAFC", color: "#0F1F3D" }}
    >
      {/* ── Card container ──────────────────────────────────────────────────── */}
      <div
        className="w-full max-w-[560px] flex flex-col items-center text-center"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "8px",
          padding: "48px 40px",
        }}
      >
        {/* Icon */}
        <div
          className="flex items-center justify-center mb-5"
          style={{
            width: 64,
            height: 64,
            background: "#EEF2FF",
            borderRadius: "8px",
          }}
        >
          <Target size={28} style={{ color: "#4F46E5" }} strokeWidth={1.75} />
        </div>

        {/* Badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 mb-4"
          style={{
            background: "#EEF2FF",
            border: "1px solid #C7D2FE",
            borderRadius: "6px",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#4F46E5",
              display: "inline-block",
              animation: "pulse 2s infinite",
            }}
          />
          <span style={{ color: "#4F46E5", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
            SEGERA HADIR
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            color: "#0F1F3D",
            fontSize: "26px",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            lineHeight: 1.25,
            marginBottom: "12px",
          }}
        >
          Campaigns
        </h1>

        {/* Description */}
        <p
          style={{
            color: "#64748B",
            fontSize: "14px",
            lineHeight: 1.65,
            marginBottom: "32px",
            maxWidth: "400px",
          }}
        >
          Fitur Campaigns sedang dalam pengembangan. Segera nikmati kemampuan
          outreach multi-channel yang terintegrasi langsung dengan database leads Anda.
        </p>

        {/* Divider */}
        <div
          style={{ width: "100%", height: "1px", background: "#F1F5F9", marginBottom: "28px" }}
        />

        {/* Feature preview */}
        <div className="w-full flex flex-col gap-3 mb-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-3 text-left p-3"
              style={{
                background: "#FAFBFC",
                border: "1px solid #F1F5F9",
                borderRadius: "8px",
              }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 34,
                  height: 34,
                  background: f.iconBg,
                  borderRadius: "7px",
                }}
              >
                <f.icon size={15} style={{ color: f.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600, marginBottom: "2px" }}>
                  {f.title}
                </p>
                <p style={{ color: "#94A3B8", fontSize: "12px", lineHeight: 1.5 }}>
                  {f.desc}
                </p>
              </div>
              <ArrowRight size={14} style={{ color: "#C7D2FE", flexShrink: 0, marginTop: "2px" }} />
            </div>
          ))}
        </div>

        {/* Notify form */}
        {!notified ? (
          <div className="w-full">
            <p style={{ color: "#64748B", fontSize: "12px", marginBottom: "10px" }}>
              Dapatkan notifikasi ketika fitur ini siap diluncurkan:
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNotify()}
                placeholder="email@bisnis.com"
                className="flex-1 outline-none"
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  padding: "9px 13px",
                  fontSize: "13px",
                  color: "#0F1F3D",
                }}
                onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#A5B4FC")}
                onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")}
              />
              <button
                onClick={handleNotify}
                className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0 transition-all"
                style={{
                  background: "#4F46E5",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#4338CA")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#4F46E5")}
              >
                <Bell size={13} />
                Beritahu Saya
              </button>
            </div>
          </div>
        ) : (
          /* Success state */
          <div
            className="w-full flex items-center gap-3 px-4 py-3"
            style={{
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              borderRadius: "8px",
            }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 28, height: 28, background: "#DCFCE7", borderRadius: "50%" }}
            >
              <span style={{ color: "#16A34A", fontSize: "14px" }}>✓</span>
            </div>
            <div className="text-left">
              <p style={{ color: "#16A34A", fontSize: "13px", fontWeight: 600 }}>
                Anda akan diberitahu!
              </p>
              <p style={{ color: "#4ADE80", fontSize: "11px" }}>
                Notifikasi akan dikirim ke <strong>{email}</strong>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer note */}
      <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "20px" }}>
        Estimasi peluncuran: Q3 2026 · HelicoLeads
      </p>
    </div>
  );
}

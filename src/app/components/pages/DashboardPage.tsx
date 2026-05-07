import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  Users,
  Flame,
  TrendingUp,
  BadgeDollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Zap,
  MapPin,
  Clock,
  MessageCircle,
  Phone,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { DashboardSkeleton } from "../Skeletons";

// ─── KPI Data ────────────────────────────────────────────────────────────────
const kpiCards = [
  {
    label: "Total Leads",
    value: "1,240",
    change: "+12.5%",
    positive: true,
    icon: Users,
    accent: "#4F46E5",
    accentBg: "#EEF2FF",
    sub: "vs bulan lalu",
  },
  {
    label: "Hot Leads Hari Ini",
    value: "24",
    change: "+5%",
    positive: true,
    icon: Flame,
    accent: "#DC2626",
    accentBg: "#FEF2F2",
    sub: "vs kemarin",
  },
  {
    label: "Opportunity Value",
    value: "Rp 115jt",
    change: "+8.3%",
    positive: true,
    icon: BadgeDollarSign,
    accent: "#059669",
    accentBg: "#ECFDF5",
    sub: "estimasi total potensi",
  },
  {
    label: "Conversion Rate",
    value: "18.4%",
    change: "-2.1%",
    positive: false,
    icon: TrendingUp,
    accent: "#D97706",
    accentBg: "#FFFBEB",
    sub: "vs bulan lalu",
  },
];

// ─── Pain Alert Data ─────────────────────────────────────────────────────────
const painAlerts = [
  {
    id: 1,
    name: "Coffee Shop Senja",
    location: "Yogyakarta",
    score: 95,
    category: "F&B / Kafe",
    painQuote:
      "\"Sudah 3x pesan tidak datang, staff cuek dan tidak minta maaf. Never coming back!\"",
    potential: "Rp 12.500.000",
    reviewCount: 312,
    rating: 3.1,
    initials: "CS",
    color: "#7C3AED",
    colorBg: "#F5F3FF",
  },
  {
    id: 2,
    name: "Klinik Sehat Utama",
    location: "Jakarta Selatan",
    score: 92,
    category: "Kesehatan",
    painQuote:
      "\"Antrian 3 jam tapi dokternya masih datang terlambat. Sistem booking berantakan sekali.\"",
    potential: "Rp 28.000.000",
    reviewCount: 198,
    rating: 3.3,
    initials: "KS",
    color: "#DC2626",
    colorBg: "#FEF2F2",
  },
  {
    id: 3,
    name: "Resto Makan Enak",
    location: "Bandung",
    score: 88,
    category: "Restoran",
    painQuote:
      "\"Menu favorit selalu habis, kasir lambat, dan tidak ada sistem order online sama sekali.\"",
    potential: "Rp 9.800.000",
    reviewCount: 441,
    rating: 3.4,
    initials: "RM",
    color: "#EA580C",
    colorBg: "#FFF7ED",
  },
];

// ─── Outreach Queue Data ─────────────────────────────────────────────────────
const outreachQueue = [
  {
    id: 1,
    name: "Bengkel Maju Jaya",
    location: "Jakarta Timur",
    score: 91,
    time: "2 jam yang lalu",
    initials: "BM",
    color: "#4F46E5",
    colorBg: "#EEF2FF",
    category: "Otomotif",
    status: "Belum dihubungi",
  },
  {
    id: 2,
    name: "Salon Cantik Bersama",
    location: "Depok, Jawa Barat",
    score: 85,
    time: "4 jam yang lalu",
    initials: "SC",
    color: "#7C3AED",
    colorBg: "#F5F3FF",
    category: "Kecantikan",
    status: "Belum dihubungi",
  },
  {
    id: 3,
    name: "Toko Elektronik Murah",
    location: "Tangerang",
    score: 82,
    time: "5 jam yang lalu",
    initials: "TE",
    color: "#059669",
    colorBg: "#ECFDF5",
    category: "Retail",
    status: "Belum dihubungi",
  },
  {
    id: 4,
    name: "Apotek Sehat Selalu",
    location: "Bekasi",
    score: 78,
    time: "6 jam yang lalu",
    initials: "AS",
    color: "#0284C7",
    colorBg: "#E0F2FE",
    category: "Kesehatan",
    status: "Belum dihubungi",
  },
  {
    id: 5,
    name: "Laundry Bersih Wangi",
    location: "Jakarta Barat",
    score: 74,
    time: "8 jam yang lalu",
    initials: "LB",
    color: "#EA580C",
    colorBg: "#FFF7ED",
    category: "Laundry",
    status: "Belum dihubungi",
  },
];

// ─── Score Bar Color ──────────────────────────────────────────────────────────
function scoreFill(score: number) {
  if (score >= 85) return "#DC2626";
  if (score >= 70) return "#D97706";
  return "#2563EB";
}

// ─── Component ───────────────────────────────────────────────────────────────
export function DashboardPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div
      className="min-h-screen p-5 md:p-6 lg:p-8"
      style={{ background: "#F8FAFC", color: "#0F1F3D" }}
    >

      {/* ── Header Greeting ─────────────────────────────────────────────── */}
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1
            style={{
              color: "#0F1F3D",
              fontSize: "24px",
              fontWeight: 700,
              marginBottom: "8px",
              lineHeight: 1.3,
            }}
          >
            Selamat Datang, Budi! 👋
          </h1>
          <p
            style={{
              color: "#64748B",
              fontSize: "14px",
              lineHeight: 1.6,
              maxWidth: "560px",
            }}
          >
            Intelijen bisnis Anda siap dianalisa hari ini. Ada{" "}
            <span
              style={{
                color: "#DC2626",
                fontWeight: 600,
              }}
            >
              24 Hot Leads baru
            </span>{" "}
            yang perlu ditindaklanjuti untuk mencapai target kuartal ini.
          </p>
        </div>

        <button
          onClick={() => navigate("/new-search")}
          className="flex items-center gap-2 px-4 py-2.5 transition-all flex-shrink-0"
          style={{
            background: "#4F46E5",
            color: "#FFFFFF",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#4338CA")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#4F46E5")
          }
        >
          <Sparkles size={14} />
          Cari Leads Baru
        </button>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 lg:mb-8">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.label}
            className="p-5"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
            }}
          >
            {/* Icon + Label */}
            <div className="flex items-center justify-between mb-4">
              <p
                style={{
                  color: "#64748B",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                {kpi.label}
              </p>
              <div
                className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                style={{
                  background: kpi.accentBg,
                  borderRadius: "8px",
                }}
              >
                <kpi.icon size={15} style={{ color: kpi.accent }} />
              </div>
            </div>

            {/* Value */}
            <p
              style={{
                color: "#0F1F3D",
                fontSize: "26px",
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: "10px",
                letterSpacing: "-0.5px",
              }}
            >
              {kpi.value}
            </p>

            {/* Change */}
            <div className="flex items-center gap-1.5">
              {kpi.positive ? (
                <div
                  className="flex items-center gap-0.5 px-1.5 py-0.5"
                  style={{
                    background: "#F0FDF4",
                    borderRadius: "4px",
                  }}
                >
                  <ArrowUpRight size={11} style={{ color: "#16A34A" }} />
                  <span
                    style={{
                      color: "#16A34A",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {kpi.change}
                  </span>
                </div>
              ) : (
                <div
                  className="flex items-center gap-0.5 px-1.5 py-0.5"
                  style={{
                    background: "#FEF2F2",
                    borderRadius: "4px",
                  }}
                >
                  <ArrowDownRight size={11} style={{ color: "#DC2626" }} />
                  <span
                    style={{
                      color: "#DC2626",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {kpi.change}
                  </span>
                </div>
              )}
              <span style={{ color: "#94A3B8", fontSize: "11px" }}>
                {kpi.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pain Alert ──────────────────────────────────────────────────── */}
      <div className="mb-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 flex items-center justify-center"
              style={{ background: "#FEF2F2", borderRadius: "8px" }}
            >
              <AlertCircle size={14} style={{ color: "#DC2626" }} />
            </div>
            <div>
              <h2
                style={{
                  color: "#0F1F3D",
                  fontSize: "15px",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                Pain Alert
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>
                Bisnis yang Butuh Solusi Anda Sekarang
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/new-search")}
            className="flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: "#4F46E5", fontSize: "13px", fontWeight: 500 }}
          >
            Lihat Semua Alerts
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Pain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {painAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex flex-col p-5"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
              }}
            >
              {/* Card Top */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                    style={{
                      background: alert.colorBg,
                      borderRadius: "8px",
                    }}
                  >
                    <span
                      style={{
                        color: alert.color,
                        fontSize: "13px",
                        fontWeight: 700,
                      }}
                    >
                      {alert.initials}
                    </span>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#0F1F3D",
                        fontSize: "14px",
                        fontWeight: 600,
                        lineHeight: 1.2,
                      }}
                    >
                      {alert.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} style={{ color: "#94A3B8" }} />
                      <span style={{ color: "#94A3B8", fontSize: "11px" }}>
                        {alert.location}
                      </span>
                    </div>
                  </div>
                </div>
                {/* High Intent Badge */}
                <span
                  className="flex-shrink-0 px-2 py-0.5"
                  style={{
                    background: "#FEF2F2",
                    color: "#DC2626",
                    fontSize: "10px",
                    fontWeight: 700,
                    borderRadius: "4px",
                    border: "1px solid #FECACA",
                    letterSpacing: "0.2px",
                  }}
                >
                  High Intent
                </span>
              </div>

              {/* Pain Score Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    style={{ color: "#64748B", fontSize: "11px", fontWeight: 500 }}
                  >
                    Pain Score
                  </span>
                  <span
                    style={{
                      color: scoreFill(alert.score),
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {alert.score}
                    <span style={{ color: "#94A3B8", fontSize: "11px", fontWeight: 400 }}>
                      /100
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    background: "#F1F5F9",
                    borderRadius: "4px",
                    height: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${alert.score}%`,
                      height: "100%",
                      background: scoreFill(alert.score),
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>

              {/* Pain Quote */}
              <div
                className="flex-1 mb-4 p-3"
                style={{
                  background: "#FAFBFC",
                  border: "1px solid #F1F5F9",
                  borderRadius: "8px",
                  borderLeft: `3px solid ${alert.color}`,
                }}
              >
                <p
                  style={{
                    color: "#475569",
                    fontSize: "12px",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}
                >
                  {alert.painQuote}
                </p>
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p style={{ color: "#94A3B8", fontSize: "11px" }}>
                    Est. Potensi
                  </p>
                  <p
                    style={{
                      color: "#0F1F3D",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {alert.potential}
                  </p>
                </div>
                <span
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    color: "#64748B",
                    fontSize: "11px",
                    padding: "3px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {alert.category}
                </span>
              </div>

              {/* Hubungi Sekarang Button */}
              <button
                className="flex items-center justify-center gap-2 w-full py-2.5 transition-all"
                style={{
                  background: "#25D366",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "#1EBE59")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "#25D366")
                }
              >
                <MessageCircle size={14} />
                Hubungi Sekarang
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Outreach Queue ───────────────────────────────────────────────── */}
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 flex items-center justify-center"
              style={{ background: "#EEF2FF", borderRadius: "8px" }}
            >
              <Zap size={14} style={{ color: "#4F46E5" }} />
            </div>
            <div>
              <h2
                style={{
                  color: "#0F1F3D",
                  fontSize: "15px",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                Outreach Queue
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>
                Prioritas Hari Ini
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/outreach-crm")}
            className="flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: "#4F46E5", fontSize: "13px", fontWeight: 500 }}
          >
            Lihat Semua
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Queue List */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {outreachQueue.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-4 px-5 py-4 transition-colors"
              style={{
                borderBottom:
                  index < outreachQueue.length - 1
                    ? "1px solid #F1F5F9"
                    : "none",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#FAFBFC")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "transparent")
              }
            >
              {/* Rank */}
              <span
                style={{
                  color: "#CBD5E1",
                  fontSize: "12px",
                  fontWeight: 600,
                  width: "20px",
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </span>

              {/* Avatar */}
              <div
                className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                style={{
                  background: item.colorBg,
                  borderRadius: "8px",
                }}
              >
                <span
                  style={{
                    color: item.color,
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {item.initials}
                </span>
              </div>

              {/* Name + Meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    style={{
                      color: "#0F1F3D",
                      fontSize: "13px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.name}
                  </p>
                  <span
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      color: "#64748B",
                      fontSize: "10px",
                      padding: "1px 6px",
                      borderRadius: "4px",
                      flexShrink: 0,
                    }}
                  >
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <div className="flex items-center gap-1">
                    <MapPin size={10} style={{ color: "#94A3B8" }} />
                    <span style={{ color: "#94A3B8", fontSize: "11px" }}>
                      {item.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={10} style={{ color: "#94A3B8" }} />
                    <span style={{ color: "#94A3B8", fontSize: "11px" }}>
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pain Score */}
              <div className="flex flex-col items-center flex-shrink-0 w-16">
                <span
                  style={{
                    color: scoreFill(item.score),
                    fontSize: "16px",
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {item.score}
                </span>
                <span style={{ color: "#94A3B8", fontSize: "10px", marginTop: "2px" }}>
                  Pain Score
                </span>
              </div>

              {/* WA Button */}
              <button
                className="flex items-center gap-2 px-4 py-2 transition-all flex-shrink-0"
                style={{
                  background: "#F0FDF4",
                  color: "#16A34A",
                  border: "1px solid #BBF7D0",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#25D366";
                  (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                  (e.currentTarget as HTMLElement).style.borderColor = "#25D366";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#F0FDF4";
                  (e.currentTarget as HTMLElement).style.color = "#16A34A";
                  (e.currentTarget as HTMLElement).style.borderColor = "#BBF7D0";
                }}
              >
                <Phone size={13} />
                Kirim Pesan WA
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
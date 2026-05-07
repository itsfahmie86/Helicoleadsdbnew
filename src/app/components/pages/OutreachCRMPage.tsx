import { useState, useEffect } from "react";
import {
  Send,
  MessageCircle,
  Users,
  TrendingUp,
  BadgeDollarSign,
  Zap,
  MapPin,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Play,
  Pause,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Target,
} from "lucide-react";
import { OutreachCRMSkeleton } from "../Skeletons";

// ─── KPI Data ─────────────────────────────────────────────────────────────────
const kpiCards = [
  {
    label: "Outreach Hari Ini",
    value: "12",
    sub: "dari 18 dijadwalkan",
    change: "+3 vs kemarin",
    positive: true,
    icon: Send,
    accent: "#4F46E5",
    accentBg: "#EEF2FF",
  },
  {
    label: "Leads Prioritas",
    value: "7",
    sub: "score ≥ 80",
    change: "+2 lead baru",
    positive: true,
    icon: Target,
    accent: "#DC2626",
    accentBg: "#FEF2F2",
  },
  {
    label: "Response Rate",
    value: "34.2%",
    sub: "dari total outreach",
    change: "+5.1% vs minggu lalu",
    positive: true,
    icon: TrendingUp,
    accent: "#059669",
    accentBg: "#ECFDF5",
  },
  {
    label: "Estimasi Deal Closed",
    value: "Rp 48jt",
    sub: "estimasi bulan ini",
    change: "+12.8% vs bulan lalu",
    positive: true,
    icon: BadgeDollarSign,
    accent: "#D97706",
    accentBg: "#FFFBEB",
  },
];

// ─── Outreach Queue Data ──────────────────────────────────────────────────────
type LeadStatus = "Belum Dihubungi" | "Sudah WA" | "Menunggu Reply" | "Follow-up";

interface QueueLead {
  id: number;
  name: string;
  location: string;
  category: string;
  score: number;
  time: string;
  initials: string;
  color: string;
  colorBg: string;
  status: LeadStatus;
  potential: string;
}

const initialQueue: QueueLead[] = [
  { id: 1, name: "Klinik Sehat Utama",    location: "Jakarta Selatan", category: "Kesehatan", score: 92, time: "1 jam lalu",  initials: "KS", color: "#DC2626", colorBg: "#FEF2F2", status: "Belum Dihubungi", potential: "Rp 28jt" },
  { id: 2, name: "Bengkel Maju Jaya",     location: "Jakarta Timur",   category: "Otomotif",  score: 91, time: "2 jam lalu",  initials: "BM", color: "#4F46E5", colorBg: "#EEF2FF", status: "Sudah WA",        potential: "Rp 15jt" },
  { id: 3, name: "Laundry Cepat Express", location: "Bekasi",          category: "Laundry",   score: 88, time: "3 jam lalu",  initials: "LC", color: "#0284C7", colorBg: "#E0F2FE", status: "Menunggu Reply",  potential: "Rp 8jt"  },
  { id: 4, name: "Toko Elektronik Murah", location: "Tangerang",       category: "Retail",    score: 82, time: "4 jam lalu",  initials: "TE", color: "#059669", colorBg: "#ECFDF5", status: "Belum Dihubungi", potential: "Rp 12jt" },
  { id: 5, name: "Apotek Sehat Selalu",   location: "Bekasi",          category: "Kesehatan", score: 79, time: "5 jam lalu",  initials: "AS", color: "#7C3AED", colorBg: "#F5F3FF", status: "Follow-up",       potential: "Rp 9jt"  },
  { id: 6, name: "Salon Cantik Bersama",  location: "Depok",           category: "Kecantikan",score: 76, time: "6 jam lalu",  initials: "SC", color: "#D97706", colorBg: "#FFFBEB", status: "Belum Dihubungi", potential: "Rp 7jt"  },
  { id: 7, name: "Resto Makan Enak",      location: "Bandung",         category: "F&B",       score: 74, time: "8 jam lalu",  initials: "RM", color: "#EA580C", colorBg: "#FFF7ED", status: "Sudah WA",        potential: "Rp 10jt" },
];

// ─── Campaign Data ────────────────────────────────────────────────────────────
type CampaignStatus = "Running" | "Paused" | "Draft" | "Completed";
type CampaignTab    = "active" | "draft" | "completed";

interface Campaign {
  id: number;
  name: string;
  leads: number;
  contacted: number;
  progress: number;
  status: CampaignStatus;
  started: string;
  conversions?: number;
  tab: CampaignTab;
}

const campaigns: Campaign[] = [
  { id: 1, name: "Klinik & Kesehatan Jakarta",  leads: 48, contacted: 30, progress: 62,  status: "Running",   started: "3 hari lalu",          tab: "active"    },
  { id: 2, name: "Laundry & Kebersihan Bekasi", leads: 35, contacted: 14, progress: 41,  status: "Running",   started: "5 hari lalu",          tab: "active"    },
  { id: 3, name: "Otomotif Jakarta Timur",      leads: 27, contacted: 8,  progress: 28,  status: "Paused",    started: "7 hari lalu",          tab: "active"    },
  { id: 4, name: "F&B Surabaya Q3",             leads: 0,  contacted: 0,  progress: 0,   status: "Draft",     started: "Dibuat kemarin",       tab: "draft"     },
  { id: 5, name: "Retail Bandung Pusat",        leads: 0,  contacted: 0,  progress: 0,   status: "Draft",     started: "Dibuat 2 hari lalu",   tab: "draft"     },
  { id: 6, name: "Salon & Beauty Depok",        leads: 52, contacted: 52, progress: 100, status: "Completed", started: "Selesai 12 hari lalu", conversions: 18, tab: "completed" },
  { id: 7, name: "Apotek Jabodetabek",          leads: 63, contacted: 63, progress: 100, status: "Completed", started: "Selesai 20 hari lalu", conversions: 21, tab: "completed" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function scoreFill(score: number) {
  if (score >= 85) return "#DC2626";
  if (score >= 70) return "#D97706";
  return "#2563EB";
}

const statusConfig: Record<LeadStatus, { bg: string; color: string; border: string }> = {
  "Belum Dihubungi": { bg: "#F8FAFC", color: "#64748B", border: "#E2E8F0" },
  "Sudah WA":        { bg: "#EEF2FF", color: "#4F46E5", border: "#C7D2FE" },
  "Menunggu Reply":  { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  "Follow-up":       { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
};

// ─── Component ────────────────────────────────────────────────────────────────
export function OutreachCRMPage() {
  // ── ALL hooks must be declared unconditionally at the top ──────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CampaignTab>("active");
  const [leadStatuses, setLeadStatuses] = useState<Record<number, LeadStatus>>(
    Object.fromEntries(initialQueue.map((l) => [l.id, l.status]))
  );

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1100);
    return () => clearTimeout(t);
  }, []);

  // ── Early return is safe here — all hooks are already declared above ───────
  if (isLoading) return <OutreachCRMSkeleton />;

  const filteredCampaigns = campaigns.filter((c) => c.tab === activeTab);

  const cycleStatus = (id: number) => {
    const order: LeadStatus[] = ["Belum Dihubungi", "Sudah WA", "Menunggu Reply", "Follow-up"];
    const current = leadStatuses[id];
    const next = order[(order.indexOf(current) + 1) % order.length];
    setLeadStatuses((prev) => ({ ...prev, [id]: next }));
  };

  return (
    <div className="min-h-screen p-5 md:p-6 lg:p-8" style={{ background: "#F8FAFC", color: "#0F1F3D" }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <div
              className="w-8 h-8 flex items-center justify-center flex-shrink-0"
              style={{ background: "#EEF2FF", borderRadius: "8px" }}
            >
              <Send size={15} style={{ color: "#4F46E5" }} />
            </div>
            <h1 style={{ color: "#0F1F3D", fontSize: "22px", fontWeight: 700 }}>
              Outreach CRM
            </h1>
          </div>
          <p style={{ color: "#64748B", fontSize: "14px", marginLeft: "44px" }}>
            Kelola komunikasi dan tindak lanjut leads Anda di satu tempat
          </p>
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.label}
            className="p-4"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p style={{ color: "#64748B", fontSize: "12px", fontWeight: 500 }}>{kpi.label}</p>
              <div
                className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                style={{ background: kpi.accentBg, borderRadius: "8px" }}
              >
                <kpi.icon size={15} style={{ color: kpi.accent }} />
              </div>
            </div>
            <p style={{ color: "#0F1F3D", fontSize: "24px", fontWeight: 700, lineHeight: 1, marginBottom: "4px", letterSpacing: "-0.5px" }}>
              {kpi.value}
            </p>
            <p style={{ color: "#94A3B8", fontSize: "11px", marginBottom: "8px" }}>{kpi.sub}</p>
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 w-fit"
              style={{ background: "#F0FDF4", borderRadius: "4px" }}
            >
              <ArrowUpRight size={10} style={{ color: "#16A34A" }} />
              <span style={{ color: "#16A34A", fontSize: "11px", fontWeight: 600 }}>{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Layout: stacked on mobile/tablet, side-by-side on xl ───── */}
      <div className="flex flex-col xl:flex-row gap-5">

        {/* ── LEFT: Outreach Queue ────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 flex items-center justify-center" style={{ background: "#EEF2FF", borderRadius: "8px" }}>
                <Zap size={14} style={{ color: "#4F46E5" }} />
              </div>
              <div>
                <h2 style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 700, lineHeight: 1 }}>
                  Outreach Queue
                </h2>
                <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>Prioritas Hari Ini</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5"
                style={{ background: "#EEF2FF", color: "#4F46E5", fontSize: "11px", fontWeight: 600, borderRadius: "4px" }}
              >
                {initialQueue.length} leads
              </span>
              <button
                className="flex items-center gap-1 transition-opacity hover:opacity-70"
                style={{ color: "#4F46E5", fontSize: "13px", fontWeight: 500 }}
              >
                Filter
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Queue — card list (no fixed-width grid, fully responsive) */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden" }}>

            {/* Table header row */}
            <div
              className="hidden md:grid px-4 py-2.5"
              style={{
                gridTemplateColumns: "28px 40px 1fr 68px 100px 120px",
                gap: "12px",
                borderBottom: "1px solid #F1F5F9",
                background: "#FAFBFC",
              }}
            >
              {["#", "", "Bisnis", "Score", "Status", "Aksi"].map((h) => (
                <span key={h} style={{ color: "#94A3B8", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px" }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {initialQueue.map((item, index) => {
              const currentStatus = leadStatuses[item.id];
              const sc = statusConfig[currentStatus];
              return (
                <div key={item.id}>
                  {/* ── Desktop row (md+) ── */}
                  <div
                    className="hidden md:grid px-4 py-3 transition-colors"
                    style={{
                      gridTemplateColumns: "28px 40px 1fr 68px 100px 120px",
                      gap: "12px",
                      alignItems: "center",
                      borderBottom: index < initialQueue.length - 1 ? "1px solid #F1F5F9" : "none",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FAFBFC")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    {/* Rank */}
                    <span style={{ color: "#CBD5E1", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
                      {index + 1}
                    </span>

                    {/* Avatar */}
                    <div
                      className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                      style={{ background: item.colorBg, borderRadius: "8px" }}
                    >
                      <span style={{ color: item.color, fontSize: "11px", fontWeight: 700 }}>{item.initials}</span>
                    </div>

                    {/* Name + Meta */}
                    <div className="min-w-0">
                      <p style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <div className="flex items-center gap-1">
                          <MapPin size={10} style={{ color: "#94A3B8" }} />
                          <span style={{ color: "#94A3B8", fontSize: "11px" }}>{item.location}</span>
                        </div>
                        <span style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#64748B", fontSize: "10px", padding: "1px 5px", borderRadius: "4px" }}>
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Pain Score */}
                    <div className="flex flex-col items-center">
                      <span style={{ color: scoreFill(item.score), fontSize: "16px", fontWeight: 700, lineHeight: 1 }}>
                        {item.score}
                      </span>
                      <div style={{ width: "44px", height: "4px", background: "#F1F5F9", borderRadius: "4px", marginTop: "4px", overflow: "hidden" }}>
                        <div style={{ width: `${item.score}%`, height: "100%", background: scoreFill(item.score), borderRadius: "4px" }} />
                      </div>
                    </div>

                    {/* Status Badge */}
                    <button
                      onClick={() => cycleStatus(item.id)}
                      title="Klik untuk ubah status"
                      className="flex items-center gap-1 px-2 py-1 transition-all w-fit"
                      style={{
                        background: sc.bg,
                        color: sc.color,
                        border: `1px solid ${sc.border}`,
                        borderRadius: "6px",
                        fontSize: "10.5px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                    >
                      {currentStatus === "Sudah WA"        ? <CheckCircle2 size={10} /> :
                       currentStatus === "Menunggu Reply"  ? <Clock size={10} /> :
                       currentStatus === "Follow-up"       ? <ArrowUpRight size={10} /> :
                                                             <Circle size={10} />}
                      {currentStatus}
                    </button>

                    {/* WA Button */}
                    <button
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 transition-all"
                      style={{
                        background: "#F0FDF4",
                        color: "#16A34A",
                        border: "1px solid #BBF7D0",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        width: "100%",
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
                      <MessageCircle size={11} />
                      Kirim WA
                    </button>
                  </div>

                  {/* ── Mobile card (< md) ── */}
                  <div
                    className="md:hidden px-4 py-3 flex items-center gap-3"
                    style={{ borderBottom: index < initialQueue.length - 1 ? "1px solid #F1F5F9" : "none" }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                      style={{ background: item.colorBg, borderRadius: "8px" }}
                    >
                      <span style={{ color: item.color, fontSize: "12px", fontWeight: 700 }}>{item.initials}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.name}
                        </p>
                        <span style={{ color: scoreFill(item.score), fontSize: "14px", fontWeight: 700, flexShrink: 0 }}>
                          {item.score}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <MapPin size={10} style={{ color: "#94A3B8" }} />
                          <span style={{ color: "#94A3B8", fontSize: "11px" }}>{item.location}</span>
                        </div>
                        <button
                          onClick={() => cycleStatus(item.id)}
                          className="flex items-center gap-1 px-1.5 py-0.5 transition-all"
                          style={{
                            background: sc.bg,
                            color: sc.color,
                            border: `1px solid ${sc.border}`,
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {currentStatus === "Sudah WA"       ? <CheckCircle2 size={9} /> :
                           currentStatus === "Menunggu Reply" ? <Clock size={9} /> :
                           currentStatus === "Follow-up"      ? <ArrowUpRight size={9} /> :
                                                                <Circle size={9} />}
                          {currentStatus}
                        </button>
                      </div>
                    </div>

                    {/* WA Button */}
                    <button
                      className="flex items-center justify-center w-9 h-9 flex-shrink-0 transition-all"
                      style={{
                        background: "#F0FDF4",
                        color: "#16A34A",
                        border: "1px solid #BBF7D0",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#25D366";
                        (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#F0FDF4";
                        (e.currentTarget as HTMLElement).style.color = "#16A34A";
                      }}
                    >
                      <MessageCircle size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Campaigns + Quick Stats ──────────────────────────────── */}
        <div className="flex flex-col gap-5 xl:w-[350px] xl:flex-shrink-0">

          {/* Campaign Section */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden" }}>
            {/* Section Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 flex items-center justify-center" style={{ background: "#F0FDF4", borderRadius: "8px" }}>
                  <Users size={14} style={{ color: "#059669" }} />
                </div>
                <div>
                  <h2 style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 700, lineHeight: 1 }}>Campaigns</h2>
                  <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>Kelola campaign aktif Anda</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex px-5" style={{ borderBottom: "1px solid #F1F5F9" }}>
              {(["active", "draft", "completed"] as CampaignTab[]).map((tab) => {
                const labels: Record<CampaignTab, string> = { active: "Active", draft: "Draft", completed: "Completed" };
                const count = campaigns.filter((c) => c.tab === tab).length;
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex items-center gap-1.5 px-3 py-2.5 transition-all"
                    style={{
                      fontSize: "12px",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "#4F46E5" : "#64748B",
                      borderBottom: isActive ? "2px solid #4F46E5" : "2px solid transparent",
                      background: "transparent",
                      marginBottom: "-1px",
                      cursor: "pointer",
                    }}
                  >
                    {labels[tab]}
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        background: isActive ? "#EEF2FF" : "#F1F5F9",
                        color: isActive ? "#4F46E5" : "#94A3B8",
                        borderRadius: "10px",
                        padding: "1px 6px",
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Campaign List */}
            <div>
              {filteredCampaigns.map((campaign, index) => (
                <div
                  key={campaign.id}
                  className="px-5 py-4 transition-colors"
                  style={{ borderBottom: index < filteredCampaigns.length - 1 ? "1px solid #F1F5F9" : "none", cursor: "default" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FAFBFC")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  {/* Campaign Name + Status */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 mr-2">
                      <p style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600, lineHeight: 1.3 }}>
                        {campaign.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <Users size={10} style={{ color: "#94A3B8" }} />
                          <span style={{ color: "#94A3B8", fontSize: "11px" }}>{campaign.leads} leads</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={10} style={{ color: "#94A3B8" }} />
                          <span style={{ color: "#94A3B8", fontSize: "11px" }}>{campaign.started}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className="flex items-center gap-1 px-2 py-0.5 flex-shrink-0"
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        borderRadius: "4px",
                        background:
                          campaign.status === "Running"   ? "#F0FDF4" :
                          campaign.status === "Paused"    ? "#FFFBEB" :
                          campaign.status === "Completed" ? "#EEF2FF" : "#F8FAFC",
                        color:
                          campaign.status === "Running"   ? "#16A34A" :
                          campaign.status === "Paused"    ? "#D97706" :
                          campaign.status === "Completed" ? "#4F46E5" : "#64748B",
                      }}
                    >
                      {campaign.status === "Running"   && <Play size={8} />}
                      {campaign.status === "Paused"    && <Pause size={8} />}
                      {campaign.status === "Completed" && <CheckCircle2 size={8} />}
                      {campaign.status === "Draft"     && <MoreHorizontal size={8} />}
                      {campaign.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {campaign.tab !== "draft" && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ color: "#94A3B8", fontSize: "10px", fontWeight: 500 }}>
                          {campaign.tab === "completed"
                            ? `${campaign.conversions} konversi`
                            : `${campaign.contacted} / ${campaign.leads} dihubungi`}
                        </span>
                        <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 600 }}>
                          {campaign.progress}%
                        </span>
                      </div>
                      <div style={{ background: "#F1F5F9", borderRadius: "4px", height: "5px", overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${campaign.progress}%`,
                            height: "100%",
                            background:
                              campaign.status === "Completed" ? "#4F46E5" :
                              campaign.status === "Paused"    ? "#D97706" : "#059669",
                            borderRadius: "4px",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      className="flex-1 py-1.5 transition-all"
                      style={{
                        background: "#F8FAFC",
                        color: "#4F46E5",
                        border: "1px solid #E2E8F0",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#EEF2FF";
                        (e.currentTarget as HTMLElement).style.borderColor = "#C7D2FE";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#F8FAFC";
                        (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0";
                      }}
                    >
                      Lihat Detail
                    </button>
                    {campaign.status === "Running" && (
                      <button
                        className="py-1.5 px-3 flex items-center justify-center transition-all"
                        style={{
                          background: "#FFFBEB",
                          color: "#D97706",
                          border: "1px solid #FDE68A",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FEF9C3")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#FFFBEB")}
                      >
                        <Pause size={10} />
                      </button>
                    )}
                    {campaign.status === "Paused" && (
                      <button
                        className="py-1.5 px-3 flex items-center justify-center transition-all"
                        style={{
                          background: "#F0FDF4",
                          color: "#16A34A",
                          border: "1px solid #BBF7D0",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#DCFCE7")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#F0FDF4")}
                      >
                        <Play size={10} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredCampaigns.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 px-5">
                  <div
                    className="w-10 h-10 flex items-center justify-center mb-3"
                    style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                  >
                    <Users size={18} style={{ color: "#94A3B8" }} />
                  </div>
                  <p style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                    Belum ada campaign
                  </p>
                  <p style={{ color: "#94A3B8", fontSize: "12px", textAlign: "center" }}>
                    Buat campaign baru untuk memulai outreach
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Quick Stats ───────────────────────────────────────────────── */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "20px" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 flex items-center justify-center" style={{ background: "#FEF2F2", borderRadius: "8px" }}>
                <Target size={14} style={{ color: "#DC2626" }} />
              </div>
              <h2 style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 700 }}>Pipeline Status</h2>
            </div>

            <div className="flex flex-col gap-3">
              {(
                [
                  { label: "Belum Dihubungi", count: initialQueue.filter((l) => leadStatuses[l.id] === "Belum Dihubungi").length, color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
                  { label: "Sudah WA",        count: initialQueue.filter((l) => leadStatuses[l.id] === "Sudah WA").length,        color: "#4F46E5", bg: "#EEF2FF", border: "#C7D2FE" },
                  { label: "Menunggu Reply",  count: initialQueue.filter((l) => leadStatuses[l.id] === "Menunggu Reply").length,  color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
                  { label: "Follow-up",       count: initialQueue.filter((l) => leadStatuses[l.id] === "Follow-up").length,       color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
                ] as { label: LeadStatus; count: number; color: string; bg: string; border: string }[]
              ).map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="px-2 py-0.5"
                      style={{ background: row.bg, border: `1px solid ${row.border}`, borderRadius: "4px" }}
                    >
                      <span style={{ color: row.color, fontSize: "11px", fontWeight: 600 }}>{row.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div style={{ width: "80px", height: "5px", background: "#F1F5F9", borderRadius: "4px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${(row.count / initialQueue.length) * 100}%`,
                          height: "100%",
                          background: row.color,
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 700, minWidth: "16px", textAlign: "right" }}>
                      {row.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
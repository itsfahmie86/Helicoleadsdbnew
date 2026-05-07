import { useState } from "react";
import {
  Target,
  Plus,
  Play,
  Pause,
  MoreHorizontal,
  Mail,
  MessageSquare,
  Linkedin,
  Users,
  Send,
  TrendingUp,
  CheckCircle2,
  Clock,
  FileText,
  ChevronDown,
  Zap,
  Eye,
  BarChart3,
  Filter,
  Search,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type CampaignStatus = "active" | "draft" | "paused" | "completed";
type CampaignChannel = "email" | "whatsapp" | "linkedin" | "multi";

interface Campaign {
  id: number;
  name: string;
  status: CampaignStatus;
  channel: CampaignChannel;
  leadsTargeted: number;
  sent: number;
  opened: number;
  replied: number;
  startDate: string;
  endDate?: string;
  description: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const campaigns: Campaign[] = [
  {
    id: 1,
    name: "Outreach Restoran Jakarta Q2",
    status: "active",
    channel: "whatsapp",
    leadsTargeted: 148,
    sent: 92,
    opened: 74,
    replied: 21,
    startDate: "2 Mei 2026",
    description: "Follow-up restoran di Jabodetabek dengan pain score ≥ 70",
  },
  {
    id: 2,
    name: "Email Blast Klinik Kecantikan",
    status: "active",
    channel: "email",
    leadsTargeted: 86,
    sent: 86,
    opened: 61,
    replied: 14,
    startDate: "28 Apr 2026",
    description: "Penawaran layanan digitalisasi untuk klinik estetika Bandung & Jakarta",
  },
  {
    id: 3,
    name: "LinkedIn B2B Enterprise Pitch",
    status: "paused",
    channel: "linkedin",
    leadsTargeted: 42,
    sent: 29,
    opened: 22,
    replied: 5,
    startDate: "20 Apr 2026",
    description: "Pitch ke decision maker perusahaan manufaktur skala menengah",
  },
  {
    id: 4,
    name: "Multi-Channel UMKM Tangerang",
    status: "active",
    channel: "multi",
    leadsTargeted: 220,
    sent: 155,
    opened: 108,
    replied: 33,
    startDate: "15 Apr 2026",
    description: "Kombinasi WA + Email untuk UMKM F&B di Tangerang Selatan",
  },
  {
    id: 5,
    name: "Cold Email Bengkel Motor",
    status: "completed",
    channel: "email",
    leadsTargeted: 64,
    sent: 64,
    opened: 41,
    replied: 9,
    startDate: "1 Apr 2026",
    endDate: "15 Apr 2026",
    description: "Campaign selesai — prospek otomotif Bekasi & Depok",
  },
  {
    id: 6,
    name: "WA Blast Apotek Jabodetabek",
    status: "draft",
    channel: "whatsapp",
    leadsTargeted: 110,
    sent: 0,
    opened: 0,
    replied: 0,
    startDate: "—",
    description: "Draft siap kirim — apotek & klinik kesehatan area Jabodetabek",
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const statusConfig: Record<CampaignStatus, { label: string; bg: string; color: string; border: string; icon: typeof CheckCircle2 }> = {
  active:    { label: "Aktif",     bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0", icon: Play       },
  paused:    { label: "Dijeda",    bg: "#FFFBEB", color: "#D97706", border: "#FDE68A", icon: Pause      },
  draft:     { label: "Draft",     bg: "#F8FAFC", color: "#64748B", border: "#E2E8F0", icon: FileText   },
  completed: { label: "Selesai",   bg: "#EEF2FF", color: "#4F46E5", border: "#C7D2FE", icon: CheckCircle2 },
};

const channelConfig: Record<CampaignChannel, { label: string; icon: typeof Mail; color: string; bg: string }> = {
  email:    { label: "Email",     icon: Mail,         color: "#4F46E5", bg: "#EEF2FF" },
  whatsapp: { label: "WhatsApp",  icon: MessageSquare, color: "#16A34A", bg: "#F0FDF4" },
  linkedin: { label: "LinkedIn",  icon: Linkedin,      color: "#0284C7", bg: "#E0F2FE" },
  multi:    { label: "Multi",     icon: Zap,           color: "#D97706", bg: "#FFFBEB" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof Target;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div
      className="flex flex-col gap-3 p-5"
      style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}
    >
      <div className="flex items-start justify-between">
        <p style={{ color: "#64748B", fontSize: "12px", fontWeight: 500 }}>{label}</p>
        <div
          className="w-8 h-8 flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg, borderRadius: "7px" }}
        >
          <Icon size={15} style={{ color: iconColor }} />
        </div>
      </div>
      <div>
        <p style={{ color: "#0F1F3D", fontSize: "24px", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.5px" }}>
          {value}
        </p>
        <p style={{ color: "#94A3B8", fontSize: "11px", marginTop: "4px" }}>{sub}</p>
      </div>
    </div>
  );
}

function OpenRateBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const color = pct >= 60 ? "#16A34A" : pct >= 35 ? "#D97706" : "#DC2626";
  return (
    <div className="flex items-center gap-2">
      <div style={{ width: "48px", background: "#F1F5F9", borderRadius: "3px", height: "4px", flexShrink: 0 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "3px" }} />
      </div>
      <span style={{ color, fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap" }}>{pct}%</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function CampaignsPage() {
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  // Derived
  const totalLeads   = campaigns.reduce((a, c) => a + c.leadsTargeted, 0);
  const totalSent    = campaigns.reduce((a, c) => a + c.sent, 0);
  const totalReplied = campaigns.reduce((a, c) => a + c.replied, 0);
  const avgReply     = totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0;
  const activeCnt    = campaigns.filter((c) => c.status === "active").length;

  const filtered = campaigns.filter((c) => {
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = [
    { label: "Total Campaign", value: String(campaigns.length), sub: `${activeCnt} aktif sekarang`, icon: Target, iconBg: "#EEF2FF", iconColor: "#4F46E5" },
    { label: "Leads Dijangkau", value: totalLeads.toLocaleString("id-ID"), sub: `${totalSent} pesan terkirim`, icon: Users, iconBg: "#F0FDF4", iconColor: "#16A34A" },
    { label: "Total Balasan", value: String(totalReplied), sub: `dari ${totalSent} pesan terkirim`, icon: Send, iconBg: "#FFFBEB", iconColor: "#D97706" },
    { label: "Avg. Reply Rate", value: `${avgReply}%`, sub: "rata-rata semua campaign", icon: TrendingUp, iconBg: "#FEF2F2", iconColor: "#DC2626" },
  ];

  const filterTabs: { label: string; value: CampaignStatus | "all" }[] = [
    { label: "Semua", value: "all" },
    { label: "Aktif", value: "active" },
    { label: "Draft", value: "draft" },
    { label: "Dijeda", value: "paused" },
    { label: "Selesai", value: "completed" },
  ];

  return (
    <div
      className="min-h-screen p-5 md:p-6 lg:p-8"
      style={{ background: "#F8FAFC", color: "#0F1F3D" }}
      onClick={() => setOpenMenu(null)}
    >

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <div
              className="w-8 h-8 flex items-center justify-center flex-shrink-0"
              style={{ background: "#EEF2FF", borderRadius: "8px" }}
            >
              <Target size={15} style={{ color: "#4F46E5" }} />
            </div>
            <h1 style={{ color: "#0F1F3D", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.3px" }}>
              Campaigns
            </h1>
            <span
              style={{
                background: "#EEF2FF", color: "#4F46E5",
                border: "1px solid #C7D2FE",
                fontSize: "10px", fontWeight: 700,
                padding: "2px 7px", borderRadius: "5px",
                letterSpacing: "0.3px",
              }}
            >
              {activeCnt} AKTIF
            </span>
          </div>
          <p style={{ color: "#64748B", fontSize: "13px" }}>
            Kelola dan pantau semua campaign outreach Anda dari satu tempat.
          </p>
        </div>

        {/* Primary CTA */}
        <button
          className="flex items-center gap-2 px-5 py-2.5 flex-shrink-0 transition-all"
          style={{
            background: "#0F1F3D",
            color: "#FFFFFF",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1E3A5F")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#0F1F3D")}
        >
          <Plus size={15} strokeWidth={2.5} />
          Buat Campaign Baru
        </button>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Toolbar: Search + Filters ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        {/* Search */}
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 flex-1"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            maxWidth: "320px",
          }}
        >
          <Search size={14} style={{ color: "#94A3B8", flexShrink: 0 }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari campaign..."
            className="flex-1 outline-none bg-transparent"
            style={{ color: "#0F1F3D", fontSize: "13px", border: "none", padding: 0 }}
          />
        </div>

        {/* Filter tabs */}
        <div
          className="flex items-center gap-1 p-1"
          style={{ background: "#F1F5F9", borderRadius: "8px" }}
        >
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className="flex items-center gap-1.5 px-3 py-1.5 transition-all"
              style={{
                background: statusFilter === tab.value ? "#FFFFFF" : "transparent",
                border: statusFilter === tab.value ? "1px solid #E2E8F0" : "1px solid transparent",
                borderRadius: "6px",
                color: statusFilter === tab.value ? "#0F1F3D" : "#64748B",
                fontSize: "12px",
                fontWeight: statusFilter === tab.value ? 600 : 400,
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
              {tab.value !== "all" && (
                <span
                  style={{
                    background: statusFilter === tab.value ? "#F1F5F9" : "transparent",
                    color: statusFilter === tab.value ? "#0F1F3D" : "#94A3B8",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "0 4px",
                    borderRadius: "3px",
                    lineHeight: 1.6,
                  }}
                >
                  {campaigns.filter((c) => c.status === tab.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Secondary filter button */}
        <button
          className="flex items-center gap-2 px-3 py-2 ml-auto transition-all"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            color: "#64748B",
            fontSize: "12px",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#CBD5E1")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")}
        >
          <Filter size={13} />
          Filter
          <ChevronDown size={12} />
        </button>
      </div>

      {/* ── Campaign Table ───────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          className="overflow-x-auto"
          style={{ minWidth: "860px" }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#FAFBFC", borderBottom: "1px solid #E2E8F0" }}>
                {[
                  { label: "Nama Campaign", w: "260px" },
                  { label: "Channel" },
                  { label: "Status" },
                  { label: "Leads" },
                  { label: "Terkirim" },
                  { label: "Dibuka" },
                  { label: "Dibalas" },
                  { label: "Mulai" },
                  { label: "" },
                ].map((col, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      color: "#64748B",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.3px",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      width: col.w,
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="flex flex-col items-center justify-center py-16">
                      <div
                        className="w-12 h-12 flex items-center justify-center mb-3"
                        style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                      >
                        <Target size={20} style={{ color: "#CBD5E1" }} />
                      </div>
                      <p style={{ color: "#0F1F3D", fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
                        Tidak ada campaign ditemukan
                      </p>
                      <p style={{ color: "#94A3B8", fontSize: "12px" }}>
                        Coba ubah filter atau kata kunci pencarian
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((camp, idx) => {
                  const st   = statusConfig[camp.status];
                  const ch   = channelConfig[camp.channel];
                  const StIcon = st.icon;
                  const ChIcon = ch.icon;
                  const isLast = idx === filtered.length - 1;

                  return (
                    <tr
                      key={camp.id}
                      style={{ borderBottom: isLast ? "none" : "1px solid #F1F5F9" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FAFBFC")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      {/* Nama Campaign */}
                      <td style={{ padding: "14px 16px" }}>
                        <div>
                          <p style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600, marginBottom: "2px" }}>
                            {camp.name}
                          </p>
                          <p
                            style={{
                              color: "#94A3B8", fontSize: "11px", lineHeight: 1.4,
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {camp.description}
                          </p>
                        </div>
                      </td>

                      {/* Channel */}
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          className="inline-flex items-center gap-1.5 px-2 py-1"
                          style={{
                            background: ch.bg,
                            borderRadius: "6px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <ChIcon size={12} style={{ color: ch.color }} />
                          <span style={{ color: ch.color, fontSize: "11px", fontWeight: 600 }}>
                            {ch.label}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          className="inline-flex items-center gap-1.5 px-2 py-1"
                          style={{
                            background: st.bg,
                            border: `1px solid ${st.border}`,
                            borderRadius: "6px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <StIcon size={11} style={{ color: st.color }} />
                          <span style={{ color: st.color, fontSize: "11px", fontWeight: 600 }}>
                            {st.label}
                          </span>
                        </div>
                      </td>

                      {/* Leads */}
                      <td style={{ padding: "14px 16px" }}>
                        <div className="flex items-center gap-1.5">
                          <Users size={12} style={{ color: "#94A3B8" }} />
                          <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>
                            {camp.leadsTargeted.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </td>

                      {/* Terkirim */}
                      <td style={{ padding: "14px 16px" }}>
                        <div className="flex items-center gap-1.5">
                          <Send size={12} style={{ color: "#94A3B8" }} />
                          <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 500 }}>
                            {camp.sent.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </td>

                      {/* Dibuka (open rate bar) */}
                      <td style={{ padding: "14px 16px" }}>
                        <div className="flex flex-col gap-1">
                          <OpenRateBar value={camp.opened} total={camp.sent} />
                          <span style={{ color: "#94A3B8", fontSize: "10px" }}>
                            {camp.opened} dibuka
                          </span>
                        </div>
                      </td>

                      {/* Dibalas */}
                      <td style={{ padding: "14px 16px" }}>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare size={12} style={{ color: "#94A3B8" }} />
                          <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>
                            {camp.replied}
                          </span>
                          {camp.sent > 0 && (
                            <span style={{ color: "#94A3B8", fontSize: "11px" }}>
                              ({Math.round((camp.replied / Math.max(camp.sent, 1)) * 100)}%)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Mulai */}
                      <td style={{ padding: "14px 16px" }}>
                        <div className="flex flex-col">
                          <span style={{ color: "#0F1F3D", fontSize: "12px", fontWeight: 500, whiteSpace: "nowrap" }}>
                            {camp.startDate}
                          </span>
                          {camp.endDate && (
                            <span style={{ color: "#94A3B8", fontSize: "10px" }}>
                              s/d {camp.endDate}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          className="flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* View button */}
                          <button
                            className="w-7 h-7 flex items-center justify-center transition-all"
                            style={{
                              background: "#F8FAFC",
                              border: "1px solid #E2E8F0",
                              borderRadius: "6px",
                            }}
                            title="Lihat detail"
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#C7D2FE")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")}
                          >
                            <Eye size={12} style={{ color: "#64748B" }} />
                          </button>

                          {/* Analytics button */}
                          <button
                            className="w-7 h-7 flex items-center justify-center transition-all"
                            style={{
                              background: "#F8FAFC",
                              border: "1px solid #E2E8F0",
                              borderRadius: "6px",
                            }}
                            title="Analitik"
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#C7D2FE")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")}
                          >
                            <BarChart3 size={12} style={{ color: "#64748B" }} />
                          </button>

                          {/* More button */}
                          <div className="relative">
                            <button
                              className="w-7 h-7 flex items-center justify-center transition-all"
                              style={{
                                background: openMenu === camp.id ? "#F1F5F9" : "#F8FAFC",
                                border: "1px solid #E2E8F0",
                                borderRadius: "6px",
                              }}
                              onClick={() => setOpenMenu(openMenu === camp.id ? null : camp.id)}
                              title="Opsi lainnya"
                            >
                              <MoreHorizontal size={12} style={{ color: "#64748B" }} />
                            </button>

                            {openMenu === camp.id && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "calc(100% + 4px)",
                                  right: 0,
                                  background: "#FFFFFF",
                                  border: "1px solid #E2E8F0",
                                  borderRadius: "8px",
                                  zIndex: 50,
                                  minWidth: "148px",
                                  padding: "4px",
                                }}
                              >
                                {[
                                  { label: "Edit Campaign", icon: FileText },
                                  { label: camp.status === "active" ? "Jeda Campaign" : "Aktifkan", icon: camp.status === "active" ? Pause : Play },
                                  { label: "Duplikat", icon: Clock },
                                ].map((opt) => (
                                  <button
                                    key={opt.label}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 transition-all"
                                    style={{
                                      borderRadius: "6px",
                                      fontSize: "12px",
                                      color: "#374151",
                                      textAlign: "left",
                                    }}
                                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")}
                                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                                  >
                                    <opt.icon size={13} style={{ color: "#94A3B8" }} />
                                    {opt.label}
                                  </button>
                                ))}
                                <div style={{ height: "1px", background: "#F1F5F9", margin: "4px 0" }} />
                                <button
                                  className="w-full flex items-center gap-2.5 px-3 py-2 transition-all"
                                  style={{ borderRadius: "6px", fontSize: "12px", color: "#DC2626", textAlign: "left" }}
                                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FEF2F2")}
                                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                                >
                                  <Target size={13} style={{ color: "#DC2626" }} />
                                  Hapus Campaign
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderTop: "1px solid #F1F5F9" }}
        >
          <p style={{ color: "#94A3B8", fontSize: "12px" }}>
            Menampilkan <span style={{ color: "#0F1F3D", fontWeight: 600 }}>{filtered.length}</span> dari{" "}
            <span style={{ color: "#0F1F3D", fontWeight: 600 }}>{campaigns.length}</span> campaign
          </p>
          <button
            className="flex items-center gap-2 px-3 py-1.5 transition-all"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "6px",
              color: "#64748B",
              fontSize: "12px",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#CBD5E1")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")}
          >
            Lihat semua
            <ChevronDown size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

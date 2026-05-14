import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  LayoutGrid,
  List,
  Flame,
  Thermometer,
  Snowflake,
  MapPin,
  Tag,
  Star,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MessageCircle,
  Plus,
  Zap,
  Bookmark,
  BookmarkCheck,
  X,
  SlidersHorizontal,
  TrendingUp,
  Database,
  ArrowRight,
  Clock,
} from "lucide-react";
import { LeadAIDetailSheet, type Lead as AILead } from "../LeadAIDetailSheet";
import { AddToCampaignModal } from "../AddToCampaignModal";
import { DatabaseLeadsSkeleton } from "../Skeletons";
import { supabase } from "../../../lib/supabase";

// ─── Helper: Generate initials ───────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

// ─── Helper: Generate color based on badge ───────────────────────────────────
function getBadgeColors(badge: string) {
  if (badge === 'hot' || badge === 'priority') return { color: '#DC2626', colorBg: '#FEF2F2' };
  if (badge === 'warm') return { color: '#EA580C', colorBg: '#FFF7ED' };
  return { color: '#64748B', colorBg: '#F1F5F9' };
}

// ─── Helper: Format potential ─────────────────────────────────────────────────
function formatPotential(score: number) {
  const val = Math.floor(score * 100000);
  return `Rp ${(val / 1000000).toFixed(1)}jt`;
}

// ─── Type for Supabase lead ───────────────────────────────────────────────────
interface SupabaseLead {
  place_id: string;
  name: string;
  city: string;
  niche: string;
  rating: number;
  review_count: number;
  lead_score: number;
  badge: string;
  primary_pain_category: string;
  has_website: boolean;
  draft_message: string;
  insight_card: any;
}

// ─── Transform Supabase data to app format ───────────────────────────────────
function transformLead(lead: SupabaseLead, index: number) {
  const colors = getBadgeColors(lead.badge);
  return {
    id: index + 1,
    name: lead.name || 'Unknown Business',
    location: lead.city || 'Unknown',
    category: lead.niche || 'Umum',
    rating: lead.rating || 0,
    reviews: lead.review_count || 0,
    painScore: lead.lead_score || 0,
    badge: (lead.badge === "priority" || lead.badge === "digital_opportunity") ? "hot" : (lead.badge === "hot" || lead.badge === "warm" || lead.badge === "cold") ? lead.badge : "cold",
    painPoints: [
      lead.primary_pain_category || 'Belum ada data pain points',
      !lead.has_website ? 'Tidak memiliki website' : 'Website tersedia',
    ],
    potential: formatPotential(lead.lead_score || 0),
    potentialNum: Math.floor((lead.lead_score || 0) * 100000),
    lastUpdated: '1 hari lalu',
    saved: false,
    initials: getInitials(lead.name || 'XX'),
    color: colors.color,
    colorBg: colors.colorBg,
  };
}

// ─── Config ───────────────────────────────────────────────────────────────────
const badgeConfig = {
  hot: { label: "Hot", bg: "#FEF2F2", color: "#DC2626", border: "#FECACA", icon: Flame },
  warm: { label: "Warm", bg: "#FFFBEB", color: "#D97706", border: "#FDE68A", icon: Thermometer },
  cold: { label: "Cold", bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE", icon: Snowflake },
};

const scoreColor = (s: number) => (s >= 75 ? "#DC2626" : s >= 50 ? "#D97706" : "#2563EB");

// ─── SortIcon — hoisted to module level to keep stable identity across renders ─
function SortIcon({
  col,
  sortKey,
  sortDir,
}: {
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
}) {
  return (
    <span className="ml-1 inline-flex flex-col" style={{ gap: "1px" }}>
      <ChevronUp size={9} style={{ color: sortKey === col && sortDir === "asc" ? "#4F46E5" : "#CBD5E1" }} />
      <ChevronDown size={9} style={{ color: sortKey === col && sortDir === "desc" ? "#4F46E5" : "#CBD5E1" }} />
    </span>
  );
}

const filterChips = [
  { label: "Lokasi", icon: MapPin, key: "lokasi" },
  { label: "Kategori", icon: Tag, key: "kategori" },
  { label: "Pain Score", icon: TrendingUp, key: "pain" },
  { label: "Last Updated", icon: Clock, key: "updated" },
];

const TABLE_COLS = [
  "Nama Bisnis", "Lokasi", "Kategori", "Rating",
  "Pain Score", "Status", "Est. Potensi", "Last Updated", "Aksi",
];

type SortKey = "name" | "painScore" | "rating" | "potentialNum";
type SortDir = "asc" | "desc";

// ─── Component ────────────────────────────────────────────────────────────────
export function DatabaseLeadsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"card" | "table">("card");
  const [search, setSearch] = useState("");
  const [badgeFilter, setBadgeFilter] = useState<"all" | "hot" | "warm" | "cold">("all");
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("painScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [selectedLead, setSelectedLead] = useState<AILead | null>(null);
  const [campaignLead, setCampaignLead] = useState<AILead | null>(null);

  const toggleSave = (id: number) =>
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleChip = (key: string) =>
    setActiveChips((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const filtered = useMemo(() => {
    let data = [...allLeads];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (l) => l.name.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)
      );
    }
    if (badgeFilter !== "all") data = data.filter((l) => l.badge === badgeFilter);
    data.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === "string" && typeof vb === "string")
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return data;
  }, [allLeads, search, badgeFilter, sortKey, sortDir]);

  const counts = {
    all: allLeads.length,
    hot: allLeads.filter((l) => l.badge === "hot").length,
    warm: allLeads.filter((l) => l.badge === "warm").length,
    cold: allLeads.filter((l) => l.badge === "cold").length,
  };

  useEffect(() => {
    // Fetch leads from Supabase
    const fetchLeads = async () => {
      try {
        const { data, error } = await supabase
          .from('google_place_leads')
          .select(
            'place_id, name, city, niche, rating, review_count, lead_score, badge, primary_pain_category, has_website, draft_message, insight_card'
          )
          .order('lead_score', { ascending: false });

        if (error) {
          console.error('Error fetching leads:', error);
          setAllLeads([]);
        } else {
          const transformed = (data || []).map((lead: SupabaseLead, idx: number) =>
            transformLead(lead, idx)
          );
          setAllLeads(transformed);
        }
      } catch (err) {
        console.error('Unexpected error fetching leads:', err);
        setAllLeads([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (isLoading) return <DatabaseLeadsSkeleton />;

  return (
    <div
      className="min-h-screen p-5 md:p-6 lg:p-8"
      style={{ background: "#F8FAFC", color: "#0F1F3D" }}
      onClick={() => setOpenMenu(null)}
    >

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
        <div>
          <h1 style={{ color: "#0F1F3D", fontSize: "22px", fontWeight: 700, marginBottom: "5px" }}>
            Database Leads Saya
          </h1>
          <p style={{ color: "#64748B", fontSize: "14px" }}>
            Kelola dan analisis semua leads Anda di satu tempat
          </p>
        </div>

        {/* Search bar */}
        <div
          className="flex items-center gap-2.5 px-3.5 py-2.5"
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #E2E8F0",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "300px",
            flexShrink: 0,
          }}
        >
          <Search size={15} style={{ color: "#94A3B8", flexShrink: 0 }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama bisnis atau lokasi..."
            className="flex-1 outline-none bg-transparent"
            style={{ color: "#0F1F3D", fontSize: "13px", border: "none", padding: 0 }}
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={13} style={{ color: "#94A3B8" }} />
            </button>
          )}
        </div>
      </div>

      {/* ── Stats Strip ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Leads", value: allLeads.length, icon: Database, accent: "#4F46E5", bg: "#EEF2FF" },
          { label: "Hot Leads", value: counts.hot, icon: Flame, accent: "#DC2626", bg: "#FEF2F2" },
          { label: "Warm Leads", value: counts.warm, icon: Thermometer, accent: "#D97706", bg: "#FFFBEB" },
          { label: "Cold Leads", value: counts.cold, icon: Snowflake, accent: "#2563EB", bg: "#EFF6FF" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 px-4 py-3.5"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}
          >
            <div
              className="w-9 h-9 flex items-center justify-center flex-shrink-0"
              style={{ background: s.bg, borderRadius: "8px" }}
            >
              <s.icon size={16} style={{ color: s.accent }} />
            </div>
            <div>
              <p style={{ color: "#0F1F3D", fontSize: "20px", fontWeight: 700, lineHeight: 1 }}>
                {s.value}
              </p>
              <p style={{ color: "#94A3B8", fontSize: "11px", marginTop: "3px" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-5">
        {/* Left: badge filter tabs + filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Badge tabs */}
          <div
            className="flex items-center p-0.5"
            style={{ background: "#F1F5F9", borderRadius: "8px" }}
          >
            {(["all", "hot", "warm", "cold"] as const).map((tab) => {
              const active = badgeFilter === tab;
              const cfg = tab !== "all" ? badgeConfig[tab] : null;
              return (
                <button
                  key={tab}
                  onClick={() => setBadgeFilter(tab)}
                  className="flex items-center gap-1.5 px-3 py-1.5 transition-all"
                  style={{
                    background: active ? "#FFFFFF" : "transparent",
                    border: active ? "1px solid #E2E8F0" : "1px solid transparent",
                    borderRadius: "6px",
                    color: active ? (cfg ? cfg.color : "#0F1F3D") : "#64748B",
                    fontSize: "12px",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {cfg && <cfg.icon size={11} style={{ color: cfg.color }} />}
                  {tab === "all" ? "Semua" : cfg!.label}
                  <span
                    style={{
                      background: active ? (cfg ? cfg.bg : "#EEF2FF") : "#E2E8F0",
                      color: active ? (cfg ? cfg.color : "#4F46E5") : "#64748B",
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "1px 5px",
                      borderRadius: "4px",
                    }}
                  >
                    {counts[tab]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ width: "1px", height: "20px", background: "#E2E8F0" }} />

          {/* Filter chips */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={13} style={{ color: "#94A3B8" }} />
            {filterChips.map((chip) => {
              const active = activeChips.includes(chip.key);
              return (
                <button
                  key={chip.key}
                  onClick={() => toggleChip(chip.key)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 transition-all"
                  style={{
                    background: active ? "#EEF2FF" : "#FFFFFF",
                    border: `1px solid ${active ? "#A5B4FC" : "#E2E8F0"}`,
                    borderRadius: "6px",
                    color: active ? "#4F46E5" : "#64748B",
                    fontSize: "12px",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <chip.icon size={11} />
                  {chip.label}
                  <ChevronDown size={10} style={{ opacity: 0.5 }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: sort + view toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Sort */}
          <button
            onClick={() => handleSort("painScore")}
            className="flex items-center gap-1.5 px-3 py-1.5 transition-all"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "6px",
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            <TrendingUp size={11} />
            Pain Score
            <SortIcon col="painScore" sortKey={sortKey} sortDir={sortDir} />
          </button>

          {/* View toggle */}
          <div
            className="flex items-center p-0.5"
            style={{ background: "#F1F5F9", borderRadius: "8px" }}
          >
            {(["card", "table"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="flex items-center gap-1.5 px-3 py-1.5 transition-all"
                style={{
                  background: view === v ? "#FFFFFF" : "transparent",
                  border: view === v ? "1px solid #E2E8F0" : "1px solid transparent",
                  borderRadius: "6px",
                  color: view === v ? "#0F1F3D" : "#64748B",
                  fontSize: "12px",
                  fontWeight: view === v ? 600 : 400,
                }}
              >
                {v === "card" ? <LayoutGrid size={13} /> : <List size={13} />}
                {v === "card" ? "Card" : "Table"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results count ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4">
        <p style={{ color: "#94A3B8", fontSize: "12px" }}>
          Menampilkan{" "}
          <span style={{ color: "#0F1F3D", fontWeight: 600 }}>{filtered.length}</span> dari{" "}
          <span style={{ color: "#0F1F3D", fontWeight: 600 }}>{allLeads.length}</span> leads
        </p>
        {(badgeFilter !== "all" || search || activeChips.length > 0) && (
          <button
            onClick={() => { setBadgeFilter("all"); setSearch(""); setActiveChips([]); }}
            className="flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: "#4F46E5", fontSize: "12px", fontWeight: 500 }}
          >
            <X size={11} />
            Reset filter
          </button>
        )}
      </div>

      {/* ── Empty State ────────────────────────────────────────────────── */}
      {allLeads.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-24"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}
        >
          <div
            className="w-14 h-14 flex items-center justify-center mb-4"
            style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "12px" }}
          >
            <Database size={22} style={{ color: "#94A3B8" }} />
          </div>
          <p style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>
            Belum ada leads
          </p>
          <p style={{ color: "#94A3B8", fontSize: "13px", textAlign: "center", maxWidth: "320px" }}>
            Database Anda masih kosong. Mulai cari leads baru menggunakan AI Search untuk mengisi database.
          </p>
          <button
            onClick={() => navigate("/new-search")}
            className="flex items-center gap-2 mt-6 px-4 py-2.5 transition-all hover:opacity-80"
            style={{ background: "#0F1F3D", color: "#FFFFFF", borderRadius: "8px", fontSize: "13px", fontWeight: 600 }}
          >
            <Sparkles size={13} />
            Cari Leads Baru
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* ── Filtered Empty State ───────────────────────────────────────── */}
      {allLeads.length > 0 && filtered.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-24"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}
        >
          <div
            className="w-14 h-14 flex items-center justify-center mb-4"
            style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "12px" }}
          >
            <Database size={22} style={{ color: "#94A3B8" }} />
          </div>
          <p style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>
            Tidak ada leads ditemukan
          </p>
          <p style={{ color: "#94A3B8", fontSize: "13px", textAlign: "center", maxWidth: "320px" }}>
            Coba ubah filter atau mulai cari leads baru menggunakan AI Search.
          </p>
          <button
            onClick={() => navigate("/new-search")}
            className="flex items-center gap-2 mt-6 px-4 py-2.5 transition-all hover:opacity-80"
            style={{ background: "#0F1F3D", color: "#FFFFFF", borderRadius: "8px", fontSize: "13px", fontWeight: 600 }}
          >
            <Sparkles size={13} />
            Cari Leads Baru
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          CARD VIEW
      ════════════════════════════════════════════════════════════════ */}
      {filtered.length > 0 && view === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((lead) => {
            const badge = badgeConfig[lead.badge as keyof typeof badgeConfig];
            const BadgeIcon = badge.icon;
            const isSaved = savedIds.includes(lead.id);

            return (
              <div
                key={lead.id}
                className="flex flex-col transition-all"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "#C7D2FE")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")
                }
              >
                {/* Card Top accent strip */}
                <div style={{ height: "3px", background: badge.color, opacity: 0.6 }} />

                <div className="p-5 flex flex-col gap-3.5 flex-1">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                        style={{ background: lead.colorBg, borderRadius: "8px" }}
                      >
                        <span style={{ color: lead.color, fontSize: "13px", fontWeight: 700 }}>
                          {lead.initials}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p
                          style={{
                            color: "#0F1F3D", fontSize: "13px", fontWeight: 600,
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          }}
                        >
                          {lead.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin size={10} style={{ color: "#94A3B8" }} />
                          <span style={{ color: "#94A3B8", fontSize: "11px" }}>{lead.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Badge */}
                    <div
                      className="flex items-center gap-1 px-2 py-1 flex-shrink-0"
                      style={{
                        background: badge.bg, border: `1px solid ${badge.border}`, borderRadius: "6px",
                      }}
                    >
                      <BadgeIcon size={11} style={{ color: badge.color }} />
                      <span style={{ color: badge.color, fontSize: "11px", fontWeight: 600 }}>
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* Category + Rating row */}
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        background: "#F8FAFC", border: "1px solid #E2E8F0",
                        color: "#64748B", fontSize: "11px", padding: "2px 8px", borderRadius: "4px",
                      }}
                    >
                      {lead.category}
                    </span>
                    <div className="flex items-center gap-1 ml-auto">
                      <Star size={11} style={{ color: "#F59E0B" }} />
                      <span style={{ color: "#0F1F3D", fontSize: "12px", fontWeight: 600 }}>
                        {lead.rating}
                      </span>
                      <span style={{ color: "#94A3B8", fontSize: "11px" }}>({lead.reviews})</span>
                    </div>
                  </div>

                  {/* Pain Score */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 500 }}>
                        Pain Score
                      </span>
                      <span style={{ color: scoreColor(lead.painScore), fontSize: "14px", fontWeight: 700 }}>
                        {lead.painScore}
                        <span style={{ color: "#94A3B8", fontSize: "10px", fontWeight: 400 }}>/100</span>
                      </span>
                    </div>
                    <div style={{ background: "#F1F5F9", borderRadius: "4px", height: "5px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${lead.painScore}%`, height: "100%",
                          background: scoreColor(lead.painScore), borderRadius: "4px",
                        }}
                      />
                    </div>
                  </div>

                  {/* Pain Points */}
                  <div className="space-y-1.5">
                    {lead.painPoints.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div
                          className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: badge.color }}
                        />
                        <p style={{ color: "#64748B", fontSize: "11px", lineHeight: 1.5 }}>{pt}</p>
                      </div>
                    ))}
                  </div>

                  {/* Potential */}
                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: "1px solid #F1F5F9" }}
                  >
                    <div>
                      <p style={{ color: "#94A3B8", fontSize: "10px" }}>Est. Potensi</p>
                      <p style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 700, lineHeight: 1.2 }}>
                        {lead.potential}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={10} style={{ color: "#94A3B8" }} />
                      <span style={{ color: "#94A3B8", fontSize: "11px" }}>{lead.lastUpdated}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-auto">
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 transition-all"
                      style={{
                        background: "#0F1F3D", color: "#FFFFFF",
                        borderRadius: "6px", fontSize: "11px", fontWeight: 600,
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = "#1E3A5F")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = "#0F1F3D")
                      }
                      onClick={() => setSelectedLead(lead as AILead)}
                    >
                      <Sparkles size={11} />
                      AI Detail
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 transition-all"
                      style={{
                        background: "#EEF2FF", color: "#4F46E5",
                        border: "1px solid #C7D2FE", borderRadius: "6px",
                        fontSize: "11px", fontWeight: 600,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#4F46E5";
                        (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                        (e.currentTarget as HTMLElement).style.borderColor = "#4F46E5";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#EEF2FF";
                        (e.currentTarget as HTMLElement).style.color = "#4F46E5";
                        (e.currentTarget as HTMLElement).style.borderColor = "#C7D2FE";
                      }}
                      onClick={() => setCampaignLead(lead as AILead)}
                    >
                      <Zap size={11} />
                      Campaign
                    </button>
                    <button
                      title="Kirim WA"
                      className="flex items-center justify-center p-2 transition-all"
                      style={{
                        background: "#F0FDF4",
                        border: "1px solid #BBF7D0",
                        borderRadius: "6px",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = "#DCFCE7")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = "#F0FDF4")
                      }
                    >
                      <MessageCircle size={13} style={{ color: "#16A34A" }} />
                    </button>
                    <button
                      className="flex items-center justify-center p-2 transition-all"
                      style={{
                        background: isSaved ? "#EEF2FF" : "#F8FAFC",
                        border: `1px solid ${isSaved ? "#A5B4FC" : "#E2E8F0"}`,
                        borderRadius: "6px",
                      }}
                      onClick={() => toggleSave(lead.id)}
                    >
                      {isSaved
                        ? <BookmarkCheck size={13} style={{ color: "#4F46E5" }} />
                        : <Bookmark size={13} style={{ color: "#64748B" }} />
                      }
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          TABLE VIEW
      ════════════════════════════════════════════════════════════════ */}
      {filtered.length > 0 && view === "table" && (
        <div className="overflow-x-auto" style={{ borderRadius: "8px" }}>
          <div
            style={{
              background: "#FFFFFF", border: "1px solid #E2E8F0",
              borderRadius: "8px", overflow: "hidden",
              minWidth: "900px",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              {/* Head */}
              <thead>
                <tr style={{ borderBottom: "1px solid #E2E8F0", background: "#FAFBFC" }}>
                  {TABLE_COLS.map((col) => {
                    const sortMap: Record<string, SortKey> = {
                      "Nama Bisnis": "name",
                      "Pain Score": "painScore",
                      "Rating": "rating",
                      "Est. Potensi": "potentialNum",
                    };
                    const sk = sortMap[col];
                    return (
                      <th
                        key={col}
                        onClick={() => sk && handleSort(sk)}
                        className={sk ? "cursor-pointer select-none" : ""}
                        style={{
                          padding: "11px 14px", textAlign: "left",
                          color: "#64748B", fontSize: "11px", fontWeight: 600,
                          letterSpacing: "0.3px", textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span className="flex items-center gap-0.5">
                          {col}
                          {sk && <SortIcon col={sk} sortKey={sortKey} sortDir={sortDir} />}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {filtered.map((lead, idx) => {
                  const badge = badgeConfig[lead.badge as keyof typeof badgeConfig];
                  const BadgeIcon = badge.icon;
                  const isSaved = savedIds.includes(lead.id);
                  const isLast = idx === filtered.length - 1;

                  return (
                    <tr
                      key={lead.id}
                      style={{ borderBottom: isLast ? "none" : "1px solid #F1F5F9" }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = "#FAFBFC")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = "transparent")
                      }
                    >
                      {/* Nama Bisnis */}
                      <td style={{ padding: "12px 14px" }}>
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                            style={{ background: lead.colorBg, borderRadius: "6px" }}
                          >
                            <span style={{ color: lead.color, fontSize: "11px", fontWeight: 700 }}>
                              {lead.initials}
                            </span>
                          </div>
                          <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 500 }}>
                            {lead.name}
                          </span>
                        </div>
                      </td>

                      {/* Lokasi */}
                      <td style={{ padding: "12px 14px" }}>
                        <div className="flex items-center gap-1">
                          <MapPin size={11} style={{ color: "#94A3B8" }} />
                          <span style={{ color: "#64748B", fontSize: "12px" }}>{lead.location}</span>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            background: "#F8FAFC", border: "1px solid #E2E8F0",
                            color: "#64748B", fontSize: "11px", padding: "2px 8px", borderRadius: "4px",
                          }}
                        >
                          {lead.category}
                        </span>
                      </td>

                      {/* Rating */}
                      <td style={{ padding: "12px 14px" }}>
                        <div className="flex items-center gap-1">
                          <Star size={11} style={{ color: "#F59E0B" }} />
                          <span style={{ color: "#0F1F3D", fontSize: "12px", fontWeight: 600 }}>
                            {lead.rating}
                          </span>
                          <span style={{ color: "#94A3B8", fontSize: "11px" }}>({lead.reviews})</span>
                        </div>
                      </td>

                      {/* Pain Score */}
                      <td style={{ padding: "12px 14px" }}>
                        <div className="flex items-center gap-2">
                          <div style={{ width: "60px", background: "#F1F5F9", borderRadius: "3px", height: "4px" }}>
                            <div
                              style={{
                                width: `${lead.painScore}%`, height: "100%",
                                background: scoreColor(lead.painScore), borderRadius: "3px",
                              }}
                            />
                          </div>
                          <span style={{ color: scoreColor(lead.painScore), fontSize: "12px", fontWeight: 700 }}>
                            {lead.painScore}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "12px 14px" }}>
                        <div
                          className="inline-flex items-center gap-1 px-2 py-1"
                          style={{
                            background: badge.bg, border: `1px solid ${badge.border}`, borderRadius: "6px",
                          }}
                        >
                          <BadgeIcon size={11} style={{ color: badge.color }} />
                          <span style={{ color: badge.color, fontSize: "11px", fontWeight: 600 }}>
                            {badge.label}
                          </span>
                        </div>
                      </td>

                      {/* Potensi */}
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>
                          {lead.potential}
                        </span>
                      </td>

                      {/* Last Updated */}
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ color: "#94A3B8", fontSize: "12px" }}>{lead.lastUpdated}</span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "12px 14px" }}>
                        <div
                          className="flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            title="Lihat AI Detail"
                            className="w-7 h-7 flex items-center justify-center transition-all"
                            style={{
                              background: "#EEF2FF", border: "1px solid #C7D2FE",
                              borderRadius: "6px",
                            }}
                            onMouseEnter={(e) =>
                              ((e.currentTarget as HTMLElement).style.background = "#4F46E5")
                            }
                            onMouseLeave={(e) =>
                              ((e.currentTarget as HTMLElement).style.background = "#EEF2FF")
                            }
                            onClick={() => setSelectedLead(lead as AILead)}
                          >
                            <Sparkles size={12} style={{ color: "#4F46E5" }} />
                          </button>
                          <button
                            title="Tambah ke Campaign"
                            className="w-7 h-7 flex items-center justify-center transition-all"
                            style={{
                              background: "#EEF2FF", border: "1px solid #C7D2FE",
                              borderRadius: "6px",
                            }}
                            onMouseEnter={(e) =>
                              ((e.currentTarget as HTMLElement).style.background = "#4F46E5")
                            }
                            onMouseLeave={(e) =>
                              ((e.currentTarget as HTMLElement).style.background = "#EEF2FF")
                            }
                            onClick={() => setCampaignLead(lead as AILead)}
                          >
                            <Zap size={12} style={{ color: "#4F46E5" }} />
                          </button>
                          <button
                            title="Kirim WA"
                            className="w-7 h-7 flex items-center justify-center transition-all"
                            style={{
                              background: "#F0FDF4", border: "1px solid #BBF7D0",
                              borderRadius: "6px",
                            }}
                            onMouseEnter={(e) =>
                              ((e.currentTarget as HTMLElement).style.background = "#25D366")
                            }
                            onMouseLeave={(e) =>
                              ((e.currentTarget as HTMLElement).style.background = "#F0FDF4")
                            }
                          >
                            <MessageCircle size={12} style={{ color: "#16A34A" }} />
                          </button>
                          <button
                            title={isSaved ? "Tersimpan" : "Simpan"}
                            onClick={() => toggleSave(lead.id)}
                            className="w-7 h-7 flex items-center justify-center transition-all"
                            style={{
                              background: isSaved ? "#EEF2FF" : "#F8FAFC",
                              border: `1px solid ${isSaved ? "#A5B4FC" : "#E2E8F0"}`,
                              borderRadius: "6px",
                            }}
                          >
                            {isSaved
                              ? <BookmarkCheck size={12} style={{ color: "#4F46E5" }} />
                              : <Bookmark size={12} style={{ color: "#94A3B8" }} />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p style={{ color: "#94A3B8", fontSize: "12px" }}>
            {filtered.length} leads ditampilkan
          </p>
          <button
            onClick={() => navigate("/new-search")}
            className="flex items-center gap-2 px-4 py-2.5 transition-all"
            style={{
              background: "#FFFFFF", border: "1px solid #E2E8F0",
              color: "#0F1F3D", borderRadius: "8px", fontSize: "13px", fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#0F1F3D";
              (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
              (e.currentTarget as HTMLElement).style.borderColor = "#0F1F3D";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#FFFFFF";
              (e.currentTarget as HTMLElement).style.color = "#0F1F3D";
              (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0";
            }}
          >
            <Plus size={14} />
            Tambah Leads Baru
          </button>
        </div>
      )}

      {/* ── AI Detail Sheet ── */}
      <LeadAIDetailSheet
        lead={selectedLead}
        open={selectedLead !== null}
        onClose={() => setSelectedLead(null)}
      />
      <AddToCampaignModal
        open={campaignLead !== null}
        onClose={() => setCampaignLead(null)}
        leadName={campaignLead?.name}
      />
    </div>
  );
}
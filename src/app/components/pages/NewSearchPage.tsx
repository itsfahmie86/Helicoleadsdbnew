import { useState, useMemo } from "react";
import {
  Search,
  Sparkles,
  MapPin,
  Tag,
  Star,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  Flame,
  Thermometer,
  Snowflake,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowRight,
  Loader2,
  LayoutGrid,
  List,
  TrendingUp,
  ArrowUpDown,
  Zap,
  Clock,
} from "lucide-react";
import { LeadAIDetailSheet, type Lead as AILead } from "../LeadAIDetailSheet";
import { SearchResultsSkeleton } from "../Skeletons";

// ─── Constants ────────────────────────────────────────────────────────────────
const exampleSearches = [
  "Restoran di Depok yang komplain pelayanan lambat",
  "Laundry di Jakarta Selatan rating < 4.0",
  "Salon kecantikan Tangerang ulasan negatif",
  "Bengkel motor Bekasi belum ada website",
  "Kafe Bandung yang sering dikeluhkan pelanggan",
];

const filterChips = [
  { label: "Lokasi", icon: MapPin, key: "lokasi" },
  { label: "Kategori", icon: Tag, key: "kategori" },
  { label: "Rating", icon: Star, key: "rating" },
  { label: "Sentimen", icon: MessageSquare, key: "sentimen" },
];

// ─── Search Results Dummy Data ────────────────────────────────────────────────
const SEARCH_RESULTS = [
  {
    id: 1,
    name: "Warung Nasi Bu Imas",
    location: "Depok, Jawa Barat",
    category: "F&B",
    rating: 3.2,
    reviews: 412,
    painScore: 87,
    badge: "hot",
    painNote: "Pelayanan lambat & antrian panjang tanpa sistem",
    potential: "Rp 14.200.000",
    potentialNum: 14200000,
    initials: "WN",
    color: "#DC2626",
    colorBg: "#FEF2F2",
  },
  {
    id: 2,
    name: "Laundry Cepat Express",
    location: "Jakarta Selatan",
    category: "Laundry",
    rating: 3.3,
    reviews: 287,
    painScore: 72,
    badge: "hot",
    painNote: "Rating turun akibat pelayanan lambat & pakaian tertukar",
    potential: "Rp 8.750.000",
    potentialNum: 8750000,
    initials: "LC",
    color: "#EA580C",
    colorBg: "#FFF7ED",
  },
  {
    id: 11,
    name: "Klinik Estetika Aurora",
    location: "Bandung",
    category: "Kesehatan",
    rating: 3.7,
    reviews: 198,
    painScore: 64,
    badge: "warm",
    painNote: "Belum punya website & tidak ada sistem booking online",
    potential: "Rp 12.500.000",
    potentialNum: 12500000,
    initials: "KA",
    color: "#7C3AED",
    colorBg: "#F5F3FF",
  },
  {
    id: 14,
    name: "Apotek Maju Sejahtera",
    location: "Jakarta Timur",
    category: "Kesehatan",
    rating: 3.8,
    reviews: 203,
    painScore: 55,
    badge: "warm",
    painNote: "Stok obat sering kosong saat jam sibuk",
    potential: "Rp 7.800.000",
    potentialNum: 7800000,
    initials: "AM",
    color: "#0284C7",
    colorBg: "#E0F2FE",
  },
  {
    id: 12,
    name: "Bengkel Motor Pak Joni",
    location: "Bekasi, Jawa Barat",
    category: "Otomotif",
    rating: 3.9,
    reviews: 154,
    painScore: 41,
    badge: "warm",
    painNote: "Kompetitor baru buka 200m dari lokasi",
    potential: "Rp 5.200.000",
    potentialNum: 5200000,
    initials: "BP",
    color: "#0284C7",
    colorBg: "#E0F2FE",
  },
  {
    id: 13,
    name: "Toko Roti Sumber Rezeki",
    location: "Tangerang",
    category: "F&B",
    rating: 4.2,
    reviews: 321,
    painScore: 35,
    badge: "cold",
    painNote: "Konsisten rating 4.2 — peluang digitalisasi besar",
    potential: "Rp 3.800.000",
    potentialNum: 3800000,
    initials: "TR",
    color: "#059669",
    colorBg: "#ECFDF5",
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const badgeConfig = {
  hot:  { label: "Hot",  bg: "#FEF2F2", color: "#DC2626", border: "#FECACA", icon: Flame },
  warm: { label: "Warm", bg: "#FFFBEB", color: "#D97706", border: "#FDE68A", icon: Thermometer },
  cold: { label: "Cold", bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE", icon: Snowflake },
};

const scoreColor = (s: number) =>
  s >= 75 ? "#DC2626" : s >= 50 ? "#D97706" : "#2563EB";

type SortOption = "painScore" | "rating" | "potentialNum" | "name";
const sortLabels: Record<SortOption, string> = {
  painScore:    "Pain Score",
  rating:       "Rating",
  potentialNum: "Est. Potensi",
  name:         "Nama A–Z",
};

// ─── ColArrow — hoisted to module level to keep stable identity across renders ─
function ColArrow({
  col,
  sortBy,
  sortDir,
}: {
  col: SortOption;
  sortBy: SortOption;
  sortDir: "asc" | "desc";
}) {
  return (
    <span className="inline-flex flex-col ml-1" style={{ gap: "1px" }}>
      <ChevronUp  size={8} style={{ color: sortBy === col && sortDir === "asc"  ? "#4F46E5" : "#CBD5E1" }} />
      <ChevronDown size={8} style={{ color: sortBy === col && sortDir === "desc" ? "#4F46E5" : "#CBD5E1" }} />
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function NewSearchPage() {
  const [query, setQuery]           = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isSearching, setIsSearching]     = useState(false);
  const [hasSearched, setHasSearched]     = useState(false);
  const [savedLeads, setSavedLeads]       = useState<number[]>([]);
  const [viewMode, setViewMode]           = useState<"table" | "card">("table");
  const [sortBy, setSortBy]               = useState<SortOption>("painScore");
  const [sortDir, setSortDir]             = useState<"asc" | "desc">("desc");
  const [showSortMenu, setShowSortMenu]   = useState(false);
  const [selectedLead, setSelectedLead]   = useState<AILead | null>(null);
  const [searchedQuery, setSearchedQuery] = useState("");

  // Sort results
  const sortedResults = useMemo(() => {
    return [...SEARCH_RESULTS].sort((a, b) => {
      const va = a[sortBy as keyof typeof a];
      const vb = b[sortBy as keyof typeof b];
      if (typeof va === "string" && typeof vb === "string")
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc"
        ? (va as number) - (vb as number)
        : (vb as number) - (va as number);
    });
  }, [sortBy, sortDir]);

  const handleSearch = async (sq?: string) => {
    const q = sq ?? query;
    if (!q.trim()) return;
    if (sq) setQuery(sq);
    setSearchedQuery(sq ?? query);
    setIsSearching(true);
    setHasSearched(false);
    await new Promise((r) => setTimeout(r, 1600));
    setIsSearching(false);
    setHasSearched(true);
    setViewMode("table");
  };

  const toggleFilter = (key: string) =>
    setActiveFilters((p) => p.includes(key) ? p.filter((f) => f !== key) : [...p, key]);

  const toggleSave = (id: number) =>
    setSavedLeads((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);

  const handleSort = (key: SortOption) => {
    if (sortBy === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortBy(key); setSortDir("desc"); }
    setShowSortMenu(false);
  };

  return (
    <div
      className="p-5 md:p-6 lg:p-8"
      style={{ color: "#0F1F3D" }}
      onClick={() => setShowSortMenu(false)}
    >
      {/* ── Page Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 style={{ color: "#0F1F3D", fontSize: "22px", fontWeight: 700 }}>
            Pencarian Leads
          </h1>
          <span
            className="px-2 py-0.5"
            style={{ background: "#EEF2FF", color: "#4F46E5", fontSize: "11px", fontWeight: 700, borderRadius: "6px" }}
          >
            AI-Powered
          </span>
        </div>
        <p style={{ color: "#64748B", fontSize: "14px" }}>
          Gunakan bahasa natural untuk menemukan leads bisnis potensial secara instan.
        </p>
      </div>

      {/* ── Search Form ─────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #E2E8F0",
            borderRadius: "8px",
            overflow: "visible",
          }}
          onFocusCapture={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#A5B4FC")}
          onBlurCapture={(e)  => ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")}
        >
          {/* Input Row */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Search size={17} style={{ color: "#94A3B8", flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Cari lead, bisnis, atau analitik..."
              className="flex-1 outline-none bg-transparent"
              style={{ color: "#0F1F3D", fontSize: "15px", border: "none", padding: 0 }}
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setHasSearched(false); }}
                className="p-1.5 transition-colors flex-shrink-0"
                style={{ borderRadius: "6px" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F1F5F9")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <X size={13} style={{ color: "#94A3B8" }} />
              </button>
            )}
          </div>

          <div style={{ height: "1px", background: "#E2E8F0" }} />

          {/* Filters + CTA Row */}
          <div className="flex items-center justify-between px-3 py-2.5 gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-1.5 pr-3 mr-1" style={{ borderRight: "1px solid #E2E8F0" }}>
                <Filter size={12} style={{ color: "#94A3B8" }} />
                <span style={{ color: "#94A3B8", fontSize: "12px", whiteSpace: "nowrap" }}>Filter</span>
              </div>
              {filterChips.map((chip) => {
                const isActive = activeFilters.includes(chip.key);
                return (
                  <button
                    key={chip.key}
                    onClick={() => toggleFilter(chip.key)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 transition-all"
                    style={{
                      background: isActive ? "#EEF2FF" : "transparent",
                      border: `1px solid ${isActive ? "#A5B4FC" : "#E2E8F0"}`,
                      borderRadius: "6px",
                      color: isActive ? "#4F46E5" : "#64748B",
                      fontSize: "12px",
                      fontWeight: isActive ? 600 : 400,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = "#F8FAFC";
                        (e.currentTarget as HTMLElement).style.borderColor = "#CBD5E1";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0";
                      }
                    }}
                  >
                    <chip.icon size={12} />
                    {chip.label}
                    <ChevronDown size={10} style={{ opacity: 0.6 }} />
                  </button>
                );
              })}
              {activeFilters.length > 0 && (
                <button
                  onClick={() => setActiveFilters([])}
                  className="flex items-center gap-1 px-2 py-1.5 transition-all"
                  style={{ color: "#94A3B8", fontSize: "12px", borderRadius: "6px" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#EF4444")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94A3B8")}
                >
                  <X size={11} />
                  Reset
                </button>
              )}
            </div>

            <button
              onClick={() => handleSearch()}
              disabled={isSearching || !query.trim()}
              className="flex items-center gap-2 px-4 py-2 transition-all flex-shrink-0 disabled:opacity-40"
              style={{
                background: isSearching ? "#6B7280" : "#0F1F3D",
                color: "#FFFFFF",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: isSearching || !query.trim() ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isSearching && query.trim())
                  (e.currentTarget as HTMLElement).style.background = "#1E3A5F";
              }}
              onMouseLeave={(e) => {
                if (!isSearching)
                  (e.currentTarget as HTMLElement).style.background = "#0F1F3D";
              }}
            >
              {isSearching ? (
                <><Loader2 size={13} className="animate-spin" />Mencari...</>
              ) : (
                <><Sparkles size={13} />Cari dengan AI</>
              )}
            </button>
          </div>
        </div>

        {/* Example Pills */}
        <div className="flex items-start gap-2 mt-3 flex-wrap">
          <span style={{ color: "#94A3B8", fontSize: "12px", paddingTop: "3px", flexShrink: 0 }}>Coba:</span>
          {exampleSearches.map((ex) => (
            <button
              key={ex}
              onClick={() => handleSearch(ex)}
              className="flex items-center gap-1.5 px-2.5 py-1 transition-all"
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
                fontSize: "12px",
                color: "#64748B",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#A5B4FC";
                (e.currentTarget as HTMLElement).style.color = "#4F46E5";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0";
                (e.currentTarget as HTMLElement).style.color = "#64748B";
              }}
            >
              <Sparkles size={10} style={{ color: "#4F46E5", flexShrink: 0 }} />
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading State ── */}
      {isSearching && (
        <div className="overflow-x-auto">
          <SearchResultsSkeleton query={query} />
        </div>
      )}

      {/* ── Empty / Initial State ── */}
      {!isSearching && !hasSearched && (
        <div
          className="flex flex-col items-center justify-center py-24"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}
        >
          <div
            className="w-14 h-14 flex items-center justify-center mb-4"
            style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "12px" }}
          >
            <Search size={22} style={{ color: "#94A3B8" }} />
          </div>
          <p style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>
            Mulai pencarian leads Anda
          </p>
          <p style={{ color: "#64748B", fontSize: "13px", textAlign: "center", maxWidth: "360px" }}>
            Gunakan kotak pencarian di atas atau klik salah satu contoh untuk menemukan leads bisnis potensial.
          </p>
          <button
            onClick={() => handleSearch("Restoran di Depok yang komplain pelayanan lambat")}
            className="flex items-center gap-2 mt-6 px-4 py-2.5 transition-all"
            style={{ background: "#EEF2FF", color: "#4F46E5", borderRadius: "8px", fontSize: "13px", fontWeight: 500 }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#E0E7FF")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#EEF2FF")}
          >
            <Sparkles size={13} />
            Coba pencarian demo
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          RESULTS STATE
      ════════════════════════════════════════════════════════════════ */}
      {!isSearching && hasSearched && (
        <div>

          {/* ── AI Query Summary Card ── */}
          <div
            className="flex items-center gap-4 px-5 py-4 mb-5"
            style={{
              background: "#FAFBFF",
              border: "1px solid #C7D2FE",
              borderRadius: "8px",
            }}
          >
            <div
              className="w-9 h-9 flex items-center justify-center flex-shrink-0"
              style={{ background: "#EEF2FF", borderRadius: "8px" }}
            >
              <Zap size={16} style={{ color: "#4F46E5" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: "#4F46E5", fontSize: "11px", fontWeight: 700, letterSpacing: "0.4px", marginBottom: "3px" }}>
                QUERY DIANALISIS
              </p>
              <p
                style={{
                  color: "#0F1F3D", fontSize: "13px", fontWeight: 500,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}
              >
                "{searchedQuery || query}"
              </p>
            </div>
            <div className="flex items-center gap-5 flex-shrink-0">
              {[
                { label: "Ulasan dipindai", value: "1.240" },
                { label: "Bisnis dievaluasi", value: "89" },
                { label: "Waktu analisis", value: "1.6 dtk" },
              ].map((stat) => (
                <div key={stat.label} className="text-right">
                  <p style={{ color: "#0F1F3D", fontSize: "14px", fontWeight: 700, lineHeight: 1 }}>
                    {stat.value}
                  </p>
                  <p style={{ color: "#94A3B8", fontSize: "10px", marginTop: "2px" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Results Header ── */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 700, marginBottom: "3px" }}>
                Hasil Pencarian
              </h2>
              <p style={{ color: "#64748B", fontSize: "12px" }}>
                <span style={{ color: "#0F1F3D", fontWeight: 600 }}>{SEARCH_RESULTS.length} leads</span>
                {" "}ditemukan • Diurutkan berdasarkan{" "}
                <span style={{ color: "#4F46E5", fontWeight: 600 }}>{sortLabels[sortBy]}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowSortMenu((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 transition-all"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#0F1F3D",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#C7D2FE")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")}
                >
                  <ArrowUpDown size={12} style={{ color: "#64748B" }} />
                  Urutkan: <span style={{ fontWeight: 600 }}>{sortLabels[sortBy]}</span>
                  <ChevronDown size={11} style={{ color: "#94A3B8" }} />
                </button>
                {showSortMenu && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      right: 0,
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      zIndex: 100,
                      minWidth: "160px",
                      padding: "4px",
                    }}
                  >
                    {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => handleSort(key)}
                        className="w-full flex items-center justify-between px-3 py-2 transition-all"
                        style={{
                          borderRadius: "6px",
                          fontSize: "12px",
                          color: sortBy === key ? "#4F46E5" : "#374151",
                          fontWeight: sortBy === key ? 600 : 400,
                          background: sortBy === key ? "#EEF2FF" : "transparent",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => {
                          if (sortBy !== key)
                            (e.currentTarget as HTMLElement).style.background = "#F8FAFC";
                        }}
                        onMouseLeave={(e) => {
                          if (sortBy !== key)
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
                      >
                        {sortLabels[key]}
                        {sortBy === key && (
                          sortDir === "desc"
                            ? <ChevronDown size={11} style={{ color: "#4F46E5" }} />
                            : <ChevronUp size={11} style={{ color: "#4F46E5" }} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View Toggle */}
              <div
                className="flex items-center p-0.5"
                style={{ background: "#F1F5F9", borderRadius: "8px" }}
              >
                {(["table", "card"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setViewMode(v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 transition-all"
                    style={{
                      background: viewMode === v ? "#FFFFFF" : "transparent",
                      border: viewMode === v ? "1px solid #E2E8F0" : "1px solid transparent",
                      borderRadius: "6px",
                      color: viewMode === v ? "#0F1F3D" : "#64748B",
                      fontSize: "12px",
                      fontWeight: viewMode === v ? 600 : 400,
                    }}
                  >
                    {v === "table" ? <List size={13} /> : <LayoutGrid size={13} />}
                    {v === "table" ? "Tabel" : "Card"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ════════════════════════
              TABLE VIEW
          ════════════════════════ */}
          {viewMode === "table" && (
            <div className="overflow-x-auto" style={{ borderRadius: "8px" }}>
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  overflow: "hidden",
                  minWidth: "860px",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#FAFBFC", borderBottom: "1px solid #E2E8F0" }}>
                      {/* Nama Bisnis */}
                      <th
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("name")}
                        style={{ padding: "11px 16px", textAlign: "left", whiteSpace: "nowrap", width: "220px" }}
                      >
                        <span className="flex items-center" style={{ color: "#64748B", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px", textTransform: "uppercase" }}>
                          Nama Bisnis <ColArrow col="name" sortBy={sortBy} sortDir={sortDir} />
                        </span>
                      </th>
                      {/* Kategori */}
                      <th style={{ padding: "11px 14px", textAlign: "left", whiteSpace: "nowrap" }}>
                        <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px", textTransform: "uppercase" }}>Kategori</span>
                      </th>
                      {/* Rating */}
                      <th
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("rating")}
                        style={{ padding: "11px 14px", textAlign: "left", whiteSpace: "nowrap" }}
                      >
                        <span className="flex items-center" style={{ color: "#64748B", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px", textTransform: "uppercase" }}>
                          Rating <ColArrow col="rating" sortBy={sortBy} sortDir={sortDir} />
                        </span>
                      </th>
                      {/* Pain Score */}
                      <th
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("painScore")}
                        style={{ padding: "11px 14px", textAlign: "left", whiteSpace: "nowrap", width: "140px" }}
                      >
                        <span className="flex items-center" style={{ color: "#64748B", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px", textTransform: "uppercase" }}>
                          Pain Score <ColArrow col="painScore" sortBy={sortBy} sortDir={sortDir} />
                        </span>
                      </th>
                      {/* Pain Point */}
                      <th style={{ padding: "11px 14px", textAlign: "left" }}>
                        <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px", textTransform: "uppercase" }}>Pain Point Utama</span>
                      </th>
                      {/* Status */}
                      <th style={{ padding: "11px 14px", textAlign: "left", whiteSpace: "nowrap" }}>
                        <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px", textTransform: "uppercase" }}>Status</span>
                      </th>
                      {/* Potensi */}
                      <th
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("potentialNum")}
                        style={{ padding: "11px 14px", textAlign: "left", whiteSpace: "nowrap" }}
                      >
                        <span className="flex items-center" style={{ color: "#64748B", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px", textTransform: "uppercase" }}>
                          Est. Potensi <ColArrow col="potentialNum" sortBy={sortBy} sortDir={sortDir} />
                        </span>
                      </th>
                      {/* Actions */}
                      <th style={{ padding: "11px 16px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px", textTransform: "uppercase" }}>Aksi</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sortedResults.map((lead, idx) => {
                      const badge = badgeConfig[lead.badge as keyof typeof badgeConfig];
                      const BadgeIcon = badge.icon;
                      const isSaved = savedLeads.includes(lead.id);
                      const isLast = idx === sortedResults.length - 1;
                      const pc = scoreColor(lead.painScore);

                      return (
                        <tr
                          key={lead.id}
                          style={{ borderBottom: isLast ? "none" : "1px solid #F1F5F9" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FAFBFC")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                        >
                          {/* Nama Bisnis */}
                          <td style={{ padding: "13px 16px" }}>
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                                style={{ background: lead.colorBg, borderRadius: "6px" }}
                              >
                                <span style={{ color: lead.color, fontSize: "11px", fontWeight: 700 }}>
                                  {lead.initials}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap" }}>
                                  {lead.name}
                                </p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <MapPin size={10} style={{ color: "#94A3B8" }} />
                                  <span style={{ color: "#94A3B8", fontSize: "11px" }}>{lead.location}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Kategori */}
                          <td style={{ padding: "13px 14px" }}>
                            <span
                              style={{
                                background: "#F8FAFC",
                                border: "1px solid #E2E8F0",
                                color: "#64748B",
                                fontSize: "11px",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {lead.category}
                            </span>
                          </td>

                          {/* Rating */}
                          <td style={{ padding: "13px 14px" }}>
                            <div className="flex items-center gap-1">
                              <Star size={11} style={{ color: "#F59E0B" }} />
                              <span style={{ color: "#0F1F3D", fontSize: "12px", fontWeight: 600 }}>{lead.rating}</span>
                              <span style={{ color: "#94A3B8", fontSize: "11px" }}>({lead.reviews})</span>
                            </div>
                          </td>

                          {/* Pain Score */}
                          <td style={{ padding: "13px 14px" }}>
                            <div className="flex items-center gap-2">
                              <div style={{ width: "56px", background: "#F1F5F9", borderRadius: "3px", height: "5px", flexShrink: 0 }}>
                                <div
                                  style={{
                                    width: `${lead.painScore}%`,
                                    height: "100%",
                                    background: pc,
                                    borderRadius: "3px",
                                  }}
                                />
                              </div>
                              <span style={{ color: pc, fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap" }}>
                                {lead.painScore}
                              </span>
                            </div>
                          </td>

                          {/* Pain Point Utama */}
                          <td style={{ padding: "13px 14px", maxWidth: "220px" }}>
                            <p
                              style={{
                                color: "#374151",
                                fontSize: "12px",
                                lineHeight: 1.45,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {lead.painNote}
                            </p>
                          </td>

                          {/* Status Badge */}
                          <td style={{ padding: "13px 14px" }}>
                            <div
                              className="inline-flex items-center gap-1 px-2 py-1"
                              style={{
                                background: badge.bg,
                                border: `1px solid ${badge.border}`,
                                borderRadius: "6px",
                              }}
                            >
                              <BadgeIcon size={11} style={{ color: badge.color }} />
                              <span style={{ color: badge.color, fontSize: "11px", fontWeight: 600 }}>
                                {badge.label}
                              </span>
                            </div>
                          </td>

                          {/* Potensi */}
                          <td style={{ padding: "13px 14px" }}>
                            <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap" }}>
                              {lead.potential}
                            </span>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: "13px 16px" }}>
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Lihat AI Detail */}
                              <button
                                onClick={() => setSelectedLead(lead as AILead)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 transition-all"
                                style={{
                                  background: "#EEF2FF",
                                  border: "1px solid #C7D2FE",
                                  borderRadius: "6px",
                                  color: "#4F46E5",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  whiteSpace: "nowrap",
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
                              >
                                <Sparkles size={11} />
                                AI Detail
                              </button>

                              {/* Simpan */}
                              <button
                                onClick={() => toggleSave(lead.id)}
                                className="w-7 h-7 flex items-center justify-center transition-all"
                                style={{
                                  background: isSaved ? "#EEF2FF" : "#F8FAFC",
                                  border: `1px solid ${isSaved ? "#A5B4FC" : "#E2E8F0"}`,
                                  borderRadius: "6px",
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSaved)
                                    (e.currentTarget as HTMLElement).style.borderColor = "#C7D2FE";
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSaved)
                                    (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0";
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

          {/* ════════════════════════
              CARD VIEW
          ════════════════════════ */}
          {viewMode === "card" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedResults.map((lead) => {
                const badge = badgeConfig[lead.badge as keyof typeof badgeConfig];
                const BadgeIcon = badge.icon;
                const isSaved = savedLeads.includes(lead.id);
                const pc = scoreColor(lead.painScore);

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
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#C7D2FE")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")}
                  >
                    {/* Accent strip */}
                    <div style={{ height: "3px", background: badge.color, opacity: 0.7 }} />

                    <div className="p-5 flex flex-col gap-3.5 flex-1">
                      {/* Header */}
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
                        <div
                          className="flex items-center gap-1 px-2 py-1 flex-shrink-0"
                          style={{ background: badge.bg, border: `1px solid ${badge.border}`, borderRadius: "6px" }}
                        >
                          <BadgeIcon size={11} style={{ color: badge.color }} />
                          <span style={{ color: badge.color, fontSize: "11px", fontWeight: 600 }}>{badge.label}</span>
                        </div>
                      </div>

                      {/* Category + Rating */}
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
                          <span style={{ color: "#0F1F3D", fontSize: "12px", fontWeight: 600 }}>{lead.rating}</span>
                          <span style={{ color: "#94A3B8", fontSize: "11px" }}>({lead.reviews})</span>
                        </div>
                      </div>

                      {/* Pain Score */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 500 }}>Pain Score</span>
                          <span style={{ color: pc, fontSize: "14px", fontWeight: 700 }}>
                            {lead.painScore}
                            <span style={{ color: "#94A3B8", fontSize: "10px", fontWeight: 400 }}>/100</span>
                          </span>
                        </div>
                        <div style={{ background: "#F1F5F9", borderRadius: "4px", height: "5px", overflow: "hidden" }}>
                          <div style={{ width: `${lead.painScore}%`, height: "100%", background: pc, borderRadius: "4px" }} />
                        </div>
                        <p style={{ color: "#64748B", fontSize: "11.5px", marginTop: "6px", lineHeight: 1.45 }}>
                          {lead.painNote}
                        </p>
                      </div>

                      {/* Potensi */}
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
                        <Clock size={12} style={{ color: "#C7D2FE" }} />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-auto">
                        <button
                          onClick={() => setSelectedLead(lead as AILead)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 transition-all"
                          style={{
                            background: "#0F1F3D", color: "#FFFFFF",
                            borderRadius: "6px", fontSize: "11px", fontWeight: 600,
                          }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1E3A5F")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#0F1F3D")}
                        >
                          <Sparkles size={11} />
                          Lihat AI Detail
                        </button>
                        <button
                          onClick={() => toggleSave(lead.id)}
                          className="flex items-center justify-center p-2 transition-all"
                          style={{
                            background: isSaved ? "#EEF2FF" : "#F8FAFC",
                            border: `1px solid ${isSaved ? "#A5B4FC" : "#E2E8F0"}`,
                            borderRadius: "6px",
                          }}
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

          {/* ── Footer Row ── */}
          <div className="flex items-center justify-between mt-5">
            <p style={{ color: "#94A3B8", fontSize: "12px" }}>
              {SEARCH_RESULTS.length} leads ditampilkan
            </p>
            <button
              className="flex items-center gap-2 px-4 py-2 transition-all"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
                color: "#64748B",
                fontSize: "12px",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#0F1F3D";
                (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                (e.currentTarget as HTMLElement).style.borderColor = "#0F1F3D";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#FFFFFF";
                (e.currentTarget as HTMLElement).style.color = "#64748B";
                (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0";
              }}
            >
              Muat lebih banyak
              <ChevronDown size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ── AI Detail Sheet ── */}
      <LeadAIDetailSheet
        lead={selectedLead}
        open={selectedLead !== null}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
}
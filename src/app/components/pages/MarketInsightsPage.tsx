import { useState, useEffect } from "react";
import {
  TrendingUp,
  MapPin,
  Zap,
  ChevronDown,
  Check,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Building2,
  Activity,
  BadgeDollarSign,
  Minus,
  Plus,
} from "lucide-react";
import { MarketInsightsSkeleton } from "../Skeletons";

// ─── Types ────────────────────────────────────────────────────────────────────
type HeatTab = "density" | "sentiment" | "opportunity";

// ─── Static Data ──────────────────────────────────────────────────────────────
const cities = [
  "Jakarta Selatan",
  "Jakarta Pusat",
  "Jakarta Barat",
  "Jakarta Timur",
  "Jakarta Utara",
  "Depok",
  "Bekasi",
  "Tangerang",
  "Bandung",
];

const kpiByCity: Record<string, { total: string; gap: string; sentiment: string; revenue: string; sentimentPos: boolean }> = {
  "Jakarta Selatan": { total: "1,240", gap: "847", sentiment: "62.4%", revenue: "Rp 4.2M", sentimentPos: false },
  "Jakarta Pusat":   { total: "1,018", gap: "712", sentiment: "58.7%", revenue: "Rp 3.8M", sentimentPos: false },
  "Jakarta Barat":   { total: "934",   gap: "621", sentiment: "64.1%", revenue: "Rp 3.1M", sentimentPos: true  },
  "Jakarta Timur":   { total: "876",   gap: "598", sentiment: "66.2%", revenue: "Rp 2.9M", sentimentPos: true  },
  "Jakarta Utara":   { total: "742",   gap: "481", sentiment: "59.8%", revenue: "Rp 2.4M", sentimentPos: false },
  "Depok":           { total: "681",   gap: "447", sentiment: "71.3%", revenue: "Rp 2.2M", sentimentPos: true  },
  "Bekasi":          { total: "812",   gap: "531", sentiment: "68.5%", revenue: "Rp 2.7M", sentimentPos: true  },
  "Tangerang":       { total: "743",   gap: "489", sentiment: "65.9%", revenue: "Rp 2.5M", sentimentPos: true  },
  "Bandung":         { total: "1,102", gap: "718", sentiment: "60.2%", revenue: "Rp 3.6M", sentimentPos: false },
};

// Heat zones for SVG map (Jakarta Selatan neighborhoods)
const heatZones = [
  { x: 545, y: 192, r: 90,  intensity: 0.90, sentiment: 0.28, opportunity: 0.94 },
  { x: 338, y: 182, r: 78,  intensity: 0.75, sentiment: 0.42, opportunity: 0.87 },
  { x: 434, y: 294, r: 70,  intensity: 0.60, sentiment: 0.55, opportunity: 0.82 },
  { x: 244, y: 270, r: 64,  intensity: 0.50, sentiment: 0.52, opportunity: 0.78 },
  { x: 158, y: 165, r: 60,  intensity: 0.45, sentiment: 0.63, opportunity: 0.73 },
  { x: 618, y: 308, r: 54,  intensity: 0.35, sentiment: 0.60, opportunity: 0.68 },
  { x: 284, y: 124, r: 64,  intensity: 0.55, sentiment: 0.44, opportunity: 0.75 },
  { x: 590, y: 126, r: 54,  intensity: 0.40, sentiment: 0.37, opportunity: 0.72 },
];

// Pin markers on the map
const mapPins = [
  { x: 545, y: 192, type: "green" as const, score: 94 },
  { x: 338, y: 182, type: "green" as const, score: 87 },
  { x: 434, y: 294, type: "green" as const, score: 82 },
  { x: 244, y: 270, type: "dark"  as const, score: 78 },
  { x: 158, y: 165, type: "dark"  as const, score: 73 },
  { x: 284, y: 124, type: "dark"  as const, score: 75 },
  { x: 590, y: 126, type: "dark"  as const, score: 72 },
  { x: 618, y: 308, type: "dark"  as const, score: 68 },
];

// District text labels
const areaLabels = [
  { x: 545, y: 215, text: "KEMANG" },
  { x: 338, y: 205, text: "BLOK M" },
  { x: 434, y: 318, text: "CIPETE" },
  { x: 244, y: 293, text: "FATMAWATI" },
  { x: 158, y: 188, text: "TEBET" },
  { x: 618, y: 332, text: "JAGAKARSA" },
  { x: 284, y: 148, text: "KEB. BARU" },
  { x: 590, y: 150, text: "MAMPANG" },
];

const opportunityAreas = [
  { rank: 1, name: "Kemang",            score: 94, painFocus: "Layanan & Booking Online",        leads: 89, color: "#DC2626", colorBg: "#FEF2F2" },
  { rank: 2, name: "Blok M",            score: 87, painFocus: "Kualitas & Konsistensi Produk",    leads: 67, color: "#D97706", colorBg: "#FFFBEB" },
  { rank: 3, name: "Cipete",            score: 82, painFocus: "Kehadiran Digital Lemah",          leads: 54, color: "#059669", colorBg: "#ECFDF5" },
  { rank: 4, name: "Fatmawati",         score: 78, painFocus: "Response Time Lambat",             leads: 43, color: "#0284C7", colorBg: "#E0F2FE" },
  { rank: 5, name: "Mampang Prapatan", score: 73,  painFocus: "Harga vs Value Proposition",      leads: 38, color: "#7C3AED", colorBg: "#F5F3FF" },
];

const categoryTrends = [
  { name: "Kesehatan & Klinik",    growth: 34.2, leads: 312, color: "#DC2626" },
  { name: "Laundry & Kebersihan",  growth: 28.7, leads: 198, color: "#0284C7" },
  { name: "F&B & Kuliner",         growth: 22.1, leads: 441, color: "#EA580C" },
  { name: "Otomotif & Bengkel",    growth: 18.9, leads: 267, color: "#4F46E5" },
  { name: "Kecantikan & Spa",      growth: 15.4, leads: 189, color: "#D97706" },
  { name: "Retail Elektronik",     growth:  9.2, leads: 134, color: "#059669" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getHeatFill(tab: HeatTab, zone: typeof heatZones[0]): string {
  if (tab === "density") {
    if (zone.intensity > 0.7) return "#EF4444";
    if (zone.intensity > 0.5) return "#F59E0B";
    return "#6366F1";
  }
  if (tab === "sentiment") {
    if (zone.sentiment < 0.4) return "#EF4444";
    if (zone.sentiment < 0.55) return "#F59E0B";
    return "#22C55E";
  }
  // opportunity
  if (zone.opportunity > 0.85) return "#4F46E5";
  if (zone.opportunity > 0.72) return "#818CF8";
  return "#A5B4FC";
}

function getHeatOpacity(tab: HeatTab, zone: typeof heatZones[0]): number {
  if (tab === "density")    return zone.intensity * 0.58;
  if (tab === "sentiment")  return (1 - zone.sentiment + 0.2) * 0.60;
  return zone.opportunity * 0.55;
}

function scoreFill(score: number) {
  if (score >= 85) return "#DC2626";
  if (score >= 70) return "#D97706";
  return "#2563EB";
}

// ─── Heatmap Legend Colours by Tab ───────────────────────────────────────────
const heatLegend: Record<HeatTab, { high: string; mid: string; low: string; highLabel: string; lowLabel: string }> = {
  density:     { high: "#EF4444", mid: "#F59E0B", low: "#6366F1", highLabel: "Kepadatan Tinggi", lowLabel: "Kepadatan Rendah" },
  sentiment:   { high: "#EF4444", mid: "#F59E0B", low: "#22C55E", highLabel: "Sentimen Negatif", lowLabel: "Sentimen Positif" },
  opportunity: { high: "#4F46E5", mid: "#818CF8", low: "#A5B4FC", highLabel: "Peluang Tinggi",   lowLabel: "Peluang Rendah"  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export function MarketInsightsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity,  setSelectedCity]  = useState("Jakarta Selatan");
  const [cityDropOpen,  setCityDropOpen]  = useState(false);
  const [heatTab,       setHeatTab]       = useState<HeatTab>("opportunity");
  const [zoom,          setZoom]          = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1300);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) return <MarketInsightsSkeleton />;

  const kpi        = kpiByCity[selectedCity] ?? kpiByCity["Jakarta Selatan"];
  const maxGrowth  = Math.max(...categoryTrends.map((c) => c.growth));
  const zoomStep   = 0.25;
  const minZoom    = 0.75;
  const maxZoom    = 2.0;

  // Dynamic SVG viewBox based on zoom
  const baseW = 820;
  const baseH = 420;
  const vbW   = baseW / zoom;
  const vbH   = baseH / zoom;
  const vbX   = (baseW - vbW) / 2;
  const vbY   = (baseH - vbH) / 2;
  const viewBox = `${vbX} ${vbY} ${vbW} ${vbH}`;

  return (
    <div className="min-h-screen p-5 md:p-6 lg:p-8" style={{ background: "#F8FAFC", color: "#0F1F3D" }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-8 h-8 flex items-center justify-center"
              style={{ background: "#EEF2FF", borderRadius: "8px" }}
            >
              <TrendingUp size={15} style={{ color: "#4F46E5" }} />
            </div>
            <h1 style={{ color: "#0F1F3D", fontSize: "22px", fontWeight: 700 }}>
              Market Insights &amp; Heatmap
            </h1>
          </div>
          <p style={{ color: "#64748B", fontSize: "14px", marginLeft: "44px" }}>
            Pahami peluang pasar lokal secara visual dan mendalam
          </p>
        </div>

        {/* City Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setCityDropOpen((p) => !p)}
            className="flex items-center gap-2 px-4 py-2.5 transition-colors"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              color: "#0F1F3D",
              fontSize: "13px",
              fontWeight: 500,
              minWidth: "188px",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#FFFFFF")}
          >
            <MapPin size={14} style={{ color: "#4F46E5" }} />
            <span className="flex-1 text-left">{selectedCity}</span>
            <ChevronDown
              size={14}
              style={{
                color: "#94A3B8",
                transform: cityDropOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.15s",
              }}
            />
          </button>

          {cityDropOpen && (
            <div
              className="absolute top-full right-0 mt-1 py-1 z-50"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                minWidth: "188px",
              }}
            >
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => { setSelectedCity(city); setCityDropOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 transition-colors"
                  style={{ fontSize: "13px", color: "#0F1F3D" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <span>{city}</span>
                  {selectedCity === city && <Check size={13} style={{ color: "#4F46E5" }} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          {
            label: "Total Bisnis Terpantau",
            value: kpi.total,
            sub: `bisnis aktif di ${selectedCity}`,
            change: "+8.3% vs bulan lalu",
            positive: true,
            icon: Building2,
            accent: "#4F46E5",
            accentBg: "#EEF2FF",
          },
          {
            label: "Opportunity Gap",
            value: kpi.gap,
            sub: "bisnis tanpa solusi digital",
            change: "+12% peluang baru",
            positive: true,
            icon: Target,
            accent: "#DC2626",
            accentBg: "#FEF2F2",
          },
          {
            label: "Avg Market Sentiment",
            value: kpi.sentiment,
            sub: "rata-rata sentimen positif",
            change: kpi.sentimentPos ? "+2.4% vs bulan lalu" : "-3.1% vs bulan lalu",
            positive: kpi.sentimentPos,
            icon: Activity,
            accent: "#D97706",
            accentBg: "#FFFBEB",
          },
          {
            label: "Revenue Potential",
            value: kpi.revenue,
            sub: "estimasi dari leads aktif",
            change: "+18.7% vs bulan lalu",
            positive: true,
            icon: BadgeDollarSign,
            accent: "#059669",
            accentBg: "#ECFDF5",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="p-5"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}
          >
            <div className="flex items-center justify-between mb-4">
              <p style={{ color: "#64748B", fontSize: "12px", fontWeight: 500 }}>{card.label}</p>
              <div
                className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                style={{ background: card.accentBg, borderRadius: "8px" }}
              >
                <card.icon size={15} style={{ color: card.accent }} />
              </div>
            </div>
            <p
              style={{
                color: "#0F1F3D",
                fontSize: "26px",
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: "6px",
                letterSpacing: "-0.5px",
              }}
            >
              {card.value}
            </p>
            <p style={{ color: "#94A3B8", fontSize: "11px", marginBottom: "8px" }}>{card.sub}</p>
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 w-fit"
              style={{ background: card.positive ? "#F0FDF4" : "#FEF2F2", borderRadius: "4px" }}
            >
              {card.positive
                ? <ArrowUpRight size={10} style={{ color: "#16A34A" }} />
                : <ArrowDownRight size={10} style={{ color: "#DC2626" }} />}
              <span
                style={{
                  color: card.positive ? "#16A34A" : "#DC2626",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Heatmap Section ─────────────────────────────────────────────────── */}
      <div
        className="mb-6"
        style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden" }}
      >
        {/* Heatmap Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid #F1F5F9" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 flex items-center justify-center"
              style={{ background: "#EEF2FF", borderRadius: "8px" }}
            >
              <MapPin size={14} style={{ color: "#4F46E5" }} />
            </div>
            <div>
              <h2 style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 700, lineHeight: 1 }}>
                Live Opportunity Heatmap: {selectedCity}
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>
                Visualisasi kepadatan peluang bisnis real-time
              </p>
            </div>
          </div>

          {/* View Tabs */}
          <div
            className="flex items-center p-0.5"
            style={{ background: "#F1F5F9", borderRadius: "8px", border: "1px solid #E2E8F0" }}
          >
            {(["density", "sentiment", "opportunity"] as HeatTab[]).map((tab) => {
              const labels: Record<HeatTab, string> = {
                density:     "Density",
                sentiment:   "Sentiment",
                opportunity: "Opportunity",
              };
              const isActive = heatTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setHeatTab(tab)}
                  className="px-3 py-1.5 transition-all"
                  style={{
                    borderRadius: "6px",
                    fontSize: "11.5px",
                    fontWeight: isActive ? 600 : 500,
                    background: isActive ? "#0F1F3D" : "transparent",
                    color: isActive ? "#FFFFFF" : "#64748B",
                    border: "none",
                  }}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>
        </div>

        {/* SVG Map Canvas */}
        <div className="relative" style={{ height: "456px", overflow: "hidden", background: "#F8FAFC" }}>
          <svg
            width="100%"
            height="100%"
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
            style={{ display: "block" }}
          >
            <defs>
              {/* Blur for heat blobs */}
              <filter id="mi-heat-blur" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="26" />
              </filter>
              {/* Glow for center dot */}
              <filter id="mi-center-glow" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="9" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Drop shadow for pins */}
              <filter id="mi-pin-shadow" x="-30%" y="-20%" width="160%" height="180%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000022" />
              </filter>
            </defs>

            {/* ── Background ── */}
            <rect width="820" height="420" fill="#F8FAFC" />

            {/* ── Grid lines ── */}
            {Array.from({ length: 21 }, (_, i) => (
              <line key={`gv${i}`} x1={i * 41} y1="0" x2={i * 41} y2="420"
                stroke="#CBD5E1" strokeWidth="0.6" strokeOpacity="0.35" />
            ))}
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`gh${i}`} x1="0" y1={i * 42} x2="820" y2={i * 42}
                stroke="#CBD5E1" strokeWidth="0.6" strokeOpacity="0.35" />
            ))}

            {/* ── Roads ── */}
            {/* TB Simatupang — lower horizontal */}
            <path d="M 0,336 Q 250,330 440,334 Q 640,338 820,332"
              stroke="#DDE3EB" strokeWidth="6" fill="none" strokeLinecap="round" />
            <text x="18" y="326" fill="#B8C4D0" fontSize="8" fontWeight="600" letterSpacing="0.5">
              TB SIMATUPANG
            </text>

            {/* Jl. Sudirman — upper horizontal */}
            <path d="M 0,150 Q 200,146 360,150 Q 540,154 820,148"
              stroke="#DDE3EB" strokeWidth="6" fill="none" strokeLinecap="round" />
            <text x="18" y="140" fill="#B8C4D0" fontSize="8" fontWeight="600" letterSpacing="0.5">
              JL. SUDIRMAN
            </text>

            {/* Jl. Pasar Minggu — diagonal */}
            <path d="M 188,80 Q 310,185 400,265 Q 490,345 572,410"
              stroke="#DDE3EB" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Jl. Panglima Polim — vertical */}
            <path d="M 306,42 Q 302,155 298,260 Q 294,342 291,420"
              stroke="#DDE3EB" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Jl. Antasari — slight diagonal */}
            <path d="M 444,55 Q 458,165 468,265 Q 477,345 488,420"
              stroke="#DDE3EB" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Jl. Kemang Raya */}
            <path d="M 456,148 Q 506,192 542,248 Q 568,292 584,338"
              stroke="#DDE3EB" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Minor cross streets */}
            <path d="M 60,198 Q 280,193 460,198 Q 640,203 820,196"
              stroke="#DDE3EB" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 60,268 Q 260,264 440,268 Q 630,272 820,266"
              stroke="#DDE3EB" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* ── Heat Blobs ── */}
            <g filter="url(#mi-heat-blur)">
              {heatZones.map((zone, i) => (
                <circle
                  key={i}
                  cx={zone.x}
                  cy={zone.y}
                  r={zone.r * 0.95}
                  fill={getHeatFill(heatTab, zone)}
                  opacity={getHeatOpacity(heatTab, zone)}
                />
              ))}
            </g>

            {/* ── District Labels ── */}
            {areaLabels.map((lbl, i) => (
              <text
                key={i}
                x={lbl.x}
                y={lbl.y}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="8"
                fontWeight="700"
                letterSpacing="0.9"
              >
                {lbl.text}
              </text>
            ))}

            {/* ── Pins ── */}
            {mapPins.map((pin, i) => {
              const color = pin.type === "green" ? "#25D366" : "#0F1F3D";
              const pw = 22;
              const ph = 30;
              return (
                <g key={i} filter="url(#mi-pin-shadow)"
                  transform={`translate(${pin.x - pw / 2}, ${pin.y - ph})`}>
                  {/* Head circle */}
                  <circle cx={pw / 2} cy={pw / 2} r={pw / 2} fill={color} />
                  {/* Tail polygon */}
                  <polygon
                    points={`${pw / 2 - 5},${pw - 3} ${pw / 2 + 5},${pw - 3} ${pw / 2},${ph}`}
                    fill={color}
                  />
                  {/* Zap icon */}
                  <text
                    x={pw / 2}
                    y={pw / 2 + 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    ⚡
                  </text>
                </g>
              );
            })}

            {/* ── Center Blue Dot (analysis center) ── */}
            <g filter="url(#mi-center-glow)">
              <circle cx={404} cy={216} r={18} fill="#3B82F6" opacity="0.18" />
              <circle cx={404} cy={216} r={10} fill="#3B82F6" opacity="0.30" />
            </g>
            <circle cx={404} cy={216} r={5.5} fill="#1D4ED8" />
            <circle cx={404} cy={216} r={2.5} fill="#FFFFFF" />
          </svg>

          {/* ── Zoom Controls ── */}
          <div className="absolute flex flex-col gap-1" style={{ top: "12px", right: "12px" }}>
            <button
              onClick={() => setZoom((z) => Math.min(+(z + zoomStep).toFixed(2), maxZoom))}
              className="w-7 h-7 flex items-center justify-center transition-colors"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "6px", color: "#0F1F3D" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F1F5F9")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#FFFFFF")}
            >
              <Plus size={13} />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(+(z - zoomStep).toFixed(2), minZoom))}
              className="w-7 h-7 flex items-center justify-center transition-colors"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "6px", color: "#0F1F3D" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F1F5F9")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#FFFFFF")}
            >
              <Minus size={13} />
            </button>
            <div
              className="w-7 h-7 flex items-center justify-center"
              style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "6px" }}
            >
              <span style={{ color: "#64748B", fontSize: "9px", fontWeight: 700 }}>
                {Math.round(zoom * 100)}%
              </span>
            </div>
          </div>

          {/* ── Active Data Badge ── */}
          <div
            className="absolute flex items-center gap-2 px-3 py-1.5"
            style={{ bottom: "12px", left: "12px", background: "#0F1F3D", borderRadius: "8px" }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#25D366", animation: "pulse 2s infinite" }}
            />
            <span style={{ color: "#FFFFFF", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px" }}>
              ACTIVE DATA POINTS: 1.2K
            </span>
          </div>

          {/* ── Legend ── */}
          <div
            className="absolute flex items-center gap-4 px-3 py-2"
            style={{
              bottom: "12px",
              right: "12px",
              background: "rgba(255,255,255,0.96)",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
            }}
          >
            {/* Heat gradient bar */}
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: "56px",
                  height: "6px",
                  borderRadius: "4px",
                  background: `linear-gradient(to right, ${heatLegend[heatTab].low}, ${heatLegend[heatTab].mid}, ${heatLegend[heatTab].high})`,
                }}
              />
              <div className="flex flex-col" style={{ gap: "1px" }}>
                <span style={{ color: "#64748B", fontSize: "9px" }}>{heatLegend[heatTab].highLabel}</span>
                <span style={{ color: "#94A3B8", fontSize: "9px" }}>{heatLegend[heatTab].lowLabel}</span>
              </div>
            </div>
            <div style={{ width: "1px", height: "24px", background: "#E2E8F0" }} />
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#25D366" }} />
              <span style={{ color: "#64748B", fontSize: "10px" }}>Prioritas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#0F1F3D" }} />
              <span style={{ color: "#64748B", fontSize: "10px" }}>Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#3B82F6" }} />
              <span style={{ color: "#64748B", fontSize: "10px" }}>Pusat Analisis</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-Column Section ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-5 mb-6">

        {/* Left: Top Opportunity Areas */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}>
          <div className="px-5 pt-4 pb-3 flex items-center gap-2.5" style={{ borderBottom: "1px solid #F1F5F9" }}>
            <div className="w-7 h-7 flex items-center justify-center" style={{ background: "#FEF2F2", borderRadius: "8px" }}>
              <Target size={14} style={{ color: "#DC2626" }} />
            </div>
            <div>
              <h2 style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 700, lineHeight: 1 }}>
                Top Opportunity Areas
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>
                {selectedCity} · Berdasarkan Pain Score
              </p>
            </div>
          </div>

          <div>
            {opportunityAreas.map((area, idx) => (
              <div
                key={area.rank}
                className="flex items-center gap-4 px-5 py-4 transition-colors cursor-default"
                style={{ borderBottom: idx < opportunityAreas.length - 1 ? "1px solid #F1F5F9" : "none" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FAFBFC")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                {/* Rank */}
                <span style={{ color: "#CBD5E1", fontSize: "13px", fontWeight: 700, width: "18px", textAlign: "center", flexShrink: 0 }}>
                  {area.rank}
                </span>

                {/* Icon */}
                <div
                  className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                  style={{ background: area.colorBg, borderRadius: "8px" }}
                >
                  <MapPin size={14} style={{ color: area.color }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>{area.name}</p>
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
                      {area.leads} leads
                    </span>
                  </div>
                  <p style={{ color: "#94A3B8", fontSize: "11px" }}>Pain Focus: {area.painFocus}</p>
                </div>

                {/* Score */}
                <div className="flex flex-col items-end flex-shrink-0">
                  <span style={{ color: scoreFill(area.score), fontSize: "20px", fontWeight: 700, lineHeight: 1 }}>
                    {area.score}
                  </span>
                  <span style={{ color: "#94A3B8", fontSize: "10px", marginTop: "2px" }}>/ 100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Category Trends */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}>
          <div className="px-5 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom: "1px solid #F1F5F9" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 flex items-center justify-center" style={{ background: "#ECFDF5", borderRadius: "8px" }}>
                <TrendingUp size={14} style={{ color: "#059669" }} />
              </div>
              <div>
                <h2 style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 700, lineHeight: 1 }}>
                  Tren Kategori Paling Panas
                </h2>
                <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>Growth % vs bulan lalu</p>
              </div>
            </div>
            <span style={{ fontSize: "11px", color: "#94A3B8" }}>30 hari terakhir</span>
          </div>

          <div className="px-5 py-5 flex flex-col gap-4">
            {categoryTrends.map((cat, idx) => {
              const barPct = (cat.growth / maxGrowth) * 100;
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span style={{ color: cat.color, fontSize: "11.5px", fontWeight: 700, minWidth: "16px" }}>
                        {idx + 1}.
                      </span>
                      <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 500 }}>{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          background: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          color: "#64748B",
                          fontSize: "10px",
                          padding: "1px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {cat.leads} leads
                      </span>
                      <div
                        className="flex items-center gap-0.5 px-1.5 py-0.5"
                        style={{ background: "#F0FDF4", borderRadius: "4px" }}
                      >
                        <ArrowUpRight size={10} style={{ color: "#16A34A" }} />
                        <span style={{ color: "#16A34A", fontSize: "11px", fontWeight: 700 }}>
                          +{cat.growth}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: "#F1F5F9", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${barPct}%`,
                        height: "100%",
                        background: cat.color,
                        borderRadius: "4px",
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── AI Market Summary ────────────────────────────────────────────────── */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}>
        <div
          className="px-5 pt-4 pb-3 flex items-center justify-between"
          style={{ borderBottom: "1px solid #F1F5F9" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 flex items-center justify-center" style={{ background: "#EEF2FF", borderRadius: "8px" }}>
              <Sparkles size={14} style={{ color: "#4F46E5" }} />
            </div>
            <div>
              <h2 style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 700, lineHeight: 1 }}>
                AI Market Summary
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>
                Insight otomatis berdasarkan data real-time {selectedCity}
              </p>
            </div>
          </div>
          <span
            className="flex items-center gap-1.5 px-2.5 py-1"
            style={{ background: "#F8F4FF", border: "1px solid #DDD6FE", borderRadius: "6px" }}
          >
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#7C3AED" }}>✦</span>
            <span style={{ fontSize: "10.5px", fontWeight: 600, color: "#7C3AED" }}>Powered by Claude AI</span>
          </span>
        </div>

        <div className="px-5 py-5">
          <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.75, marginBottom: "18px" }}>
            Berdasarkan analisis terhadap{" "}
            <strong style={{ color: "#0F1F3D" }}>
              {kpi.total} bisnis aktif di {selectedCity}
            </strong>
            , area Kemang menunjukkan konsentrasi tertinggi bisnis dengan Pain Score di atas 80, terutama
            di sektor F&B dan Kesehatan.{" "}
            <strong style={{ color: "#0F1F3D" }}>Opportunity gap terbesar</strong> teridentifikasi pada
            aspek layanan pelanggan digital dan sistem booking online — area di mana{" "}
            <strong style={{ color: "#0F1F3D" }}>73% bisnis</strong> belum memiliki solusi memadai.
            Sentimen pasar saat ini berada di{" "}
            <strong style={{ color: kpi.sentimentPos ? "#059669" : "#DC2626" }}>{kpi.sentiment}</strong>{" "}
            yang mengindikasikan{" "}
            {kpi.sentimentPos ? "peluang membangun loyalitas lebih kuat" : "urgensi tinggi untuk intervensi solusi segera"}.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[
              {
                icon: Target,
                label: "Temuan Utama",
                text: `Sektor Kesehatan tumbuh 34.2% dengan 312 bisnis berpotensi tinggi di area Kemang–Cipete.`,
                color: "#DC2626",
                colorBg: "#FEF2F2",
              },
              {
                icon: Zap,
                label: "Rekomendasi Aksi",
                text: `Prioritaskan outreach ke 89 leads di Kemang. Tingkat konversi estimasi 18–24% berdasarkan historical data.`,
                color: "#4F46E5",
                colorBg: "#EEF2FF",
              },
              {
                icon: TrendingUp,
                label: "Proyeksi Revenue",
                text: `Estimasi ${kpi.revenue}/bulan jika 15% dari ${kpi.gap} opportunity gap berhasil dikonversi dalam 60 hari.`,
                color: "#059669",
                colorBg: "#ECFDF5",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4"
                style={{
                  background: "#FAFBFC",
                  border: "1px solid #F1F5F9",
                  borderRadius: "8px",
                  borderLeft: `3px solid ${item.color}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div
                    className="w-6 h-6 flex items-center justify-center"
                    style={{ background: item.colorBg, borderRadius: "6px" }}
                  >
                    <item.icon size={12} style={{ color: item.color }} />
                  </div>
                  <span style={{ color: "#0F1F3D", fontSize: "12px", fontWeight: 700 }}>{item.label}</span>
                </div>
                <p style={{ color: "#64748B", fontSize: "12px", lineHeight: 1.55 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
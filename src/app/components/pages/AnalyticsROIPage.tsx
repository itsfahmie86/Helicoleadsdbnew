import { useState, useMemo, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  BarChart3,
  Users,
  Flame,
  BadgeDollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Play,
  Pause,
  MoreHorizontal,
  Calculator,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";
import { AnalyticsROISkeleton } from "../Skeletons";

// ─── Types ────────────────────────────────────────────────────────────────────
type Period       = "7d" | "30d" | "90d" | "custom";
type SortKey      = "leads" | "replyRate" | "closed" | "revenue";
type SortDir      = "asc" | "desc";
type CampStatus   = "Running" | "Paused" | "Completed" | "Draft";

interface Campaign {
  id: number;
  name: string;
  leads: number;
  replyRate: number;
  closed: number;
  revenue: number;
  status: CampStatus;
}

// ─── KPI by Period ────────────────────────────────────────────────────────────
const kpiByPeriod: Record<Period, {
  leads: number; hot: number; rate: number; revenue: string; ratePos: boolean;
}> = {
  "7d":     { leads: 124,  hot: 18,  rate: 19.4, revenue: "Rp 8.2jt",  ratePos: true  },
  "30d":    { leads: 487,  hot: 72,  rate: 21.3, revenue: "Rp 34.8jt", ratePos: true  },
  "90d":    { leads: 1240, hot: 186, rate: 18.9, revenue: "Rp 89.4jt", ratePos: false },
  "custom": { leads: 487,  hot: 72,  rate: 21.3, revenue: "Rp 34.8jt", ratePos: true  },
};

// ─── Chart Data by Period ─────────────────────────────────────────────────────
const chartByPeriod: Record<Period, { label: string; leads: number; closed: number }[]> = {
  "7d": [
    { label: "Sen", leads: 12, closed: 2 },
    { label: "Sel", leads: 18, closed: 4 },
    { label: "Rab", leads: 22, closed: 5 },
    { label: "Kam", leads: 16, closed: 3 },
    { label: "Jum", leads: 24, closed: 6 },
    { label: "Sab", leads: 20, closed: 4 },
    { label: "Min", leads: 12, closed: 2 },
  ],
  "30d": [
    { label: "M1", leads: 89,  closed: 17 },
    { label: "M2", leads: 115, closed: 22 },
    { label: "M3", leads: 134, closed: 26 },
    { label: "M4", leads: 149, closed: 31 },
  ],
  "90d": [
    { label: "Jan", leads: 78,  closed: 12 },
    { label: "Feb", leads: 92,  closed: 17 },
    { label: "Mar", leads: 115, closed: 22 },
    { label: "Apr", leads: 134, closed: 28 },
    { label: "Mei", leads: 156, closed: 31 },
    { label: "Jun", leads: 143, closed: 26 },
    { label: "Jul", leads: 178, closed: 35 },
    { label: "Agu", leads: 195, closed: 42 },
    { label: "Sep", leads: 149, closed: 29 },
  ],
  "custom": [
    { label: "M1", leads: 89,  closed: 17 },
    { label: "M2", leads: 115, closed: 22 },
    { label: "M3", leads: 134, closed: 26 },
    { label: "M4", leads: 149, closed: 31 },
  ],
};

// ─── Pie Chart Data ───────────────────────────────────────────────────────────
const pieData = [
  { name: "Hot  (Pain ≥ 85)", value: 28, color: "#DC2626" },
  { name: "Warm (70 – 84)",   value: 34, color: "#D97706" },
  { name: "Cool (50 – 69)",   value: 25, color: "#4F46E5" },
  { name: "Cold (< 50)",      value: 13, color: "#CBD5E1" },
];

// ─── Area Chart Data ──────────────────────────────────────────────────────────
const areaData = [
  { month: "Jan", painIndex: 62, responseRate: 22 },
  { month: "Feb", painIndex: 66, responseRate: 26 },
  { month: "Mar", painIndex: 71, responseRate: 29 },
  { month: "Apr", painIndex: 68, responseRate: 27 },
  { month: "Mei", painIndex: 74, responseRate: 32 },
  { month: "Jun", painIndex: 70, responseRate: 30 },
  { month: "Jul", painIndex: 78, responseRate: 35 },
  { month: "Agu", painIndex: 82, responseRate: 39 },
  { month: "Sep", painIndex: 79, responseRate: 37 },
];

// ─── Campaign Data ────────────────────────────────────────────────────────────
const campaigns: Campaign[] = [
  { id: 1, name: "Klinik & Kesehatan Jakarta",  leads: 48, replyRate: 62, closed: 12, revenue: 14400000, status: "Running"   },
  { id: 2, name: "Laundry Cepat Bekasi",         leads: 35, replyRate: 41, closed: 8,  revenue: 7200000,  status: "Running"   },
  { id: 3, name: "Otomotif Jakarta Timur",        leads: 27, replyRate: 28, closed: 4,  revenue: 4800000,  status: "Paused"    },
  { id: 4, name: "Salon & Beauty Depok",          leads: 52, replyRate: 71, closed: 18, revenue: 21600000, status: "Completed" },
  { id: 5, name: "Apotek Jabodetabek",            leads: 63, replyRate: 58, closed: 21, revenue: 25200000, status: "Completed" },
  { id: 6, name: "F&B Surabaya Q3",               leads: 41, replyRate: 0,  closed: 0,  revenue: 0,        status: "Draft"     },
];

// ─── ROI Presets ──────────────────────────────────────────────────────────────
const avgValueOptions = [
  { label: "Rp 1jt",   value: 1_000_000  },
  { label: "Rp 2.5jt", value: 2_500_000  },
  { label: "Rp 5jt",   value: 5_000_000  },
  { label: "Rp 10jt",  value: 10_000_000 },
];
const planOptions = [
  { label: "Starter", cost: 149_000 },
  { label: "Growth",  cost: 349_000 },
  { label: "Pro",     cost: 799_000 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtRupiah(n: number): string {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000)     return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return `Rp ${n.toLocaleString("id-ID")}`;
}
function rateFill(r: number) {
  if (r >= 55) return "#059669";
  if (r >= 30) return "#D97706";
  return "#DC2626";
}
const statusCfg: Record<CampStatus, { bg: string; color: string; border: string }> = {
  Running:   { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
  Paused:    { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  Completed: { bg: "#EEF2FF", color: "#4F46E5", border: "#C7D2FE" },
  Draft:     { bg: "#F8FAFC", color: "#64748B", border: "#E2E8F0" },
};
const statusIcon: Record<CampStatus, React.ReactNode> = {
  Running:   <Play    size={8} />,
  Paused:    <Pause   size={8} />,
  Completed: <CheckCircle2 size={8} />,
  Draft:     <MoreHorizontal size={8} />,
};

// ─── Reusable Chart Tooltip ───────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "8px",
        padding: "10px 14px",
      }}
    >
      <p
        style={{
          color: "#94A3B8",
          fontSize: "11px",
          fontWeight: 600,
          marginBottom: "6px",
          letterSpacing: "0.3px",
        }}
      >
        {label}
      </p>
      {payload.map((p: any, i: number) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "2px",
              background: p.color || p.fill,
              flexShrink: 0,
            }}
          />
          <span style={{ color: "#64748B", fontSize: "12px" }}>{p.name}:</span>
          <span style={{ color: "#0F1F3D", fontSize: "12px", fontWeight: 600 }}>
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AnalyticsROIPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [period,      setPeriod]      = useState<Period>("30d");
  const [sortKey,     setSortKey]     = useState<SortKey>("revenue");
  const [sortDir,     setSortDir]     = useState<SortDir>("desc");
  const [deals,       setDeals]       = useState(8);
  const [avgValIdx,   setAvgValIdx]   = useState(1); // Rp 2.5jt
  const [planIdx,     setPlanIdx]     = useState(1); // Growth

  const kpi       = kpiByPeriod[period];
  const chartData = chartByPeriod[period];

  // ── Sort Campaigns ──────────────────────────────────────────────────────────
  const sortedCamps = useMemo(() => {
    return [...campaigns].sort((a, b) => {
      const av = a[sortKey] as number;
      const bv = b[sortKey] as number;
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) return <AnalyticsROISkeleton />;

  // ── ROI Calc ────────────────────────────────────────────────────────────────
  const avgVal       = avgValueOptions[avgValIdx].value;
  const planCost     = planOptions[planIdx].cost;
  const grossRev     = deals * avgVal;
  const netProfit    = grossRev - planCost;
  const roiMult      = grossRev / planCost;
  const paybackDays  = planCost / (grossRev / 30);

  const periodLabel: Record<Period, string> = {
    "7d": "7 hari", "30d": "30 hari", "90d": "90 hari", "custom": "periode",
  };

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
              <BarChart3 size={15} style={{ color: "#4F46E5" }} />
            </div>
            <h1 style={{ color: "#0F1F3D", fontSize: "22px", fontWeight: 700 }}>
              Analytics &amp; ROI
            </h1>
          </div>
          <p style={{ color: "#64748B", fontSize: "14px", marginLeft: "44px" }}>
            Ukur nilai nyata dari setiap leads dan campaign Anda
          </p>
        </div>

        {/* Period filter */}
        <div
          className="flex items-center p-1"
          style={{ background: "#F1F5F9", borderRadius: "8px", border: "1px solid #E2E8F0" }}
        >
          {(["7d", "30d", "90d", "custom"] as Period[]).map((p) => {
            const labels: Record<Period, string> = {
              "7d": "7 Hari", "30d": "30 Hari", "90d": "90 Hari", "custom": "Custom",
            };
            const isActive = period === p;
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="px-3 py-1.5 transition-all"
                style={{
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? "#0F1F3D" : "transparent",
                  color: isActive ? "#FFFFFF" : "#64748B",
                  border: "none",
                }}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          {
            label: "Total Leads Diperoleh",
            value: kpi.leads.toLocaleString(),
            sub: `dalam ${periodLabel[period]} terakhir`,
            change: "+8.3% vs periode lalu",
            positive: true,
            icon: Users,
            accent: "#4F46E5",
            accentBg: "#EEF2FF",
          },
          {
            label: "Hot Leads",
            value: String(kpi.hot),
            sub: "Pain Score ≥ 85",
            change: "+15.4% vs periode lalu",
            positive: true,
            icon: Flame,
            accent: "#DC2626",
            accentBg: "#FEF2F2",
          },
          {
            label: "Conversion Rate",
            value: `${kpi.rate}%`,
            sub: "leads → deal closed",
            change: kpi.ratePos ? "+2.1% vs periode lalu" : "-1.4% vs periode lalu",
            positive: kpi.ratePos,
            icon: TrendingUp,
            accent: "#D97706",
            accentBg: "#FFFBEB",
          },
          {
            label: "Estimated Revenue",
            value: kpi.revenue,
            sub: "dari leads yang closing",
            change: "+18.7% vs periode lalu",
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

      {/* ── Charts Row 1: ComposedChart + Pie ───────────────────────────────── */}
      <div className="flex gap-5 mb-6">

        {/* Left: Leads vs Deal Closed (ComposedChart) */}
        <div
          className="flex-1 min-w-0"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}
        >
          <div
            className="flex items-center gap-2.5 px-5 py-4"
            style={{ borderBottom: "1px solid #F1F5F9" }}
          >
            <div
              className="w-7 h-7 flex items-center justify-center flex-shrink-0"
              style={{ background: "#EEF2FF", borderRadius: "8px" }}
            >
              <BarChart3 size={14} style={{ color: "#4F46E5" }} />
            </div>
            <div className="flex-1">
              <h2 style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 700, lineHeight: 1 }}>
                Leads vs Deal Closed
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>
                Tren perolehan leads dan konversi
              </p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <div style={{ width: 10, height: 10, borderRadius: 2, background: "rgba(79,70,229,0.72)" }} />
                <span style={{ color: "#64748B", fontSize: "11px" }}>Total Leads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div style={{ width: 12, height: 3, background: "#059669", borderRadius: 2 }} />
                <span style={{ color: "#64748B", fontSize: "11px" }}>Deal Closed</span>
              </div>
            </div>
          </div>
          <div style={{ padding: "20px 16px 12px" }}>
            <ResponsiveContainer width="100%" height={224}>
              <ComposedChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  axisLine={{ stroke: "#E2E8F0" }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <ReTooltip content={<ChartTooltip />} cursor={{ fill: "#F8FAFC" }} />
                <Bar
                  yAxisId="left"
                  dataKey="leads"
                  name="Total Leads"
                  fill="rgba(79,70,229,0.72)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={34}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="closed"
                  name="Deal Closed"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#059669", strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pie Chart – Distribusi Leads */}
        <div
          style={{
            width: "300px",
            flexShrink: 0,
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
          }}
        >
          <div
            className="flex items-center gap-2.5 px-5 py-4"
            style={{ borderBottom: "1px solid #F1F5F9" }}
          >
            <div
              className="w-7 h-7 flex items-center justify-center"
              style={{ background: "#FEF2F2", borderRadius: "8px" }}
            >
              <Flame size={14} style={{ color: "#DC2626" }} />
            </div>
            <div>
              <h2 style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 700, lineHeight: 1 }}>
                Distribusi Leads
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>
                Berdasarkan Pain Score
              </p>
            </div>
          </div>

          <div className="px-5 py-4">
            {/* Donut + center overlay */}
            <div className="relative">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={56}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    strokeWidth={0}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <ReTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const p = payload[0];
                      return (
                        <div
                          style={{
                            background: "#FFFFFF",
                            border: "1px solid #E2E8F0",
                            borderRadius: "8px",
                            padding: "8px 12px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: (p.payload as any).color,
                              }}
                            />
                            <span style={{ color: "#0F1F3D", fontSize: "12px", fontWeight: 600 }}>
                              {p.name}
                            </span>
                          </div>
                          <p
                            style={{
                              color: "#4F46E5",
                              fontSize: "14px",
                              fontWeight: 700,
                              marginTop: "4px",
                            }}
                          >
                            {p.value}% dari total
                          </p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label overlay */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              >
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#0F1F3D",
                    lineHeight: 1,
                  }}
                >
                  {kpi.leads.toLocaleString()}
                </span>
                <span style={{ fontSize: "10px", color: "#94A3B8", marginTop: "3px" }}>
                  total leads
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 mt-1">
              {pieData.map((seg) => (
                <div key={seg.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "3px",
                        background: seg.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: "#64748B", fontSize: "11.5px" }}>{seg.name}</span>
                  </div>
                  <span style={{ color: "#0F1F3D", fontSize: "12px", fontWeight: 600 }}>
                    {seg.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Area Chart: Tren Sentimen ────────────────────────────────────────── */}
      <div
        className="mb-6"
        style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}
      >
        <div
          className="flex items-center gap-2.5 px-5 py-4"
          style={{ borderBottom: "1px solid #F1F5F9" }}
        >
          <div
            className="w-7 h-7 flex items-center justify-center flex-shrink-0"
            style={{ background: "#ECFDF5", borderRadius: "8px" }}
          >
            <TrendingUp size={14} style={{ color: "#059669" }} />
          </div>
          <div className="flex-1">
            <h2 style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 700, lineHeight: 1 }}>
              Tren Sentimen Market
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>
              Pain Index vs Response Rate — 9 bulan terakhir
            </p>
          </div>
          <div className="flex items-center gap-5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  background: "rgba(79,70,229,0.25)",
                  border: "2px solid #4F46E5",
                }}
              />
              <span style={{ color: "#64748B", fontSize: "11px" }}>Pain Index</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  background: "rgba(5,150,105,0.2)",
                  border: "2px solid #059669",
                }}
              />
              <span style={{ color: "#64748B", fontSize: "11px" }}>Response Rate %</span>
            </div>
          </div>
        </div>
        <div style={{ padding: "20px 16px 12px" }}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="painGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4F46E5" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#059669" stopOpacity={0.14} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                axisLine={{ stroke: "#E2E8F0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <ReTooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="painIndex"
                name="Pain Index"
                stroke="#4F46E5"
                strokeWidth={2.5}
                fill="url(#painGrad)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: "#4F46E5" }}
              />
              <Area
                type="monotone"
                dataKey="responseRate"
                name="Response Rate %"
                stroke="#059669"
                strokeWidth={2.5}
                fill="url(#rateGrad)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: "#059669" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Campaign Table + ROI Calculator ─────────────────────────────────── */}
      <div className="flex gap-5">

        {/* Campaign Performance Table */}
        <div
          className="flex-1 min-w-0"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}
        >
          <div
            className="flex items-center gap-2.5 px-5 py-4"
            style={{ borderBottom: "1px solid #F1F5F9" }}
          >
            <div
              className="w-7 h-7 flex items-center justify-center"
              style={{ background: "#EEF2FF", borderRadius: "8px" }}
            >
              <BarChart3 size={14} style={{ color: "#4F46E5" }} />
            </div>
            <div>
              <h2 style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 700, lineHeight: 1 }}>
                Campaign Performance
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>
                Klik header kolom untuk sort
              </p>
            </div>
          </div>

          {/* Table Header */}
          <div
            className="grid items-center px-5 py-2.5"
            style={{
              gridTemplateColumns: "1fr 64px 100px 104px 108px 92px",
              gap: "8px",
              background: "#FAFBFC",
              borderBottom: "1px solid #F1F5F9",
            }}
          >
            <span
              style={{
                color: "#94A3B8",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.3px",
              }}
            >
              CAMPAIGN
            </span>
            {(
              [
                { key: "leads",     label: "LEADS"       },
                { key: "replyRate", label: "REPLY RATE"  },
                { key: "closed",    label: "DEAL CLOSED" },
                { key: "revenue",   label: "REVENUE"     },
              ] as { key: SortKey; label: string }[]
            ).map((col) => (
              <button
                key={col.key}
                onClick={() => handleSort(col.key)}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                style={{
                  color: sortKey === col.key ? "#4F46E5" : "#94A3B8",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.3px",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                {col.label}
                {sortKey === col.key ? (
                  sortDir === "asc"
                    ? <ChevronUp   size={11} style={{ color: "#4F46E5" }} />
                    : <ChevronDown size={11} style={{ color: "#4F46E5" }} />
                ) : (
                  <ChevronDown size={11} style={{ color: "#CBD5E1" }} />
                )}
              </button>
            ))}
            <span
              style={{
                color: "#94A3B8",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.3px",
              }}
            >
              STATUS
            </span>
          </div>

          {/* Table Rows */}
          {sortedCamps.map((camp, i) => {
            const sc = statusCfg[camp.status];
            return (
              <div
                key={camp.id}
                className="grid items-center px-5 py-3.5 transition-colors cursor-default"
                style={{
                  gridTemplateColumns: "1fr 64px 100px 104px 108px 92px",
                  gap: "8px",
                  borderBottom:
                    i < sortedCamps.length - 1 ? "1px solid #F1F5F9" : "none",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "#FAFBFC")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "transparent")
                }
              >
                {/* Name */}
                <p
                  style={{
                    color: "#0F1F3D",
                    fontSize: "13px",
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {camp.name}
                </p>

                {/* Leads */}
                <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>
                  {camp.leads}
                </span>

                {/* Reply Rate */}
                <div>
                  <span
                    style={{
                      color: camp.replyRate > 0 ? rateFill(camp.replyRate) : "#94A3B8",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {camp.replyRate > 0 ? `${camp.replyRate}%` : "—"}
                  </span>
                  {camp.replyRate > 0 && (
                    <div
                      style={{
                        width: "52px",
                        height: "3px",
                        background: "#F1F5F9",
                        borderRadius: "2px",
                        overflow: "hidden",
                        marginTop: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: `${camp.replyRate}%`,
                          height: "100%",
                          background: rateFill(camp.replyRate),
                          borderRadius: "2px",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Deal Closed */}
                <span
                  style={{
                    color: camp.closed > 0 ? "#0F1F3D" : "#94A3B8",
                    fontSize: "13px",
                    fontWeight: camp.closed > 0 ? 600 : 400,
                  }}
                >
                  {camp.closed > 0 ? camp.closed : "—"}
                </span>

                {/* Revenue */}
                <span
                  style={{
                    color: camp.revenue > 0 ? "#059669" : "#94A3B8",
                    fontSize: "12.5px",
                    fontWeight: camp.revenue > 0 ? 600 : 400,
                  }}
                >
                  {camp.revenue > 0 ? fmtRupiah(camp.revenue) : "—"}
                </span>

                {/* Status */}
                <span
                  className="flex items-center gap-1.5 px-2 py-1 w-fit"
                  style={{
                    background: sc.bg,
                    color: sc.color,
                    border: `1px solid ${sc.border}`,
                    borderRadius: "6px",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {statusIcon[camp.status]}
                  {camp.status}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── ROI Calculator ──────────────────────────────────────────────── */}
        <div
          style={{
            width: "340px",
            flexShrink: 0,
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
          }}
        >
          <div
            className="flex items-center gap-2.5 px-5 py-4"
            style={{ borderBottom: "1px solid #F1F5F9" }}
          >
            <div
              className="w-7 h-7 flex items-center justify-center"
              style={{ background: "#FFFBEB", borderRadius: "8px" }}
            >
              <Calculator size={14} style={{ color: "#D97706" }} />
            </div>
            <div>
              <h2 style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 700, lineHeight: 1 }}>
                ROI Calculator
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>
                Hitung keuntungan nyata Anda
              </p>
            </div>
          </div>

          <div className="px-5 py-5 flex flex-col gap-5">

            {/* ── Input: Deals Closed ─── */}
            <div>
              <label
                style={{
                  color: "#64748B",
                  fontSize: "12px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Berapa deal yang sudah closed?
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDeals(Math.max(1, deals - 1))}
                  className="w-8 h-8 flex items-center justify-center transition-colors flex-shrink-0"
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "6px",
                    color: "#0F1F3D",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#F1F5F9")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")
                  }
                >
                  <Minus size={13} />
                </button>
                <input
                  type="number"
                  min={1}
                  value={deals}
                  onChange={(e) =>
                    setDeals(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  style={{
                    flex: 1,
                    textAlign: "center",
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    color: "#0F1F3D",
                    fontSize: "20px",
                    fontWeight: 700,
                    padding: "8px",
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor = "#4F46E5")
                  }
                  onBlur={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")
                  }
                />
                <button
                  onClick={() => setDeals(deals + 1)}
                  className="w-8 h-8 flex items-center justify-center transition-colors flex-shrink-0"
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "6px",
                    color: "#0F1F3D",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#F1F5F9")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")
                  }
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            {/* ── Input: Avg Deal Value ─── */}
            <div>
              <label
                style={{
                  color: "#64748B",
                  fontSize: "12px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Rata-rata nilai per deal
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {avgValueOptions.map((opt, i) => {
                  const isActive = avgValIdx === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setAvgValIdx(i)}
                      style={{
                        padding: "7px 4px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: isActive ? 700 : 500,
                        background: isActive ? "#0F1F3D" : "#F8FAFC",
                        color: isActive ? "#FFFFFF" : "#64748B",
                        border: isActive
                          ? "1.5px solid #0F1F3D"
                          : "1px solid #E2E8F0",
                        transition: "all 0.15s",
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Input: Plan ─── */}
            <div>
              <label
                style={{
                  color: "#64748B",
                  fontSize: "12px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Paket HelicoLeads
              </label>
              <div className="flex gap-2">
                {planOptions.map((opt, i) => {
                  const isActive = planIdx === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setPlanIdx(i)}
                      className="flex-1"
                      style={{
                        padding: "8px 4px",
                        borderRadius: "6px",
                        fontSize: "11.5px",
                        fontWeight: isActive ? 600 : 500,
                        background: isActive ? "#EEF2FF" : "#F8FAFC",
                        color: isActive ? "#4F46E5" : "#64748B",
                        border: isActive
                          ? "1.5px solid #C7D2FE"
                          : "1px solid #E2E8F0",
                        transition: "all 0.15s",
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Divider ─── */}
            <div style={{ borderTop: "1px solid #F1F5F9" }} />

            {/* ── Output: Numbers ─── */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span style={{ color: "#64748B", fontSize: "12px" }}>Gross Revenue</span>
                <span style={{ color: "#0F1F3D", fontSize: "14px", fontWeight: 700 }}>
                  {fmtRupiah(grossRev)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: "#64748B", fontSize: "12px" }}>Biaya Platform / bln</span>
                <span style={{ color: "#94A3B8", fontSize: "12.5px", fontWeight: 500 }}>
                  − {fmtRupiah(planCost)}
                </span>
              </div>
              <div style={{ borderTop: "1px dashed #E2E8F0", margin: "2px 0" }} />
              <div className="flex items-center justify-between">
                <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>
                  Net Profit
                </span>
                <span
                  style={{
                    color: netProfit > 0 ? "#059669" : "#DC2626",
                    fontSize: "17px",
                    fontWeight: 700,
                  }}
                >
                  {fmtRupiah(netProfit)}
                </span>
              </div>
            </div>

            {/* ── Output: ROI Highlight Cards ─── */}
            <div className="grid grid-cols-2 gap-2">
              <div
                className="flex flex-col items-center py-3.5 px-2"
                style={{ background: "#EEF2FF", borderRadius: "8px" }}
              >
                <span
                  style={{
                    color: "#6366F1",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    marginBottom: "5px",
                  }}
                >
                  ROI MULTIPLIER
                </span>
                <span
                  style={{
                    color: "#4F46E5",
                    fontSize: "28px",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {roiMult.toFixed(1)}x
                </span>
              </div>
              <div
                className="flex flex-col items-center py-3.5 px-2"
                style={{ background: "#F0FDF4", borderRadius: "8px" }}
              >
                <span
                  style={{
                    color: "#16A34A",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    marginBottom: "5px",
                  }}
                >
                  PAYBACK PERIOD
                </span>
                <div className="flex items-baseline gap-1">
                  <span
                    style={{
                      color: "#059669",
                      fontSize: "28px",
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {paybackDays < 1 ? "<1" : Math.ceil(paybackDays)}
                  </span>
                  <span style={{ color: "#16A34A", fontSize: "12px", fontWeight: 600 }}>
                    hari
                  </span>
                </div>
              </div>
            </div>

            {/* ── Insight note ─── */}
            <div
              className="flex items-start gap-2 p-3"
              style={{
                background: "#FAFBFC",
                border: "1px solid #F1F5F9",
                borderRadius: "8px",
                borderLeft: "3px solid #4F46E5",
              }}
            >
              <ArrowUpRight size={13} style={{ color: "#4F46E5", flexShrink: 0, marginTop: "1px" }} />
              <p style={{ color: "#64748B", fontSize: "11.5px", lineHeight: 1.5 }}>
                Dengan <strong style={{ color: "#0F1F3D" }}>{deals} deal closed</strong> dan rata-rata{" "}
                <strong style={{ color: "#0F1F3D" }}>{avgValueOptions[avgValIdx].label}</strong> per deal,
                investasi platform Anda sudah kembali dalam{" "}
                <strong style={{ color: "#4F46E5" }}>
                  {paybackDays < 1 ? "kurang dari 1 hari" : `${Math.ceil(paybackDays)} hari`}
                </strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
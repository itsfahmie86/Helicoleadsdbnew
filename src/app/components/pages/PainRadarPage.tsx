import { usePainRadar } from "../../../lib/api";

export function PainRadarPage() {
  const { leads, total, date, loading } = usePainRadar({ limit: 30 });

  if (loading) return (
    <div className="p-8">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-xl mb-3 animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6">
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#0F172A" }}>Pain Radar</h1>
        <p style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
          {total} bisnis dipantau · Snapshot {date || "hari ini"}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {leads.length === 0 && (
          <div className="text-center py-20" style={{ color: "#94A3B8" }}>
            <p style={{ fontSize: 14 }}>Belum ada data Pain Radar.</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Jalankan Pain Radar Engine di n8n terlebih dahulu.</p>
          </div>
        )}
        {(leads as any[]).map((lead, i) => {
          const delta = lead.score_delta || 0;
          const trendColor = delta >= 15 ? "#DC2626" : delta >= 8 ? "#D97706" : "#94A3B8";
          const trendIcon = delta >= 15 ? "↑↑" : delta >= 8 ? "↑" : "→";
          return (
            <div key={lead.place_id || i} style={{
              background: "#fff", border: "1px solid #E2E8F0",
              borderRadius: 12, padding: "14px 18px",
              display: "flex", alignItems: "center", gap: 16
            }}>
              <div style={{ width: 40, textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: trendColor }}>{trendIcon}</div>
                <div style={{ fontSize: 11, color: trendColor }}>+{delta}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{lead.name}</div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                  {lead.city} · ⭐ {lead.rating} · {lead.pain_count} pain
                  {lead.is_new_this_week && <span style={{ color: "#16A34A", marginLeft: 6 }}>· baru</span>}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: delta >= 8 ? "#DC2626" : "#2563EB" }}>
                  {lead.lead_score}
                </div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>{lead.trend_label || "Stabil"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

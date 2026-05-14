export function MorningBriefPage() {
  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: "#0F172A" }}>Morning Brief</h1>
      <p style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Laporan harian personal dikirim jam 07.00 WIB</p>
      <div style={{ marginTop: 32, textAlign: "center", color: "#94A3B8" }}>
        <p style={{ fontSize: 14 }}>Brief hari ini belum tersedia.</p>
        <p style={{ fontSize: 12, marginTop: 4 }}>Aktifkan Morning Intelligence Brief di n8n.</p>
      </div>
    </div>
  );
}

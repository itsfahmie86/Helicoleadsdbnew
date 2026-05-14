export function CampaignsPage() {
  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: "#0F172A" }}>Campaign</h1>
      <p style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Kelola outreach campaign ke leads</p>
      <div style={{ marginTop: 32, textAlign: "center", color: "#94A3B8" }}>
        <p style={{ fontSize: 14 }}>Belum ada campaign aktif.</p>
        <p style={{ fontSize: 12, marginTop: 4 }}>Pilih leads dari My Leads dan mulai campaign baru.</p>
      </div>
    </div>
  );
}

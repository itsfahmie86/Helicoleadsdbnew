import { useState, useEffect } from "react";
import { MessageSquare, Zap, Copy, Check, ChevronRight } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { api } from "../../../lib/api";

const MODES = [
  { key: "agensi", label: "Agensi Digital", desc: "Website, SEO, Google Ads" },
  { key: "konsultan", label: "Konsultan", desc: "Pelatihan, SOP, Operasional" },
  { key: "produsen", label: "Produsen / Distributor", desc: "Kerjasama produk" },
  { key: "reseller", label: "Reseller Tools", desc: "Software & otomasi" },
];

export function DraftAIPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [mode, setMode] = useState("agensi");
  const [channel, setChannel] = useState("whatsapp");
  const [draft, setDraft] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("google_place_leads")
      .select("place_id,name,city,niche,lead_score,badge,primary_pain_category,rating")
      .order("lead_score", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        const list = data || [];
        setLeads(list);
        if (list.length > 0) setSelected(list[0]);
        setLoading(false);
      });
  }, []);

  const generate = async () => {
    if (!selected) return;
    setGenerating(true);
    setDraft("");
    try {
      const result: any = await api.generateDraft({
        place_id: selected.place_id,
        mode,
        channel,
        sender_name: "Tim Sales",
        sender_company: "Perusahaan Kami",
      });
      setDraft(result?.draft || "Gagal generate draft. Coba lagi.");
    } catch {
      setDraft("Gagal generate draft. Coba lagi.");
    } finally {
      setGenerating(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen p-5 md:p-6 lg:p-8" style={{ background: "#F8FAFC" }}>
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ color: "#0F1F3D", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
          Draft AI
        </h1>
        <p style={{ color: "#64748B", fontSize: 14 }}>
          Generate pesan outreach personal berbasis pain point bisnis target
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT — Pilih Lead + Setting */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Mode */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 16px" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Mode Persona</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {MODES.map(m => (
                <button key={m.key} onClick={() => setMode(m.key)}
                  style={{
                    padding: "10px 12px", borderRadius: 8, textAlign: "left", cursor: "pointer",
                    border: mode === m.key ? "1.5px solid #4F46E5" : "1px solid #E2E8F0",
                    background: mode === m.key ? "#EEF2FF" : "#FFFFFF",
                  }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: mode === m.key ? "#4F46E5" : "#0F1F3D" }}>{m.label}</p>
                  <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Channel */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 16px" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Channel</p>
            <div style={{ display: "flex", gap: 8 }}>
              {["whatsapp", "email"].map(c => (
                <button key={c} onClick={() => setChannel(c)}
                  style={{
                    padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13,
                    border: channel === c ? "1px solid #E2E8F0" : "1px solid #E2E8F0",
                    background: channel === c ? "#FFFFFF" : "transparent",
                    color: channel === c ? "#4F46E5" : "#64748B", fontWeight: channel === c ? 600 : 400,
                  }}>
                  {c === "whatsapp" ? "WhatsApp" : "Email"}
                </button>
              ))}
            </div>
          </div>

          {/* Pilih Lead */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 16px", flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Pilih Lead Target</p>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[...Array(4)].map((_,i) => <div key={i} style={{ height: 44, background: "#F1F5F9", borderRadius: 8 }} />)}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 280, overflowY: "auto" }}>
                {leads.map(lead => (
                  <button key={lead.place_id} onClick={() => { setSelected(lead); setDraft(""); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                      borderRadius: 8, cursor: "pointer", textAlign: "left",
                      border: selected?.place_id === lead.place_id ? "1.5px solid #4F46E5" : "1px solid #E2E8F0",
                      background: selected?.place_id === lead.place_id ? "#EEF2FF" : "#FFFFFF",
                    }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: selected?.place_id === lead.place_id ? "#FEF2F2" : "#EEF2FF",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700,
                      color: selected?.place_id === lead.place_id ? "#DC2626" : "#4F46E5",
                    }}>
                      {(lead.name||"XX").split(" ").map((w:string)=>w[0]).join("").substring(0,2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "#0F1F3D", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name}</p>
                      <p style={{ fontSize: 11, color: "#94A3B8" }}>{lead.city} · {lead.niche}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      {lead.badge === 'hot' || lead.badge === 'priority' ? (
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>Hot</span>
                      ) : lead.badge === 'warm' ? (
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: "#FFFBEB", color: "#D97706", border: "1px solid #FDE68A" }}>Warm</span>
                      ) : null}
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: lead.lead_score >= 70 ? "#DC2626" : lead.lead_score >= 50 ? "#D97706" : "#2563EB"
                      }}>{lead.lead_score}</span>
                    </div>
                    <ChevronRight size={14} style={{ color: "#CBD5E1", flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button onClick={generate} disabled={!selected || generating}
            style={{
              padding: "13px", borderRadius: 10, border: "none", cursor: selected ? "pointer" : "not-allowed",
              background: selected ? "#DC2626" : "#F1F5F9",
              color: selected ? "#fff" : "#94A3B8",
              fontSize: 14, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
            <Zap size={15} />
            {generating ? "Generating..." : "Generate Draft"}
          </button>
        </div>

        {/* RIGHT — Output Draft */}
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MessageSquare size={16} style={{ color: "#DC2626" }} />
              <p style={{ fontSize: 13, fontWeight: 600, color: "#0F1F3D" }}>
                {selected ? `Draft untuk ${selected.name}` : "Draft akan muncul di sini"}
              </p>
            </div>
            {draft && (
              <button onClick={copy} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#F8FAFC", cursor: "pointer", fontSize: 12, color: "#64748B" }}>
                {copied ? <Check size={13} style={{ color: "#059669" }} /> : <Copy size={13} />}
                {copied ? "Tersalin!" : "Copy"}
              </button>
            )}
          </div>

          {generating ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #FEF2F2", borderTop: "3px solid #DC2626", animation: "spin 0.8s linear infinite" }} />
              <p style={{ fontSize: 13, color: "#94A3B8" }}>Generating draft...</p>
            </div>
          ) : draft ? (
            <textarea readOnly value={draft}
              style={{
                flex: 1, minHeight: 400, padding: 14, borderRadius: 8,
                border: "1px solid #E2E8F0", background: "#F8FAFC",
                fontSize: 14, lineHeight: 1.7, color: "#0F1F3D",
                resize: "none", fontFamily: "inherit",
              }} />
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
              <MessageSquare size={36} style={{ color: "#E2E8F0" }} />
              <p style={{ fontSize: 13, color: "#94A3B8" }}>Pilih lead dan klik Generate Draft</p>
              <p style={{ fontSize: 12, color: "#CBD5E1" }}>Draft akan disesuaikan dengan pain point bisnis target</p>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

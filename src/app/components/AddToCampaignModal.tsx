import { useState, useMemo, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Search,
  X,
  Check,
  Plus,
  Users,
  Zap,
  CheckCircle2,
} from "lucide-react";

// ─── Campaign Mock Data ───────────────────────────────────────────────────────
export const CAMPAIGNS = [
  { id: 1, name: "Outreach Kuliner Bandung",      leads: 24, status: "active" as const },
  { id: 2, name: "Follow-up Laundry Jakarta",      leads: 12, status: "active" as const },
  { id: 3, name: "Klinik & Kesehatan Q3",          leads: 8,  status: "draft"  as const },
  { id: 4, name: "Otomotif Depok Blast",           leads: 31, status: "active" as const },
  { id: 5, name: "Salon & Kecantikan Pilot",       leads: 5,  status: "draft"  as const },
  { id: 6, name: "Properti Jakarta Selatan",       leads: 17, status: "active" as const },
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface AddToCampaignModalProps {
  open: boolean;
  onClose: () => void;
  leadName?: string;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ visible }: { visible: boolean }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`,
        zIndex: 80,
        background: "#0F1F3D",
        color: "#FFFFFF",
        padding: "11px 20px",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity 0.2s ease, transform 0.2s ease",
        whiteSpace: "nowrap",
      }}
    >
      <CheckCircle2 size={15} style={{ color: "#4ADE80", flexShrink: 0 }} />
      Lead berhasil ditambahkan ke campaign
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AddToCampaignModal({
  open,
  onClose,
  leadName,
}: AddToCampaignModalProps) {
  const [search,    setSearch]    = useState("");
  const [selected,  setSelected]  = useState<number[]>([]);
  const [showToast, setShowToast] = useState(false);

  // Reset state when closed
  useEffect(() => {
    if (!open) {
      setSearch("");
      setSelected([]);
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!search.trim()) return CAMPAIGNS;
    return CAMPAIGNS.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const toggle = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSubmit = () => {
    if (selected.length === 0) return;
    onClose();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <DialogPrimitive.Root
        open={open}
        onOpenChange={(v) => !v && onClose()}
      >
        <DialogPrimitive.Portal>
          {/* Overlay */}
          <DialogPrimitive.Overlay
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 60,
              background: "rgba(15, 31, 61, 0.4)",
            }}
          />

          {/* Dialog Content */}
          <DialogPrimitive.Content
            aria-describedby="campaign-modal-desc"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 61,
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "480px",
              maxHeight: "85vh",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div
              style={{
                padding: "20px 20px 16px",
                borderBottom: "1px solid #F1F5F9",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "12px",
                flexShrink: 0,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      background: "#EEF2FF",
                      border: "1px solid #C7D2FE",
                      borderRadius: "7px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Zap size={14} style={{ color: "#4F46E5" }} />
                  </div>
                  <DialogPrimitive.Title
                    style={{
                      color: "#0F1F3D",
                      fontSize: "16px",
                      fontWeight: 700,
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    Tambah ke Campaign
                  </DialogPrimitive.Title>
                </div>
                <p
                  id="campaign-modal-desc"
                  style={{
                    color: "#64748B",
                    fontSize: "12px",
                    margin: 0,
                    paddingLeft: "38px",
                    lineHeight: 1.4,
                  }}
                >
                  {leadName
                    ? `Tambahkan "${leadName}" ke campaign yang aktif`
                    : "Pilih campaign yang ingin ditambahkan lead ini"}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  width: 28,
                  height: 28,
                  flexShrink: 0,
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={13} style={{ color: "#64748B" }} />
              </button>
            </div>

            {/* ── Search ──────────────────────────────────────────────────── */}
            <div
              style={{ padding: "14px 20px 10px", flexShrink: 0 }}
            >
              <div style={{ position: "relative" }}>
                <Search
                  size={13}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94A3B8",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder="Cari campaign..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    paddingLeft: "32px",
                    paddingRight: "12px",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#0F1F3D",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#A5B4FC";
                    e.currentTarget.style.background  = "#FFFFFF";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#E2E8F0";
                    e.currentTarget.style.background  = "#F8FAFC";
                  }}
                />
              </div>
            </div>

            {/* ── Campaign List ────────────────────────────────────────────── */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "4px 20px 0",
              }}
            >
              {filtered.length === 0 ? (
                <p
                  style={{
                    color: "#94A3B8",
                    fontSize: "12px",
                    textAlign: "center",
                    padding: "28px 0",
                  }}
                >
                  Campaign tidak ditemukan
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {filtered.map((c) => {
                    const isSelected = selected.includes(c.id);
                    const isActive   = c.status === "active";
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggle(c.id)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "11px 13px",
                          background: isSelected ? "#F5F3FF" : "#FFFFFF",
                          border: `1px solid ${isSelected ? "#A5B4FC" : "#E2E8F0"}`,
                          borderRadius: "8px",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "border-color 0.15s, background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            (e.currentTarget as HTMLElement).style.borderColor =
                              "#C7D2FE";
                            (e.currentTarget as HTMLElement).style.background =
                              "#FAFBFF";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            (e.currentTarget as HTMLElement).style.borderColor =
                              "#E2E8F0";
                            (e.currentTarget as HTMLElement).style.background =
                              "#FFFFFF";
                          }
                        }}
                      >
                        {/* Checkbox */}
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            flexShrink: 0,
                            border: `1.5px solid ${
                              isSelected ? "#4F46E5" : "#CBD5E1"
                            }`,
                            borderRadius: "4px",
                            background: isSelected ? "#4F46E5" : "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background 0.15s, border-color 0.15s",
                          }}
                        >
                          {isSelected && (
                            <Check
                              size={11}
                              style={{ color: "#FFFFFF" }}
                              strokeWidth={2.5}
                            />
                          )}
                        </div>

                        {/* Campaign icon */}
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            flexShrink: 0,
                            background: isActive ? "#EEF2FF" : "#F8FAFC",
                            border: `1px solid ${
                              isActive ? "#C7D2FE" : "#E2E8F0"
                            }`,
                            borderRadius: "7px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Zap
                            size={14}
                            style={{
                              color: isActive ? "#4F46E5" : "#94A3B8",
                            }}
                          />
                        </div>

                        {/* Name + leads count */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              color: "#0F1F3D",
                              fontSize: "13px",
                              fontWeight: 600,
                              margin: 0,
                              marginBottom: "2px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {c.name}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <Users size={10} style={{ color: "#94A3B8" }} />
                            <span
                              style={{ color: "#64748B", fontSize: "11px" }}
                            >
                              {c.leads} leads
                            </span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <span
                          style={{
                            padding: "2px 8px",
                            background: isActive ? "#EEF2FF" : "#F8FAFC",
                            border: `1px solid ${
                              isActive ? "#C7D2FE" : "#E2E8F0"
                            }`,
                            color: isActive ? "#4F46E5" : "#94A3B8",
                            fontSize: "10px",
                            fontWeight: 600,
                            borderRadius: "4px",
                            flexShrink: 0,
                            letterSpacing: "0.2px",
                          }}
                        >
                          {isActive ? "Active" : "Draft"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Buat Campaign Baru */}
              <button
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 14px",
                  background: "#FAFBFF",
                  border: "1.5px dashed #C7D2FE",
                  borderRadius: "8px",
                  color: "#4F46E5",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  margin: "10px 0 16px",
                  transition: "background 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "#EEF2FF";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#A5B4FC";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "#FAFBFF";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#C7D2FE";
                }}
              >
                <Plus size={13} />
                Buat Campaign Baru
              </button>
            </div>

            {/* ── Footer ──────────────────────────────────────────────────── */}
            <div
              style={{
                padding: "14px 20px",
                borderTop: "1px solid #F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                flexShrink: 0,
              }}
            >
              {/* Selection count */}
              <p style={{ color: "#94A3B8", fontSize: "12px", margin: 0 }}>
                {selected.length > 0 ? (
                  <>
                    <span
                      style={{ color: "#4F46E5", fontWeight: 700 }}
                    >
                      {selected.length}
                    </span>{" "}
                    campaign dipilih
                  </>
                ) : (
                  "Belum ada yang dipilih"
                )}
              </p>

              <div style={{ display: "flex", gap: "8px" }}>
                {/* Cancel */}
                <button
                  onClick={onClose}
                  style={{
                    padding: "8px 16px",
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "6px",
                    color: "#64748B",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "#F8FAFC")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "#FFFFFF")
                  }
                >
                  Batal
                </button>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={selected.length === 0}
                  style={{
                    padding: "8px 20px",
                    background: selected.length === 0 ? "#E2E8F0" : "#4F46E5",
                    border: "none",
                    borderRadius: "6px",
                    color: selected.length === 0 ? "#94A3B8" : "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: selected.length === 0 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (selected.length > 0)
                      (e.currentTarget as HTMLElement).style.background =
                        "#4338CA";
                  }}
                  onMouseLeave={(e) => {
                    if (selected.length > 0)
                      (e.currentTarget as HTMLElement).style.background =
                        "#4F46E5";
                  }}
                >
                  <CheckCircle2 size={13} />
                  Tambahkan
                </button>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      <Toast visible={showToast} />
    </>
  );
}

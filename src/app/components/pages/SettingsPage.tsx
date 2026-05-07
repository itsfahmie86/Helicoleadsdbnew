import { useState } from "react";
import {
  User,
  Building2,
  CreditCard,
  Bell,
  Shield,
  Code2,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  LogOut,
  Key,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Mail,
  Camera,
  ChevronRight,
  Users,
  Download,
  Globe,
  Lock,
  Zap,
  MessageSquare,
  Activity,
  Star,
  CreditCard as CardIcon,
  Settings,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "account" | "workspace" | "billing" | "notifications" | "compliance" | "api";

// ─── Nav Items ────────────────────────────────────────────────────────────────
const navItems: { key: Tab; label: string; icon: React.ElementType; desc: string }[] = [
  { key: "account",       label: "Akun Saya",         icon: User,        desc: "Profil & keamanan"    },
  { key: "workspace",     label: "Workspace",          icon: Building2,   desc: "Tim & kolaborasi"     },
  { key: "billing",       label: "Billing & Paket",    icon: CreditCard,  desc: "Langganan & kredit"   },
  { key: "notifications", label: "Notifikasi",          icon: Bell,        desc: "Alert & reminder"     },
  { key: "compliance",    label: "Compliance & Legal",  icon: Shield,      desc: "PDP & audit log"      },
  { key: "api",           label: "API & Integrasi",     icon: Code2,       desc: "Developer tools"      },
];

// ─── Small Reusable Components ────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: "40px",
        height: "22px",
        borderRadius: "11px",
        background: checked ? "#4F46E5" : "#E2E8F0",
        border: "none",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
        transition: "background 0.2s",
      }}
    >
      <div
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: "#FFFFFF",
          position: "absolute",
          top: "3px",
          left: checked ? "21px" : "3px",
          transition: "left 0.2s ease",
        }}
      />
    </button>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  helper,
  suffix,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  helper?: string;
  suffix?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        style={{
          color: "#64748B",
          fontSize: "12px",
          fontWeight: 500,
          display: "block",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: suffix ? "9px 40px 9px 12px" : "9px 12px",
            border: `1px solid ${focused ? "#4F46E5" : "#E2E8F0"}`,
            borderRadius: "8px",
            color: disabled ? "#94A3B8" : "#0F1F3D",
            fontSize: "13px",
            background: disabled ? "#F8FAFC" : "#FFFFFF",
            outline: "none",
            transition: "border-color 0.15s",
          }}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
        )}
      </div>
      {helper && (
        <p style={{ color: "#94A3B8", fontSize: "11px", marginTop: "4px" }}>{helper}</p>
      )}
    </div>
  );
}

function SaveBtn({
  saved,
  onSave,
  label = "Simpan Perubahan",
}: {
  saved: boolean;
  onSave: () => void;
  label?: string;
}) {
  return (
    <button
      onClick={onSave}
      className="flex items-center gap-2 px-4 py-2.5 transition-all"
      style={{
        background: saved ? "#059669" : "#0F1F3D",
        color: "#FFFFFF",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
        minWidth: "148px",
        transition: "background 0.2s",
      }}
    >
      {saved ? (
        <>
          <Check size={14} />
          Tersimpan!
        </>
      ) : (
        label
      )}
    </button>
  );
}

function CardWrap({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

function CardHead({
  icon: Icon,
  color,
  bg,
  title,
  desc,
  action,
}: {
  icon: React.ElementType;
  color: string;
  bg: string;
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-2.5 px-5 py-4"
      style={{ borderBottom: "1px solid #F1F5F9" }}
    >
      <div
        className="w-7 h-7 flex items-center justify-center flex-shrink-0"
        style={{ background: bg, borderRadius: "8px" }}
      >
        <Icon size={14} style={{ color }} />
      </div>
      <div className="flex-1">
        <h3 style={{ color: "#0F1F3D", fontSize: "15px", fontWeight: 700, lineHeight: 1 }}>
          {title}
        </h3>
        <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>{desc}</p>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ─── Tab: Akun Saya ───────────────────────────────────────────────────────────
function AccountSection() {
  const [name,        setName]        = useState("Rizky Dwi");
  const [email,       setEmail]       = useState("rizky@helicoads.com");
  const [profileSaved, setProfileSaved] = useState(false);

  const [curPw,     setCurPw]     = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurPw, setShowCurPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwSaved,   setPwSaved]   = useState(false);

  function handleSaveProfile() {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }
  function handleSavePw() {
    if (!curPw || !newPw || newPw !== confirmPw) return;
    setPwSaved(true);
    setCurPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Profile Card ── */}
      <CardWrap>
        <CardHead icon={User} color="#4F46E5" bg="#EEF2FF" title="Profil Saya" desc="Informasi akun dan identitas Anda" />
        <div className="px-5 py-5">
          {/* Avatar row */}
          <div className="flex items-center gap-4 mb-6 pb-5" style={{ borderBottom: "1px solid #F1F5F9" }}>
            <div className="relative flex-shrink-0">
              <div
                className="w-16 h-16 flex items-center justify-center"
                style={{
                  background: "#0F1F3D",
                  borderRadius: "50%",
                  color: "#FFFFFF",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                RD
              </div>
              <button
                className="absolute -bottom-0.5 -right-0.5 w-6 h-6 flex items-center justify-center transition-colors"
                style={{
                  background: "#FFFFFF",
                  border: "1.5px solid #E2E8F0",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "#F1F5F9")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "#FFFFFF")
                }
              >
                <Camera size={10} style={{ color: "#64748B" }} />
              </button>
            </div>
            <div>
              <p style={{ color: "#0F1F3D", fontSize: "16px", fontWeight: 700 }}>{name}</p>
              <p style={{ color: "#64748B", fontSize: "13px", marginTop: "2px" }}>{email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="px-2 py-0.5"
                  style={{
                    background: "#EEF2FF",
                    color: "#4F46E5",
                    fontSize: "11px",
                    fontWeight: 600,
                    borderRadius: "4px",
                    border: "1px solid #C7D2FE",
                  }}
                >
                  Admin
                </span>
                <span
                  className="px-2 py-0.5"
                  style={{
                    background: "#ECFDF5",
                    color: "#059669",
                    fontSize: "11px",
                    fontWeight: 600,
                    borderRadius: "4px",
                    border: "1px solid #A7F3D0",
                  }}
                >
                  ✓ Terverifikasi
                </span>
              </div>
            </div>
          </div>

          {/* Edit form */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <InputField
              label="Nama Lengkap"
              value={name}
              onChange={setName}
              placeholder="Nama lengkap Anda"
            />
            <InputField
              label="Alamat Email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="email@domain.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <InputField
              label="Jabatan / Role"
              value="Sales Manager"
              placeholder="e.g. Sales Manager"
            />
            <InputField
              label="Nomor WhatsApp"
              value="+62 812 3456 7890"
              placeholder="+62 8xx xxxx xxxx"
            />
          </div>
          <div className="flex justify-end">
            <SaveBtn saved={profileSaved} onSave={handleSaveProfile} />
          </div>
        </div>
      </CardWrap>

      {/* ── Ubah Password ── */}
      <CardWrap>
        <CardHead icon={Lock} color="#D97706" bg="#FFFBEB" title="Ubah Password" desc="Pastikan menggunakan password yang kuat" />
        <div className="px-5 py-5 flex flex-col gap-4">
          <InputField
            label="Password Saat Ini"
            value={curPw}
            onChange={setCurPw}
            type={showCurPw ? "text" : "password"}
            placeholder="••••••••••"
            suffix={
              <button
                onClick={() => setShowCurPw((v) => !v)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {showCurPw
                  ? <EyeOff size={14} style={{ color: "#94A3B8" }} />
                  : <Eye    size={14} style={{ color: "#94A3B8" }} />}
              </button>
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Password Baru"
              value={newPw}
              onChange={setNewPw}
              type={showNewPw ? "text" : "password"}
              placeholder="Min. 8 karakter"
              suffix={
                <button
                  onClick={() => setShowNewPw((v) => !v)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  {showNewPw
                    ? <EyeOff size={14} style={{ color: "#94A3B8" }} />
                    : <Eye    size={14} style={{ color: "#94A3B8" }} />}
                </button>
              }
            />
            <InputField
              label="Konfirmasi Password Baru"
              value={confirmPw}
              onChange={setConfirmPw}
              type="password"
              placeholder="Ulangi password baru"
            />
          </div>
          {confirmPw && newPw !== confirmPw && (
            <div className="flex items-center gap-1.5">
              <AlertCircle size={12} style={{ color: "#DC2626" }} />
              <span style={{ color: "#DC2626", fontSize: "12px" }}>Password tidak cocok</span>
            </div>
          )}
          <div className="flex justify-end">
            <SaveBtn
              saved={pwSaved}
              onSave={handleSavePw}
              label="Simpan Password"
            />
          </div>
        </div>
      </CardWrap>

      {/* ── Sesi Aktif ── */}
      <CardWrap>
        <CardHead icon={Activity} color="#0284C7" bg="#E0F2FE" title="Sesi Aktif" desc="Perangkat yang sedang login ke akun Anda" />
        <div>
          {[
            { device: "Chrome — MacBook Pro", location: "Jakarta, Indonesia", time: "Saat ini · aktif", current: true },
            { device: "Safari — iPhone 14 Pro", location: "Jakarta, Indonesia", time: "2 jam lalu", current: false },
          ].map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: i === 0 ? "1px solid #F1F5F9" : "none" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                  style={{
                    background: s.current ? "#EEF2FF" : "#F8FAFC",
                    borderRadius: "8px",
                  }}
                >
                  <Globe size={14} style={{ color: s.current ? "#4F46E5" : "#94A3B8" }} />
                </div>
                <div>
                  <p style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 500 }}>{s.device}</p>
                  <p style={{ color: "#94A3B8", fontSize: "11.5px", marginTop: "1px" }}>
                    {s.location} · {s.time}
                  </p>
                </div>
              </div>
              {s.current ? (
                <span
                  style={{
                    background: "#F0FDF4",
                    color: "#16A34A",
                    border: "1px solid #BBF7D0",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  Perangkat ini
                </span>
              ) : (
                <button
                  style={{
                    background: "none",
                    border: "1px solid #E2E8F0",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#64748B",
                    padding: "4px 12px",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#FCA5A5";
                    (e.currentTarget as HTMLElement).style.color = "#DC2626";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0";
                    (e.currentTarget as HTMLElement).style.color = "#64748B";
                  }}
                >
                  Cabut Sesi
                </button>
              )}
            </div>
          ))}
        </div>
      </CardWrap>

      {/* ── Danger Zone ── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #FCA5A5",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #FEE2E2" }}>
          <h3 style={{ color: "#DC2626", fontSize: "14px", fontWeight: 700 }}>Zona Berbahaya</h3>
          <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>
            Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan
          </p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>Keluar dari Akun</p>
            <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>
              Sesi Anda akan diakhiri di semua perangkat
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 transition-all"
            style={{
              background: "#FEF2F2",
              color: "#DC2626",
              border: "1px solid #FCA5A5",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#DC2626";
              (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#FEF2F2";
              (e.currentTarget as HTMLElement).style.color = "#DC2626";
            }}
          >
            <LogOut size={14} />
            Logout Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Workspace ───────────────────────────────────────────────────────────
function WorkspaceSection() {
  const [workspaces, setWorkspaces] = useState([
    { id: 1, name: "Sales Team Jakarta",  members: 4, plan: "Growth", active: true,  created: "12 Jan 2026" },
    { id: 2, name: "Marketing Team",       members: 2, plan: "Starter", active: false, created: "3 Mar 2026"  },
    { id: 3, name: "Enterprise Ops",       members: 6, plan: "Pro",    active: false, created: "20 Apr 2026" },
  ]);
  const [creating, setCreating]     = useState(false);
  const [newName,  setNewName]      = useState("");

  function activate(id: number) {
    setWorkspaces((ws) => ws.map((w) => ({ ...w, active: w.id === id })));
  }
  function create() {
    if (!newName.trim()) return;
    setWorkspaces((ws) => [
      ...ws,
      { id: Date.now(), name: newName.trim(), members: 1, plan: "Starter", active: false, created: "5 Mei 2026" },
    ]);
    setNewName(""); setCreating(false);
  }

  const planColors: Record<string, { bg: string; color: string; border: string }> = {
    Starter: { bg: "#F8FAFC", color: "#64748B", border: "#E2E8F0" },
    Growth:  { bg: "#EEF2FF", color: "#4F46E5", border: "#C7D2FE" },
    Pro:     { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  };

  return (
    <div className="flex flex-col gap-5">
      <CardWrap>
        <CardHead
          icon={Building2}
          color="#4F46E5"
          bg="#EEF2FF"
          title="Workspace Saya"
          desc="Kelola tim dan ruang kerja Anda"
          action={
            <button
              onClick={() => setCreating((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 transition-colors"
              style={{
                background: "#0F1F3D",
                color: "#FFFFFF",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#1a2f52")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#0F1F3D")
              }
            >
              <Plus size={13} />
              Buat Workspace
            </button>
          }
        />

        {/* Create new workspace inline */}
        {creating && (
          <div
            className="px-5 py-4 flex items-center gap-3"
            style={{ background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}
          >
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nama workspace baru..."
              autoFocus
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid #4F46E5",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#0F1F3D",
                background: "#FFFFFF",
                outline: "none",
              }}
              onKeyDown={(e) => e.key === "Enter" && create()}
            />
            <button
              onClick={create}
              style={{
                background: "#4F46E5",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Buat
            </button>
            <button
              onClick={() => setCreating(false)}
              style={{
                background: "none",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "13px",
                color: "#64748B",
                cursor: "pointer",
              }}
            >
              Batal
            </button>
          </div>
        )}

        {/* Workspace list */}
        {workspaces.map((ws, i) => {
          const pc = planColors[ws.plan] ?? planColors.Starter;
          return (
            <div
              key={ws.id}
              className="flex items-center gap-4 px-5 py-4 transition-colors"
              style={{
                borderBottom: i < workspaces.length - 1 ? "1px solid #F1F5F9" : "none",
                background: ws.active ? "#FAFBFF" : "transparent",
              }}
            >
              {/* Avatar */}
              <div
                className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                style={{
                  background: ws.active ? "#0F1F3D" : "#F1F5F9",
                  borderRadius: "8px",
                }}
              >
                <span
                  style={{
                    color: ws.active ? "#FFFFFF" : "#64748B",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {ws.name.slice(0, 2).toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>{ws.name}</p>
                  {ws.active && (
                    <span
                      style={{
                        background: "#F0FDF4",
                        color: "#16A34A",
                        border: "1px solid #BBF7D0",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "1px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      AKTIF
                    </span>
                  )}
                  <span
                    style={{
                      background: pc.bg,
                      color: pc.color,
                      border: `1px solid ${pc.border}`,
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "1px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {ws.plan}
                  </span>
                </div>
                <p style={{ color: "#94A3B8", fontSize: "11.5px" }}>
                  {ws.members} anggota · Dibuat {ws.created}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {!ws.active && (
                  <button
                    onClick={() => activate(ws.id)}
                    style={{
                      background: "#EEF2FF",
                      color: "#4F46E5",
                      border: "1px solid #C7D2FE",
                      borderRadius: "6px",
                      padding: "5px 12px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "#4F46E5") &&
                      ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")
                    }
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#EEF2FF";
                      (e.currentTarget as HTMLElement).style.color = "#4F46E5";
                    }}
                  >
                    Aktifkan
                  </button>
                )}
                <button
                  style={{
                    background: "none",
                    border: "1px solid #E2E8F0",
                    borderRadius: "6px",
                    padding: "5px 12px",
                    fontSize: "12px",
                    color: "#64748B",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "none")
                  }
                >
                  Kelola
                </button>
              </div>
            </div>
          );
        })}
      </CardWrap>

      {/* Invite Member */}
      <CardWrap>
        <CardHead icon={Users} color="#059669" bg="#ECFDF5" title="Undang Anggota Tim" desc="Tambah kolega ke workspace aktif Anda" />
        <div className="px-5 py-5">
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="email@rekan.com"
              style={{
                flex: 1,
                padding: "9px 12px",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#0F1F3D",
                background: "#FFFFFF",
                outline: "none",
              }}
              onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#4F46E5")}
              onBlur={(e)  => ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")}
            />
            <select
              style={{
                padding: "9px 12px",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#0F1F3D",
                background: "#FFFFFF",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option>Member</option>
              <option>Admin</option>
              <option>Viewer</option>
            </select>
            <button
              className="flex items-center gap-1.5 px-4 py-2.5 transition-colors"
              style={{
                background: "#0F1F3D",
                color: "#FFFFFF",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a2f52")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#0F1F3D")}
            >
              <Mail size={13} />
              Kirim Undangan
            </button>
          </div>
        </div>
      </CardWrap>
    </div>
  );
}

// ─── Tab: Billing & Paket ─────────────────────────────────────────────────────
function BillingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"bulanan" | "3bulan" | "6bulan" | "12bulan">("bulanan");

  const periods: { key: "bulanan" | "3bulan" | "6bulan" | "12bulan"; label: string; discount: string | null }[] = [
    { key: "bulanan", label: "BULANAN",  discount: null   },
    { key: "3bulan",  label: "3 BULAN",  discount: "-5%"  },
    { key: "6bulan",  label: "6 BULAN",  discount: "-15%" },
    { key: "12bulan", label: "12 BULAN", discount: "-25%" },
  ];
  const discountRate: Record<string, number> = { bulanan: 0, "3bulan": 0.05, "6bulan": 0.15, "12bulan": 0.25 };
  const baseMonthly = 349000;
  const effectiveMonthly = Math.round(baseMonthly * (1 - discountRate[billingPeriod]));
  const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");

  const usageItems = [
    { label: "Leads Diperoleh",  used: 487,  total: 1000, color: "#4F46E5", colorBg: "#EEF2FF" },
    { label: "AI Analysis",      used: 234,  total: 500,  color: "#059669", colorBg: "#ECFDF5" },
    { label: "Outreach Sent",    used: 89,   total: 250,  color: "#D97706", colorBg: "#FFFBEB" },
    { label: "Export Data",      used: 12,   total: 50,   color: "#0284C7", colorBg: "#E0F2FE" },
  ];
  const payments = [
    { date: "5 Mei 2026",   desc: "Growth Plan – Bulanan", amount: "Rp 349.000", status: "Lunas"  },
    { date: "5 Apr 2026",   desc: "Growth Plan – Bulanan", amount: "Rp 349.000", status: "Lunas"  },
    { date: "5 Mar 2026",   desc: "Growth Plan – Bulanan", amount: "Rp 349.000", status: "Lunas"  },
    { date: "5 Feb 2026",   desc: "Growth Plan – Bulanan", amount: "Rp 349.000", status: "Lunas"  },
  ];

  return (
    <div className="flex flex-col gap-5">

      {/* Current Plan */}
      <div
        style={{
          background: "#0F1F3D",
          borderRadius: "8px",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(79,70,229,0.35) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.12)", borderRadius: "8px" }}
              >
                <Star size={14} style={{ color: "#F9A825" }} />
              </div>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.5px" }}>
                PAKET AKTIF
              </span>
            </div>
            <h2 style={{ color: "#FFFFFF", fontSize: "24px", fontWeight: 800, lineHeight: 1, marginBottom: "6px" }}>
              Growth Plan
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", marginBottom: "16px" }}>
              Pembaruan berikutnya pada{" "}
              <strong style={{ color: "rgba(255,255,255,0.85)" }}>5 Juni 2026</strong>
            </p>
            <div className="flex items-baseline gap-1.5">
              <span style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 800, lineHeight: 1 }}>
                {fmt(effectiveMonthly)}
              </span>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px" }}>/bln</span>
              {billingPeriod !== "bulanan" && (
                <span
                  style={{
                    background: "rgba(110,231,183,0.18)",
                    color: "#6EE7B7",
                    border: "1px solid rgba(110,231,183,0.3)",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: "4px",
                    marginLeft: "2px",
                  }}
                >
                  hemat {discountRate[billingPeriod] * 100}%
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              className="flex items-center gap-1.5 px-4 py-2.5 transition-all"
              style={{
                background: "#4F46E5",
                color: "#FFFFFF",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#4338CA")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#4F46E5")}
            >
              <ArrowUpRight size={14} />
              Upgrade ke Pro
            </button>
            <button
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 500,
                border: "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer",
                padding: "7px 16px",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)")
              }
            >
              Kelola Langganan
            </button>
          </div>
        </div>

        {/* ── Period Selector ── */}
        <div className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "10.5px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              marginBottom: "10px",
            }}
          >
            PILIHAN PERIODE LANGGANAN
          </p>
          <div
            className="flex items-center gap-1.5 p-1"
            style={{
              background: "rgba(255,255,255,0.07)",
              borderRadius: "8px",
              width: "fit-content",
            }}
          >
            {periods.map((p) => {
              const isSelected = billingPeriod === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => setBillingPeriod(p.key)}
                  className="flex items-center gap-1.5 transition-all"
                  style={{
                    background: isSelected ? "#FFFFFF" : "transparent",
                    border: "none",
                    borderRadius: "6px",
                    padding: "7px 14px",
                    cursor: "pointer",
                    color: isSelected ? "#0F1F3D" : "rgba(255,255,255,0.55)",
                    fontSize: "12px",
                    fontWeight: isSelected ? 700 : 500,
                    letterSpacing: isSelected ? "0.3px" : "0px",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {p.label}
                  {p.discount && (
                    <span
                      style={{
                        background: isSelected ? "#EEF2FF" : "rgba(99,102,241,0.35)",
                        color: isSelected ? "#4F46E5" : "#A5B4FC",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "1px 5px",
                        borderRadius: "4px",
                      }}
                    >
                      {p.discount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Plan features */}
        <div
          className="flex flex-wrap gap-x-5 gap-y-1.5 mt-5 pt-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          {["1.000 Leads/bln", "500 AI Analysis", "250 Outreach", "50 Export Data", "Priority Support"].map(
            (f) => (
              <div key={f} className="flex items-center gap-1.5">
                <Check size={12} style={{ color: "#6EE7B7" }} />
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "12px" }}>{f}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Usage */}
      <CardWrap>
        <CardHead icon={Activity} color="#4F46E5" bg="#EEF2FF" title="Penggunaan Kredit" desc="Sisa kuota periode Mei 2026" />
        <div className="px-5 py-5 flex flex-col gap-4">
          {usageItems.map((item) => {
            const pct = Math.round((item.used / item.total) * 100);
            const nearLimit = pct >= 80;
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                      style={{ background: item.colorBg, borderRadius: "6px" }}
                    >
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: item.color,
                        }}
                      />
                    </div>
                    <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 500 }}>
                      {item.label}
                    </span>
                    {nearLimit && (
                      <span
                        style={{
                          background: "#FEF3C7",
                          color: "#D97706",
                          border: "1px solid #FDE68A",
                          fontSize: "10px",
                          fontWeight: 600,
                          padding: "1px 5px",
                          borderRadius: "4px",
                        }}
                      >
                        Hampir habis
                      </span>
                    )}
                  </div>
                  <span style={{ color: "#64748B", fontSize: "12px", fontWeight: 500 }}>
                    <strong style={{ color: "#0F1F3D", fontWeight: 700 }}>{item.used.toLocaleString()}</strong>
                    {" "}/ {item.total.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    background: "#F1F5F9",
                    borderRadius: "4px",
                    height: "6px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: nearLimit ? "#D97706" : item.color,
                      borderRadius: "4px",
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardWrap>

      {/* Payment History */}
      <CardWrap>
        <CardHead
          icon={CardIcon}
          color="#059669"
          bg="#ECFDF5"
          title="Riwayat Pembayaran"
          desc="Histori transaksi langganan Anda"
          action={
            <button
              className="flex items-center gap-1.5 px-3 py-2 transition-colors"
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#64748B",
                cursor: "pointer",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F1F5F9")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")}
            >
              <Download size={12} />
              Export PDF
            </button>
          }
        />
        <div>
          {/* Table header */}
          <div
            className="grid px-5 py-2.5"
            style={{
              gridTemplateColumns: "1fr 1fr 100px 80px",
              gap: "8px",
              background: "#FAFBFC",
              borderBottom: "1px solid #F1F5F9",
            }}
          >
            {["TANGGAL", "DESKRIPSI", "JUMLAH", "STATUS"].map((h) => (
              <span
                key={h}
                style={{
                  color: "#94A3B8",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.3px",
                }}
              >
                {h}
              </span>
            ))}
          </div>
          {payments.map((p, i) => (
            <div
              key={i}
              className="grid items-center px-5 py-3.5 transition-colors"
              style={{
                gridTemplateColumns: "1fr 1fr 100px 80px",
                gap: "8px",
                borderBottom: i < payments.length - 1 ? "1px solid #F1F5F9" : "none",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FAFBFC")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <span style={{ color: "#64748B", fontSize: "13px" }}>{p.date}</span>
              <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 500 }}>{p.desc}</span>
              <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>{p.amount}</span>
              <span
                className="flex items-center gap-1 w-fit px-1.5 py-0.5"
                style={{ background: "#F0FDF4", borderRadius: "4px" }}
              >
                <Check size={10} style={{ color: "#16A34A" }} />
                <span style={{ color: "#16A34A", fontSize: "11px", fontWeight: 600 }}>{p.status}</span>
              </span>
            </div>
          ))}
        </div>
      </CardWrap>
    </div>
  );
}

// ─── Tab: Notifikasi ──────────────────────────────────────────────────────────
function NotificationsSection() {
  const [notifs, setNotifs] = useState<Record<string, boolean>>({
    painAlert:        true,
    hotLeads:         true,
    marketSentiment:  false,
    campaignUpdate:   true,
    campaignComplete: true,
    weeklyDigest:     true,
    billingReminder:  true,
    securityAlert:    true,
    newFeature:       false,
    dataExport:       true,
  });

  function toggle(key: string) {
    setNotifs((n) => ({ ...n, [key]: !n[key] }));
  }

  const groups: {
    title: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    items: { key: string; label: string; desc: string; rec?: boolean }[];
  }[] = [
    {
      title: "Leads & Analitik",
      icon: Zap,
      color: "#DC2626",
      bg: "#FEF2F2",
      items: [
        { key: "painAlert",       label: "Pain Alert Baru",            desc: "Notifikasi ketika pain score lead ≥ 85",         rec: true  },
        { key: "hotLeads",        label: "Hot Leads Terdeteksi",       desc: "Alert saat lead baru masuk kategori 'Hot'",      rec: true  },
        { key: "marketSentiment", label: "Market Sentiment Berubah",   desc: "Laporan perubahan tren sentimen pasar mingguan" },
      ],
    },
    {
      title: "Campaign & Outreach",
      icon: MessageSquare,
      color: "#4F46E5",
      bg: "#EEF2FF",
      items: [
        { key: "campaignUpdate",   label: "Update Campaign & Reply",    desc: "Saat ada balasan pesan dari leads",              rec: true  },
        { key: "campaignComplete", label: "Campaign Selesai",           desc: "Notifikasi ketika campaign mencapai target",     rec: true  },
        { key: "weeklyDigest",     label: "Weekly Digest Report",       desc: "Ringkasan performa mingguan setiap Senin pagi",  rec: true  },
      ],
    },
    {
      title: "Sistem & Akun",
      icon: Bell,
      color: "#0284C7",
      bg: "#E0F2FE",
      items: [
        { key: "billingReminder", label: "Pengingat Pembayaran",       desc: "3 hari sebelum tanggal jatuh tempo tagihan",    rec: true  },
        { key: "securityAlert",   label: "Peringatan Keamanan",        desc: "Login dari perangkat/lokasi tidak dikenal",     rec: true  },
        { key: "newFeature",      label: "Fitur & Update Baru",        desc: "Informasi peluncuran fitur terbaru HelicoLeads" },
        { key: "dataExport",      label: "Notifikasi Export Data",      desc: "Ketika file export Anda siap diunduh" },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <CardWrap key={group.title}>
          <CardHead icon={group.icon} color={group.color} bg={group.bg} title={group.title} desc={`${group.items.filter((i) => notifs[i.key]).length} dari ${group.items.length} aktif`} />
          <div>
            {group.items.map((item, idx) => (
              <div
                key={item.key}
                className="flex items-center justify-between px-5 py-4"
                style={{
                  borderBottom: idx < group.items.length - 1 ? "1px solid #F1F5F9" : "none",
                }}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 500 }}>
                      {item.label}
                    </p>
                    {item.rec && (
                      <span
                        style={{
                          background: "#EEF2FF",
                          color: "#4F46E5",
                          border: "1px solid #C7D2FE",
                          fontSize: "9.5px",
                          fontWeight: 700,
                          padding: "1px 5px",
                          borderRadius: "4px",
                        }}
                      >
                        Disarankan
                      </span>
                    )}
                  </div>
                  <p style={{ color: "#94A3B8", fontSize: "12px" }}>{item.desc}</p>
                </div>
                <Toggle checked={notifs[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </CardWrap>
      ))}

      {/* Save all */}
      <div className="flex justify-end">
        <button
          className="flex items-center gap-2 px-4 py-2.5 transition-colors"
          style={{
            background: "#0F1F3D",
            color: "#FFFFFF",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a2f52")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#0F1F3D")}
        >
          <Check size={14} />
          Simpan Preferensi
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Compliance & Legal ──────────────────────────────────────────────────
function ComplianceSection() {
  const auditLogs = [
    { date: "3 Mei 2026, 14:23", action: "Login berhasil",             ip: "103.151.28.x", status: "Sukses" },
    { date: "3 Mei 2026, 09:12", action: "Export data leads (84 baris)", ip: "103.151.28.x", status: "Sukses" },
    { date: "2 Mei 2026, 18:45", action: "Perubahan password",          ip: "103.151.28.x", status: "Sukses" },
    { date: "1 Mei 2026, 11:30", action: "API key diregenerasi",        ip: "103.151.28.x", status: "Sukses" },
    { date: "30 Apr 2026, 08:15", action: "Workspace baru dibuat",      ip: "103.151.28.x", status: "Sukses" },
    { date: "28 Apr 2026, 16:50", action: "Gagal login (3x attempt)",   ip: "45.129.xx.xx",  status: "Gagal"  },
  ];

  return (
    <div className="flex flex-col gap-5">

      {/* Status Card */}
      <CardWrap>
        <CardHead icon={Shield} color="#059669" bg="#ECFDF5" title="Status Kepatuhan Data" desc="Berdasarkan UU PDP Indonesia (Perlindungan Data Pribadi)" />
        <div className="px-5 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            {[
              { label: "Status PDP",           value: "Verified",      sub: "Terverifikasi",   color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", icon: CheckCircle2 },
              { label: "Retensi Data",          value: "180 Hari",      sub: "Sesuai ketentuan", color: "#4F46E5", bg: "#EEF2FF", border: "#C7D2FE", icon: Activity     },
              { label: "Lokasi Penyimpanan",    value: "Indonesia",     sub: "Server lokal",     color: "#0284C7", bg: "#E0F2FE", border: "#BAE6FD", icon: Globe        },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-2 p-4"
                style={{
                  background: item.bg,
                  borderRadius: "8px",
                  border: `1px solid ${item.border}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <item.icon size={13} style={{ color: item.color }} />
                  <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px" }}>
                    {item.label.toUpperCase()}
                  </span>
                </div>
                <p style={{ color: item.color, fontSize: "16px", fontWeight: 800, lineHeight: 1 }}>
                  {item.value}
                </p>
                <p style={{ color: "#64748B", fontSize: "11px" }}>{item.sub}</p>
              </div>
            ))}
          </div>

          <div
            className="flex items-start gap-3 p-4"
            style={{
              background: "#F0FDF4",
              borderRadius: "8px",
              border: "1px solid #BBF7D0",
            }}
          >
            <CheckCircle2 size={16} style={{ color: "#16A34A", flexShrink: 0, marginTop: "1px" }} />
            <div>
              <p style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                Kepatuhan PDP Aktif
              </p>
              <p style={{ color: "#64748B", fontSize: "12px", lineHeight: 1.55 }}>
                HelicoLeads memproses dan menyimpan data sesuai UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi.
                Data Anda tersimpan di server Indonesia dan tidak dibagikan ke pihak ketiga tanpa persetujuan.
                Audit terakhir dilakukan pada <strong>1 Mei 2026</strong>.
              </p>
            </div>
          </div>
        </div>
      </CardWrap>

      {/* Audit Log */}
      <CardWrap>
        <CardHead icon={Activity} color="#D97706" bg="#FFFBEB" title="Audit Log Aktivitas" desc="Rekam jejak aksi penting di akun Anda" />
        <div>
          <div
            className="grid px-5 py-2.5"
            style={{
              gridTemplateColumns: "1.4fr 2fr 1fr 80px",
              gap: "8px",
              background: "#FAFBFC",
              borderBottom: "1px solid #F1F5F9",
            }}
          >
            {["WAKTU", "AKSI", "IP ADDRESS", "STATUS"].map((h) => (
              <span
                key={h}
                style={{
                  color: "#94A3B8",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.3px",
                }}
              >
                {h}
              </span>
            ))}
          </div>
          {auditLogs.map((log, i) => (
            <div
              key={i}
              className="grid items-center px-5 py-3 transition-colors"
              style={{
                gridTemplateColumns: "1.4fr 2fr 1fr 80px",
                gap: "8px",
                borderBottom: i < auditLogs.length - 1 ? "1px solid #F1F5F9" : "none",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FAFBFC")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <span style={{ color: "#64748B", fontSize: "12px" }}>{log.date}</span>
              <span style={{ color: "#0F1F3D", fontSize: "12.5px", fontWeight: 500 }}>{log.action}</span>
              <span
                style={{
                  color: "#64748B",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
              >
                {log.ip}
              </span>
              <span
                className="flex items-center gap-1 w-fit px-1.5 py-0.5"
                style={{
                  background: log.status === "Sukses" ? "#F0FDF4" : "#FEF2F2",
                  borderRadius: "4px",
                }}
              >
                {log.status === "Sukses"
                  ? <Check        size={9}  style={{ color: "#16A34A" }} />
                  : <AlertCircle  size={9}  style={{ color: "#DC2626" }} />}
                <span
                  style={{
                    color: log.status === "Sukses" ? "#16A34A" : "#DC2626",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {log.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      </CardWrap>

      {/* Legal Links */}
      <CardWrap>
        <CardHead icon={Globe} color="#64748B" bg="#F8FAFC" title="Dokumen Legal" desc="Kebijakan dan ketentuan penggunaan layanan" />
        <div className="px-5 py-4 flex flex-col gap-2">
          {[
            { label: "Syarat & Ketentuan Layanan",         desc: "Terakhir diperbarui: 1 Jan 2026" },
            { label: "Kebijakan Privasi",                   desc: "Terakhir diperbarui: 1 Jan 2026" },
            { label: "Kebijakan Perlindungan Data (DPA)",   desc: "Terakhir diperbarui: 15 Jan 2026" },
            { label: "Cookie Policy",                       desc: "Terakhir diperbarui: 1 Jan 2026" },
          ].map((doc) => (
            <button
              key={doc.label}
              className="flex items-center justify-between px-4 py-3 transition-colors"
              style={{
                background: "#FAFBFC",
                border: "1px solid #F1F5F9",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "left",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#F1F5F9")}
            >
              <div>
                <p style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 500 }}>{doc.label}</p>
                <p style={{ color: "#94A3B8", fontSize: "11.5px", marginTop: "2px" }}>{doc.desc}</p>
              </div>
              <ExternalLink size={13} style={{ color: "#94A3B8", flexShrink: 0 }} />
            </button>
          ))}
        </div>
      </CardWrap>
    </div>
  );
}

// ─── Tab: API & Integrasi ─────────────────────────────────────────────────────
function APISection() {
  const [showKey,    setShowKey]    = useState(false);
  const [keyCopied,  setKeyCopied]  = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [confirmed,    setConfirmed]    = useState(false);

  const maskedKey = "sk_live_••••••••••••••••••••••••3k9f";
  const fullKey   = "sk_live_hL9kP2mQxR5nY7bW3vJ8dA6cE4tF1gH0_3k9f";

  function copyKey() {
    navigator.clipboard.writeText(fullKey).catch(() => {});
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  }
  function doRegenerate() {
    setRegenerating(true);
    setConfirmed(false);
    setTimeout(() => setRegenerating(false), 1500);
  }

  const integrations = [
    {
      name: "WhatsApp Business API",
      desc: "Kirim pesan outreach langsung via WA Business",
      icon: MessageSquare,
      color: "#25D366",
      bg: "#F0FFF4",
      connected: true,
      detail: "Terhubung · Nomor: +62 812 xxxx xxxx",
    },
    {
      name: "Google Places API",
      desc: "Sumber data bisnis dan ulasan pelanggan",
      icon: Globe,
      color: "#4285F4",
      bg: "#EFF6FF",
      connected: true,
      detail: "Terhubung · Kuota: 8.240 / 10.000",
    },
    {
      name: "Zapier",
      desc: "Otomasi workflow ke 5.000+ aplikasi",
      icon: Zap,
      color: "#FF4A00",
      bg: "#FFF4F0",
      connected: false,
      detail: null,
    },
    {
      name: "Slack Notifications",
      desc: "Kirim alert dan laporan ke channel Slack",
      icon: MessageSquare,
      color: "#4A154B",
      bg: "#FAF0FF",
      connected: false,
      detail: null,
    },
    {
      name: "Google Sheets",
      desc: "Sinkronisasi data leads ke spreadsheet otomatis",
      icon: Activity,
      color: "#0F9D58",
      bg: "#F0FDF4",
      connected: false,
      detail: null,
    },
  ];

  return (
    <div className="flex flex-col gap-5">

      {/* API Key */}
      <CardWrap>
        <CardHead icon={Key} color="#4F46E5" bg="#EEF2FF" title="API Keys" desc="Gunakan untuk mengakses HelicoLeads API secara programatik" />
        <div className="px-5 py-5">

          {/* Key display */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="flex-1 flex items-center gap-3 px-4 py-3"
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                }}
              >
                <Key size={13} style={{ color: "#94A3B8", flexShrink: 0 }} />
                <code
                  style={{
                    flex: 1,
                    color: "#0F1F3D",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    letterSpacing: "0.5px",
                  }}
                >
                  {showKey ? fullKey : maskedKey}
                </code>
              </div>
              <button
                onClick={() => setShowKey((v) => !v)}
                className="w-9 h-9 flex items-center justify-center transition-colors flex-shrink-0"
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F1F5F9")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")}
                title={showKey ? "Sembunyikan" : "Tampilkan"}
              >
                {showKey
                  ? <EyeOff size={14} style={{ color: "#64748B" }} />
                  : <Eye    size={14} style={{ color: "#64748B" }} />}
              </button>
              <button
                onClick={copyKey}
                className="w-9 h-9 flex items-center justify-center transition-colors flex-shrink-0"
                style={{
                  background: keyCopied ? "#F0FDF4" : "#F8FAFC",
                  border: `1px solid ${keyCopied ? "#BBF7D0" : "#E2E8F0"}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => !keyCopied && ((e.currentTarget as HTMLElement).style.background = "#F1F5F9")}
                onMouseLeave={(e) => !keyCopied && ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")}
                title="Salin API Key"
              >
                {keyCopied
                  ? <Check size={14} style={{ color: "#16A34A" }} />
                  : <Copy  size={14} style={{ color: "#64748B" }} />}
              </button>
            </div>

            {/* Key meta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "Dibuat",         value: "12 Feb 2026" },
                { label: "Terakhir Digunakan", value: "3 Mei 2026, 14:22" },
                { label: "Rate Limit",     value: "1.000 req/hari" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="px-3 py-2.5"
                  style={{
                    background: "#FAFBFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                  }}
                >
                  <p style={{ color: "#94A3B8", fontSize: "10.5px", fontWeight: 600, letterSpacing: "0.3px", marginBottom: "3px" }}>
                    {m.label.toUpperCase()}
                  </p>
                  <p style={{ color: "#0F1F3D", fontSize: "12.5px", fontWeight: 600 }}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Regenerate */}
          {!confirmed ? (
            <button
              onClick={() => setConfirmed(true)}
              className="flex items-center gap-2 px-4 py-2.5 transition-colors"
              style={{
                background: "#FEF2F2",
                color: "#DC2626",
                border: "1px solid #FCA5A5",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#DC2626";
                (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#FEF2F2";
                (e.currentTarget as HTMLElement).style.color = "#DC2626";
              }}
            >
              <RefreshCw size={13} style={{ animation: regenerating ? "spin 1s linear infinite" : "none" }} />
              Regenerasi API Key
            </button>
          ) : (
            <div
              className="flex items-center gap-3 p-3"
              style={{
                background: "#FEF2F2",
                border: "1px solid #FCA5A5",
                borderRadius: "8px",
              }}
            >
              <AlertCircle size={14} style={{ color: "#DC2626", flexShrink: 0 }} />
              <p style={{ color: "#DC2626", fontSize: "12px", flex: 1 }}>
                API key lama akan dinonaktifkan. Lanjutkan?
              </p>
              <button
                onClick={doRegenerate}
                style={{
                  background: "#DC2626",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "6px",
                  padding: "5px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Ya, Regenerasi
              </button>
              <button
                onClick={() => setConfirmed(false)}
                style={{
                  background: "none",
                  border: "1px solid #FCA5A5",
                  borderRadius: "6px",
                  padding: "5px 12px",
                  fontSize: "12px",
                  color: "#DC2626",
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </CardWrap>

      {/* Integrations */}
      <CardWrap>
        <CardHead icon={Code2} color="#7C3AED" bg="#F5F3FF" title="Integrasi Platform" desc="Hubungkan HelicoLeads dengan layanan yang Anda gunakan" />
        <div>
          {integrations.map((intg, i) => (
            <div
              key={intg.name}
              className="flex items-center gap-4 px-5 py-4 transition-colors"
              style={{ borderBottom: i < integrations.length - 1 ? "1px solid #F1F5F9" : "none" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FAFBFC")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <div
                className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                style={{ background: intg.bg, borderRadius: "8px" }}
              >
                <intg.icon size={18} style={{ color: intg.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>{intg.name}</p>
                  {intg.connected ? (
                    <span
                      style={{
                        background: "#F0FDF4",
                        color: "#16A34A",
                        border: "1px solid #BBF7D0",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "1px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      ● Terhubung
                    </span>
                  ) : (
                    <span
                      style={{
                        background: "#F8FAFC",
                        color: "#94A3B8",
                        border: "1px solid #E2E8F0",
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "1px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      Belum terhubung
                    </span>
                  )}
                </div>
                <p style={{ color: "#94A3B8", fontSize: "12px" }}>
                  {intg.detail ?? intg.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {intg.connected ? (
                  <>
                    <button
                      style={{
                        background: "none",
                        border: "1px solid #E2E8F0",
                        borderRadius: "6px",
                        padding: "5px 12px",
                        fontSize: "12px",
                        color: "#64748B",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "none")}
                    >
                      Kelola
                    </button>
                    <button
                      style={{
                        background: "none",
                        border: "1px solid #FCA5A5",
                        borderRadius: "6px",
                        padding: "5px 10px",
                        fontSize: "12px",
                        color: "#DC2626",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FEF2F2")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "none")}
                    >
                      Putus
                    </button>
                  </>
                ) : (
                  <button
                    className="flex items-center gap-1.5 px-3 py-2 transition-colors"
                    style={{
                      background: "#EEF2FF",
                      color: "#4F46E5",
                      border: "1px solid #C7D2FE",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#4F46E5";
                      (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#EEF2FF";
                      (e.currentTarget as HTMLElement).style.color = "#4F46E5";
                    }}
                  >
                    <Plus size={11} />
                    Hubungkan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardWrap>

      {/* Webhook */}
      <CardWrap>
        <CardHead icon={Globe} color="#0284C7" bg="#E0F2FE" title="Webhook" desc="Terima notifikasi real-time ke endpoint Anda" />
        <div className="px-5 py-5">
          <div className="flex gap-3 mb-4">
            <input
              type="url"
              placeholder="https://your-server.com/webhook"
              style={{
                flex: 1,
                padding: "9px 12px",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#0F1F3D",
                background: "#FFFFFF",
                outline: "none",
              }}
              onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#4F46E5")}
              onBlur={(e) =>  ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")}
            />
            <button
              className="flex items-center gap-1.5 px-4 py-2.5 flex-shrink-0"
              style={{
                background: "#0F1F3D",
                color: "#FFFFFF",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a2f52")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#0F1F3D")}
            >
              <Plus size={13} />
              Tambah Webhook
            </button>
          </div>
          <p style={{ color: "#94A3B8", fontSize: "12px" }}>
            Belum ada webhook aktif. Tambahkan URL endpoint untuk menerima event seperti{" "}
            <code
              style={{
                background: "#F1F5F9",
                padding: "1px 5px",
                borderRadius: "4px",
                fontSize: "11px",
                color: "#4F46E5",
              }}
            >
              lead.created
            </code>
            ,{" "}
            <code
              style={{
                background: "#F1F5F9",
                padding: "1px 5px",
                borderRadius: "4px",
                fontSize: "11px",
                color: "#4F46E5",
              }}
            >
              campaign.completed
            </code>
            , dan lainnya.
          </p>
        </div>
      </CardWrap>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("account");

  return (
    <div className="min-h-screen p-5 md:p-6 lg:p-8" style={{ background: "#F8FAFC", color: "#0F1F3D" }}>

      {/* ── Header ── */}
      <div className="flex items-start gap-3 mb-6">
        <div
          className="w-8 h-8 flex items-center justify-center flex-shrink-0"
          style={{ background: "#EEF2FF", borderRadius: "8px" }}
        >
          <Settings size={15} style={{ color: "#4F46E5" }} />
        </div>
        <div>
          <h1 style={{ color: "#0F1F3D", fontSize: "22px", fontWeight: 700 }}>Pengaturan</h1>
          <p style={{ color: "#64748B", fontSize: "14px", marginTop: "2px" }}>
            Kelola akun, workspace, dan preferensi HelicoLeads Anda
          </p>
        </div>
      </div>

      {/* ── Horizontal Tab Bar ── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "8px",
          marginBottom: "20px",
          overflow: "hidden",
        }}
      >
        {/* Tab list */}
        <div
          className="flex items-center overflow-x-auto"
          style={{ borderBottom: "1px solid #E2E8F0" }}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className="flex items-center gap-2 flex-shrink-0 transition-all"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: isActive ? "2px solid #4F46E5" : "2px solid transparent",
                  cursor: "pointer",
                  color: isActive ? "#4F46E5" : "#64748B",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 400,
                  padding: "14px 20px",
                  marginBottom: "-1px",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "#0F1F3D";
                    (e.currentTarget as HTMLElement).style.background = "#FAFBFC";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "#64748B";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                <item.icon
                  size={14}
                  style={{ color: isActive ? "#4F46E5" : "#94A3B8", flexShrink: 0 }}
                />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Active tab breadcrumb strip */}
        {(() => {
          const active = navItems.find((n) => n.key === activeTab)!;
          return (
            <div
              className="flex items-center gap-2 px-5 py-2.5"
              style={{ background: "#FAFBFC" }}
            >
              <ChevronRight size={12} style={{ color: "#CBD5E1" }} />
              <span style={{ color: "#94A3B8", fontSize: "12px" }}>Pengaturan</span>
              <ChevronRight size={12} style={{ color: "#CBD5E1" }} />
              <span style={{ color: "#0F1F3D", fontSize: "12px", fontWeight: 600 }}>
                {active.label}
              </span>
              <span style={{ color: "#CBD5E1", fontSize: "12px" }}>—</span>
              <span style={{ color: "#94A3B8", fontSize: "12px" }}>{active.desc}</span>
            </div>
          );
        })()}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "account"       && <AccountSection />}
      {activeTab === "workspace"     && <WorkspaceSection />}
      {activeTab === "billing"       && <BillingSection />}
      {activeTab === "notifications" && <NotificationsSection />}
      {activeTab === "compliance"    && <ComplianceSection />}
      {activeTab === "api"           && <APISection />}
    </div>
  );
}

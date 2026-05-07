import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Search,
  Database,
  Sparkles,
  Target,
  Send,
  TrendingUp,
  BarChart2,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Plus,
  ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
  /** When true: icon is indigo-tinted when inactive; active bg is indigo-tinted */
  featured?: boolean;
}

// ─── Nav items — in exact order requested ─────────────────────────────────────
const navItems: NavItem[] = [
  { label: "Dashboard",           icon: LayoutDashboard, path: "/"                },
  { label: "Database Leads Saya", icon: Database,        path: "/database-leads"  },
  { label: "Inteligensi AI",      icon: Sparkles,        path: "/ai-intelligence" },
  {
    label: "Campaigns",
    icon: Target,
    path: "/campaigns",
    badge: "New",
    featured: true,
  },
  { label: "Outreach CRM",        icon: Send,            path: "/outreach-crm"    },
  { label: "Market Insights",     icon: TrendingUp,      path: "/market-insights" },
  { label: "Analytics & ROI",     icon: BarChart2,       path: "/analytics"       },
  { label: "Pricing",             icon: CreditCard,      path: "/pricing"         },
  { label: "Settings",            icon: Settings,        path: "/settings"        },
];

const workspaces = ["Sales Team Jakarta", "Marketing Team", "Enterprise Ops"];

// ─── Component ────────────────────────────────────────────────────────────────
export function Sidebar({ onClose }: { onClose?: () => void }) {
  const [wsOpen,      setWsOpen]      = useState(false);
  const [selectedWs,  setSelectedWs]  = useState("Sales Team Jakarta");
  const navigate = useNavigate();

  return (
    <aside
      className="w-[240px] h-full flex flex-col border-r overflow-hidden"
      style={{ background: "#FFFFFF", borderColor: "#E2E8F0", color: "#0F1F3D" }}
    >

      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 flex items-center justify-center flex-shrink-0"
              style={{ background: "#0F1F3D", borderRadius: "8px" }}
            >
              <span style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 800 }}>H</span>
            </div>
            <div>
              <p style={{ color: "#0F1F3D", fontSize: "14px", fontWeight: 700, lineHeight: 1.2 }}>
                HelicoLeads
              </p>
              <p style={{ color: "#8A97A8", fontSize: "11px", fontWeight: 400, lineHeight: 1.2 }}>
                Lead Intelligence
              </p>
            </div>
          </div>

          {/* Close button — mobile overlay only */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden flex items-center justify-center flex-shrink-0"
              style={{
                width: 28, height: 28,
                borderRadius: 6,
                border: "1px solid #E2E8F0",
                background: "#F8FAFC",
                cursor: "pointer",
              }}
            >
              <X size={14} style={{ color: "#64748B" }} />
            </button>
          )}
        </div>
      </div>

      {/* ── Workspace Selector ────────────────────────────────────────────── */}
      <div className="px-4 pb-4">
        <p
          style={{
            color: "#8A97A8",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.6px",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          Workspace
        </p>
        <div className="relative">
          <button
            onClick={() => setWsOpen(!wsOpen)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 transition-colors"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              color: "#0F1F3D",
              fontSize: "13px",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#CBD5E1")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")}
          >
            {/* Workspace avatar dot */}
            <div className="flex items-center gap-2 min-w-0">
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#4F46E5",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedWs}
              </span>
            </div>
            {wsOpen
              ? <ChevronUp  size={13} style={{ color: "#8A97A8", flexShrink: 0 }} />
              : <ChevronDown size={13} style={{ color: "#8A97A8", flexShrink: 0 }} />}
          </button>

          {wsOpen && (
            <div
              className="absolute top-full left-0 right-0 mt-1 z-50 py-1"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
              }}
            >
              {workspaces.map((ws) => (
                <button
                  key={ws}
                  onClick={() => { setSelectedWs(ws); setWsOpen(false); }}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 transition-colors"
                  style={{ fontSize: "13px", color: "#0F1F3D" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: selectedWs === ws ? "#4F46E5" : "#E2E8F0",
                        flexShrink: 0,
                      }}
                    />
                    <span>{ws}</span>
                  </div>
                  {selectedWs === ws && (
                    <Check size={12} style={{ color: "#4F46E5", flexShrink: 0 }} />
                  )}
                </button>
              ))}

              {/* Add workspace */}
              <div style={{ height: "1px", background: "#F1F5F9", margin: "4px 8px" }} />
              <button
                className="w-full flex items-center gap-2 px-3 py-2 transition-colors"
                style={{ fontSize: "12px", color: "#64748B" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <Plus size={12} style={{ color: "#94A3B8" }} />
                Tambah Workspace
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Action Buttons ────────────────────────────────────────────────── */}
      <div className="px-4 pb-5 flex flex-col gap-2">
        {/* Primary: Cari Leads (indigo) */}
        <button
          onClick={() => navigate("/new-search")}
          className="w-full flex items-center justify-center gap-2 py-2.5 transition-all"
          style={{
            background: "#4F46E5",
            color: "#FFFFFF",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#4338CA")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#4F46E5")}
        >
          <Search size={14} strokeWidth={2.5} />
          Cari Leads
        </button>

        {/* Secondary: Buat Campaign Baru (navy dark) */}
        <button
          onClick={() => navigate("/campaigns")}
          className="w-full flex items-center justify-center gap-2 py-2.5 transition-all"
          style={{
            background: "#0F1F3D",
            color: "#FFFFFF",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1E3A5F")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#0F1F3D")}
        >
          <Plus size={14} strokeWidth={2.5} />
          Buat Campaign Baru
        </button>
      </div>

      {/* ── Nav Menu ──────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-4 overflow-y-auto min-h-0">
        <p
          style={{
            color: "#8A97A8",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.6px",
            textTransform: "uppercase",
            marginBottom: "6px",
            paddingLeft: "4px",
          }}
        >
          Menu
        </p>

        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className="flex items-center gap-3 px-3 py-2.5 transition-all"
              style={({ isActive }) =>
                isActive
                  ? {
                      background: item.featured ? "#EEF2FF" : "#F1F5F9",
                      color: item.featured ? "#4F46E5" : "#0F1F3D",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                    }
                  : {
                      color: "#4A5568",
                      fontSize: "13px",
                      fontWeight: 400,
                      borderRadius: "8px",
                    }
              }
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                if (!el.getAttribute("aria-current"))
                  el.style.background = item.featured ? "#F5F3FF" : "#F8FAFC";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                if (!el.getAttribute("aria-current"))
                  el.style.background = "transparent";
              }}
            >
              {({ isActive }) => (
                <>
                  {/* Icon */}
                  <item.icon
                    size={16}
                    style={{
                      color: isActive
                        ? item.featured ? "#4F46E5" : "#0F1F3D"
                        : item.featured ? "#6366F1" : "#8A97A8",
                      flexShrink: 0,
                    }}
                    strokeWidth={item.featured ? 2 : 1.75}
                  />

                  {/* Label */}
                  <span style={{ flex: 1, lineHeight: 1.3 }}>{item.label}</span>

                  {/* Badge "New" — shown only when not active */}
                  {item.badge && !isActive && (
                    <span
                      style={{
                        background: "#EEF2FF",
                        color: "#4F46E5",
                        border: "1px solid #C7D2FE",
                        fontSize: "9px",
                        fontWeight: 700,
                        padding: "1px 5px",
                        borderRadius: "4px",
                        letterSpacing: "0.3px",
                        flexShrink: 0,
                        textTransform: "uppercase",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Active indicator arrow for featured item */}
                  {item.featured && isActive && (
                    <ChevronRight size={12} style={{ color: "#4F46E5", flexShrink: 0 }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ── Bottom: User Profile ──────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid #E2E8F0" }}>
        {/* Log out */}
        <div className="px-4 pt-3 pb-2">
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 transition-all"
            style={{
              color: "#4A5568",
              fontSize: "13px",
              fontWeight: 400,
              borderRadius: "8px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#FEF2F2";
              (e.currentTarget as HTMLElement).style.color = "#DC2626";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#4A5568";
            }}
          >
            <LogOut size={15} style={{ color: "#8A97A8" }} />
            <span>Log out</span>
          </button>
        </div>

        {/* User profile card */}
        <div
          className="mx-3 mb-4 flex items-center gap-3 px-3 py-2.5 transition-all"
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#CBD5E1")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")}
        >
          {/* Avatar */}
          <div
            className="flex items-center justify-center text-white flex-shrink-0"
            style={{
              width: 32,
              height: 32,
              background: "#0F1F3D",
              borderRadius: "50%",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            RD
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#0F1F3D",
                lineHeight: 1.25,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Rizky Dwi
            </p>
            <div className="flex items-center gap-1.5">
              <span
                style={{
                  fontSize: "10px",
                  color: "#8A97A8",
                  lineHeight: 1.3,
                }}
              >
                Admin
              </span>
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "#16A34A",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "10px", color: "#16A34A", lineHeight: 1.3 }}>
                Online
              </span>
            </div>
          </div>

          {/* Settings shortcut */}
          <button
            onClick={(e) => { e.stopPropagation(); navigate("/settings"); }}
            className="flex-shrink-0 transition-all"
            style={{ color: "#94A3B8", padding: "2px" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#4F46E5")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94A3B8")}
            title="Settings"
          >
            <Settings size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}

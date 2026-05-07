import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Search,
  Database,
  Sparkles,
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
} from "lucide-react";

const navItems = [
  { label: "Dashboard",           icon: LayoutDashboard, path: "/" },
  { label: "Database Leads Saya", icon: Database,        path: "/database-leads" },
  { label: "Inteligensi AI",      icon: Sparkles,        path: "/ai-intelligence" },
  { label: "Outreach CRM",        icon: Send,            path: "/outreach-crm" },
  { label: "Market Insights",     icon: TrendingUp,      path: "/market-insights" },
  { label: "Analytics & ROI",     icon: BarChart2,       path: "/analytics" },
  { label: "Pricing",             icon: CreditCard,      path: "/pricing" },
  { label: "Settings",            icon: Settings,        path: "/settings" },
];

const workspaces = ["Sales Team Jakarta", "Marketing Team", "Enterprise Ops"];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const [wsOpen, setWsOpen] = useState(false);
  const [selectedWs, setSelectedWs] = useState("Sales Team Jakarta");
  const navigate = useNavigate();

  return (
    <aside
      className="w-[240px] h-full flex flex-col border-r overflow-hidden"
      style={{
        background: "#FFFFFF",
        borderColor: "#E2E8F0",
        color: "#0F1F3D",
      }}
    >
      {/* ── Logo ── */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 flex items-center justify-center flex-shrink-0"
              style={{ background: "#0F1F3D", borderRadius: "8px" }}
            >
              <span style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700 }}>H</span>
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
          {/* Close button — tablet overlay only */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden flex items-center justify-center flex-shrink-0"
              style={{
                width: 28,
                height: 28,
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

      {/* ── Workspace Selector ── */}
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
            className="w-full flex items-center justify-between px-3 py-2.5 transition-colors"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              color: "#0F1F3D",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            <span>{selectedWs}</span>
            {wsOpen ? (
              <ChevronUp size={14} style={{ color: "#8A97A8", flexShrink: 0 }} />
            ) : (
              <ChevronDown size={14} style={{ color: "#8A97A8", flexShrink: 0 }} />
            )}
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
                  onClick={() => {
                    setSelectedWs(ws);
                    setWsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 transition-colors"
                  style={{ fontSize: "13px", color: "#0F1F3D" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "transparent")
                  }
                >
                  <span>{ws}</span>
                  {selectedWs === ws && (
                    <Check size={13} style={{ color: "#4F46E5" }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Cari Leads Button ── */}
      <div className="px-4 pb-5">
        <button
          onClick={() => navigate("/new-search")}
          className="w-full flex items-center justify-center gap-2 py-3 transition-all"
          style={{
            background: "#4F46E5",
            color: "#FFFFFF",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "-0.1px",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#4338CA")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#4F46E5")
          }
        >
          <Search size={15} strokeWidth={2.5} />
          Cari Leads
        </button>
      </div>

      {/* ── Menu Section ── */}
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

        <div className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className="flex items-center gap-3 px-3 py-2.5 transition-all"
              style={({ isActive }) =>
                isActive
                  ? {
                      background: "#F1F5F9",
                      color: "#0F1F3D",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 500,
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
                if (!el.dataset.active) el.style.background = "#F8FAFC";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                if (!el.dataset.active) el.style.background = "transparent";
              }}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={16}
                    style={{
                      color: isActive ? "#0F1F3D" : "#8A97A8",
                      flexShrink: 0,
                    }}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ── Bottom: Logout + User ── */}
      <div
        className="px-4 pb-5 pt-3"
        style={{ borderTop: "1px solid #E2E8F0" }}
      >
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 transition-colors mb-3"
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
          <LogOut size={16} style={{ color: "#8A97A8" }} />
          <span>Log out</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-3">
          <div
            className="w-8 h-8 flex items-center justify-center text-white flex-shrink-0"
            style={{
              background: "#0F1F3D",
              borderRadius: "50%",
              fontSize: "11px",
              fontWeight: 600,
            }}
          >
            RD
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#0F1F3D", lineHeight: 1.2 }}>
              Rizky Dwi
            </p>
            <p style={{ fontSize: "11px", color: "#8A97A8", lineHeight: 1.3 }}>Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
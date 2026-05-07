import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    /**
     * Outer shell: h-screen + overflow-hidden
     * This creates the bounded viewport box. Everything inside is constrained to this.
     */
    <div className="flex h-screen overflow-hidden" style={{ background: "#F8FAFC" }}>

      {/* ── DESKTOP sidebar — plain flex child, h-full, never scrolls ── */}
      <div className="hidden lg:flex flex-shrink-0" style={{ height: "100%" }}>
        <Sidebar />
      </div>

      {/* ── MOBILE backdrop ── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: "rgba(15,31,61,0.45)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── MOBILE sidebar — fixed overlay ── */}
      <div
        className={[
          "lg:hidden fixed inset-y-0 left-0 z-50",
          "transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ── Content column ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden" style={{ height: "100%" }}>

        {/* ── Mobile top bar ── */}
        <div
          className="lg:hidden flex items-center justify-between flex-shrink-0"
          style={{
            height: "52px",
            background: "#FFFFFF",
            borderBottom: "1px solid #E2E8F0",
            padding: "0 16px",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 30,
                height: 30,
                background: "#0F1F3D",
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>H</span>
            </div>
            <div>
              <p style={{ color: "#0F1F3D", fontSize: 13, fontWeight: 700, lineHeight: 1.1 }}>
                HelicoLeads
              </p>
              <p style={{ color: "#94A3B8", fontSize: 10, lineHeight: 1.1 }}>
                Lead Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              padding: "6px 8px",
              borderRadius: 6,
              border: "1px solid #E2E8F0",
              background: "#F8FAFC",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Menu size={17} style={{ color: "#0F1F3D" }} />
            <span style={{ color: "#0F1F3D", fontSize: 12, fontWeight: 600 }}>Menu</span>
          </button>
        </div>

        {/*
         * <main> — flex-1 + min-h-0 gives it a BOUNDED height from the flex parent.
         * overflow-y-auto allows normal pages (Dashboard, etc.) to scroll.
         * display:flex flex-col lets split-pane pages (AIIntelligence) use flex-1 to fill it.
         */}
        <main
          className="flex-1 min-h-0 overflow-y-auto"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

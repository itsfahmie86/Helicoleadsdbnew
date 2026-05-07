import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./components/pages/DashboardPage";
import { NewSearchPage } from "./components/pages/NewSearchPage";
import { DatabaseLeadsPage } from "./components/pages/DatabaseLeadsPage";
import { AIIntelligencePage } from "./components/pages/AIIntelligencePage";
import { OutreachCRMPage } from "./components/pages/OutreachCRMPage";
import { MarketInsightsPage } from "./components/pages/MarketInsightsPage";
import { AnalyticsROIPage } from "./components/pages/AnalyticsROIPage";
import { PricingPage } from "./components/pages/PricingPage";
import { SettingsPage } from "./components/pages/SettingsPage";
import { ErrorsDemoPage } from "./components/pages/ErrorsDemoPage";

// ─── Error Pages ─────────────────────────────────────────────────────────────
import { Error404Page }      from "./components/errors/Error404Page";
import { Error401Page }      from "./components/errors/Error401Page";
import { Error403Page }      from "./components/errors/Error403Page";
import { Error500Page }      from "./components/errors/Error500Page";

export const router = createBrowserRouter([
  // ════════════════════════════════════════════════════════════════════════════
  //  MAIN APP — dengan sidebar Layout
  // ════════════════════════════════════════════════════════════════════════════
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true,             Component: DashboardPage     },
      { path: "new-search",      Component: NewSearchPage      },
      { path: "database-leads",  Component: DatabaseLeadsPage  },
      { path: "ai-intelligence", Component: AIIntelligencePage },
      { path: "outreach-crm",    Component: OutreachCRMPage    },
      { path: "market-insights", Component: MarketInsightsPage },
      { path: "analytics",       Component: AnalyticsROIPage   },
      { path: "pricing",         Component: PricingPage        },
      { path: "settings",        Component: SettingsPage       },
      { path: "errors-demo",     Component: ErrorsDemoPage     },

      // ── 404 dalam Layout (salah navigasi internal — tampil dengan sidebar) ──
      { path: "*",               Component: Error404Page       },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  //  STANDALONE ERROR PAGES — tanpa sidebar
  //  Backend / interceptor cukup redirect ke: /401, /403, /500
  //  Contoh: window.location.href = '/401'
  //          router.navigate('/403?feature=Export+CSV&reason=premium')
  //          router.navigate('/500?msg=DB+crash&ref=TRC-abc123')
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * 401 — Belum login / session expired
   * Query params: ?msg=Pesan, ?redirect=/target-setelah-login
   */
  { path: "/401", Component: Error401Page },

  /**
   * 403 — Akses ditolak (premium gate / admin only)
   * Query params: ?msg=Pesan, ?feature=Nama+Fitur, ?reason=premium|admin
   */
  { path: "/403", Component: Error403Page },

  /**
   * 500 — Internal server error
   * Query params: ?msg=Pesan, ?code=ERR_CODE, ?ref=TRACE_ID
   */
  { path: "/500", Component: Error500Page },
]);
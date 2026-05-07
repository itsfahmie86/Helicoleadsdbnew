/**
 * Skeletons.tsx — HelicoLeads
 * Centralised skeleton loading components for every page.
 * Each skeleton precisely mirrors the real page layout so the
 * transition from loading → content feels seamless.
 */

import { Skeleton } from "./ui/skeleton";

/* ─── Shared primitive ─────────────────────────────────────────────────────── */
const S = ({ className = "" }: { className?: string }) => (
  <Skeleton className={`bg-[#EEF1F7] ${className}`} />
);

/* ═══════════════════════════════════════════════════════════════════════════════
   DASHBOARD PAGE
══════════════════════════════════════════════════════════════════════════════ */
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen p-5 md:p-6 lg:p-8" style={{ background: "#F8FAFC" }}>

      {/* Header greeting */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 lg:mb-8">
        <div className="space-y-2.5">
          <S className="h-7 w-52 rounded-lg" />
          <S className="h-4 w-80 rounded-md" />
          <S className="h-4 w-64 rounded-md" />
        </div>
        <S className="h-9 w-36 rounded-lg flex-shrink-0" />
      </div>

      {/* KPI Cards — 4 col */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 lg:mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-lg border border-[#E2E8F0] bg-white">
            <div className="flex items-center justify-between mb-4">
              <S className="h-3.5 w-24 rounded" />
              <S className="h-8 w-8 rounded-lg flex-shrink-0" />
            </div>
            <S className="h-8 w-20 rounded-md mb-3" />
            <div className="flex items-center gap-2">
              <S className="h-5 w-14 rounded" />
              <S className="h-3.5 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Pain Alert section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <S className="h-7 w-7 rounded-lg" />
            <div className="space-y-1.5">
              <S className="h-4 w-24 rounded" />
              <S className="h-3 w-36 rounded" />
            </div>
          </div>
          <S className="h-4 w-28 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 rounded-lg border border-[#E2E8F0] bg-white flex flex-col gap-3.5">
              {/* Card top */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <S className="h-10 w-10 rounded-lg flex-shrink-0" />
                  <div className="space-y-1.5">
                    <S className="h-4 w-32 rounded" />
                    <S className="h-3 w-24 rounded" />
                  </div>
                </div>
                <S className="h-5 w-20 rounded flex-shrink-0" />
              </div>
              {/* Pain score bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <S className="h-3 w-16 rounded" />
                  <S className="h-3 w-10 rounded" />
                </div>
                <S className="h-1.5 w-full rounded-full" />
              </div>
              {/* Quote block */}
              <S className="h-16 w-full rounded-lg" />
              {/* Bottom */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <S className="h-3 w-16 rounded" />
                  <S className="h-4 w-24 rounded" />
                </div>
                <S className="h-5 w-20 rounded" />
              </div>
              {/* Button */}
              <S className="h-9 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Outreach Queue */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <S className="h-7 w-7 rounded-lg" />
            <div className="space-y-1.5">
              <S className="h-4 w-28 rounded" />
              <S className="h-3 w-24 rounded" />
            </div>
          </div>
          <S className="h-4 w-20 rounded" />
        </div>
        <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4"
              style={{ borderBottom: i < 4 ? "1px solid #F1F5F9" : "none" }}
            >
              <S className="h-3.5 w-5 rounded flex-shrink-0" />
              <S className="h-9 w-9 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <S className="h-3.5 w-36 rounded" />
                  <S className="h-4 w-16 rounded" />
                </div>
                <div className="flex items-center gap-3">
                  <S className="h-3 w-28 rounded" />
                  <S className="h-3 w-24 rounded" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 w-16 flex-shrink-0">
                <S className="h-5 w-8 rounded" />
                <S className="h-3 w-14 rounded" />
              </div>
              <S className="h-8 w-28 rounded-lg flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DATABASE LEADS PAGE
══════════════════════════════════════════════════════════════════════════════ */
export function DatabaseLeadsSkeleton() {
  return (
    <div className="min-h-screen p-5 md:p-6 lg:p-8" style={{ background: "#F8FAFC" }}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
        <div className="space-y-2">
          <S className="h-7 w-48 rounded-lg" />
          <S className="h-4 w-64 rounded-md" />
        </div>
        <S className="h-10 w-64 rounded-lg flex-shrink-0" />
      </div>

      {/* Stats strip — 4 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3.5 rounded-lg border border-[#E2E8F0] bg-white">
            <S className="h-9 w-9 rounded-lg flex-shrink-0" />
            <div className="space-y-1.5">
              <S className="h-6 w-8 rounded" />
              <S className="h-3 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <S className="h-8 w-48 rounded-lg" />
          <div className="w-px h-5 bg-[#E2E8F0]" />
          <S className="h-8 w-20 rounded-lg" />
          <S className="h-8 w-20 rounded-lg" />
          <S className="h-8 w-24 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <S className="h-8 w-28 rounded-lg" />
          <S className="h-8 w-24 rounded-lg" />
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 mb-4">
        <S className="h-3.5 w-40 rounded" />
      </div>

      {/* Card grid — 9 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
            <S className="h-0.5 w-full" />
            <div className="p-5 flex flex-col gap-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <S className="h-10 w-10 rounded-lg flex-shrink-0" />
                  <div className="space-y-1.5">
                    <S className="h-3.5 w-32 rounded" />
                    <S className="h-3 w-24 rounded" />
                  </div>
                </div>
                <S className="h-6 w-16 rounded-lg flex-shrink-0" />
              </div>
              <div className="flex items-center gap-2">
                <S className="h-5 w-20 rounded" />
                <S className="h-4 w-16 rounded ml-auto" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <S className="h-3 w-16 rounded" />
                  <S className="h-3 w-10 rounded" />
                </div>
                <S className="h-1.5 w-full rounded-full" />
              </div>
              <div className="space-y-1.5">
                <S className="h-3 w-full rounded" />
                <S className="h-3 w-4/5 rounded" />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
                <div className="space-y-1">
                  <S className="h-3 w-14 rounded" />
                  <S className="h-4 w-24 rounded" />
                </div>
                <S className="h-3 w-20 rounded" />
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <S className="h-8 flex-1 rounded-lg" />
                <S className="h-8 flex-1 rounded-lg" />
                <S className="h-8 w-8 rounded-lg flex-shrink-0" />
                <S className="h-8 w-8 rounded-lg flex-shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   AI INTELLIGENCE PAGE  (split-panel layout)
══════════════════════════════════════════════════════════════════════════════ */
export function AIIntelligenceSkeleton() {
  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ background: "#F8FAFC", overflow: "hidden" }}>

      {/* Page header */}
      <div
        className="px-5 md:px-8 pt-5 md:pt-8 pb-4 md:pb-6 flex-shrink-0 bg-white"
        style={{ borderBottom: "1px solid #E2E8F0" }}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <S className="h-8 w-8 rounded-lg" />
              <S className="h-7 w-40 rounded-lg" />
              <S className="h-6 w-36 rounded-lg" />
            </div>
            <S className="h-4 w-64 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
                <S className="h-7 w-7 rounded-md flex-shrink-0" />
                <div className="space-y-1.5">
                  <S className="h-5 w-6 rounded" />
                  <S className="h-2.5 w-20 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Split view */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left panel — lead list */}
        <div
          className="flex flex-col flex-shrink-0"
          style={{ width: "320px", borderRight: "1px solid #E2E8F0", background: "#FFFFFF", height: "100%", overflow: "hidden" }}
        >
          {/* Search + filter */}
          <div className="p-4 space-y-3" style={{ borderBottom: "1px solid #E2E8F0" }}>
            <S className="h-9 w-full rounded-lg" />
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <S key={i} className="h-7 flex-1 rounded-md" />
              ))}
            </div>
          </div>

          {/* Lead list items */}
          <div className="flex-1 overflow-hidden">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3.5"
                style={{ borderBottom: "1px solid #F1F5F9" }}
              >
                <S className="h-10 w-10 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <S className="h-3.5 w-28 rounded" />
                    <S className="h-5 w-12 rounded flex-shrink-0" />
                  </div>
                  <S className="h-3 w-24 rounded" />
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <S className="h-2.5 w-16 rounded" />
                      <S className="h-2.5 w-8 rounded" />
                    </div>
                    <S className="h-1.5 w-full rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — detail */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Lead header card */}
          <div className="p-5 rounded-lg border border-[#E2E8F0] bg-white">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <S className="h-14 w-14 rounded-xl flex-shrink-0" />
                <div className="space-y-2">
                  <S className="h-5 w-40 rounded-lg" />
                  <S className="h-3.5 w-28 rounded" />
                  <div className="flex items-center gap-2">
                    <S className="h-5 w-16 rounded" />
                    <S className="h-5 w-20 rounded" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <S className="h-9 w-28 rounded-lg" />
                <S className="h-9 w-36 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#F8FAFC] space-y-1.5">
                  <S className="h-3 w-16 rounded" />
                  <S className="h-5 w-12 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment overview */}
          <div className="p-5 rounded-lg border border-[#E2E8F0] bg-white space-y-4">
            <S className="h-4 w-40 rounded" />
            <div className="flex items-center gap-4">
              <S className="h-16 w-16 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <S className="h-3.5 w-32 rounded" />
                <S className="h-2 w-full rounded-full" />
                <S className="h-3 w-48 rounded" />
              </div>
            </div>
          </div>

          {/* Aspect bars */}
          <div className="p-5 rounded-lg border border-[#E2E8F0] bg-white space-y-3">
            <S className="h-4 w-36 rounded mb-1" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <S className="h-3 w-24 rounded flex-shrink-0" />
                <S className="h-1.5 flex-1 rounded-full" />
                <S className="h-3 w-6 rounded flex-shrink-0" />
                <S className="h-5 w-16 rounded flex-shrink-0" />
                <S className="h-3 w-3 rounded flex-shrink-0" />
              </div>
            ))}
          </div>

          {/* AI Summary */}
          <div className="p-5 rounded-lg border border-[#E2E8F0] bg-white space-y-2.5">
            <div className="flex items-center gap-2 mb-3">
              <S className="h-7 w-7 rounded-lg" />
              <S className="h-4 w-32 rounded" />
            </div>
            <S className="h-3.5 w-full rounded" />
            <S className="h-3.5 w-full rounded" />
            <S className="h-3.5 w-5/6 rounded" />
            <S className="h-3.5 w-4/5 rounded" />
          </div>

          {/* Opportunities */}
          <div className="p-5 rounded-lg border border-[#E2E8F0] bg-white space-y-2.5">
            <S className="h-4 w-40 rounded mb-1" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <S className="h-5 w-5 rounded flex-shrink-0 mt-0.5" />
                <S className="h-3.5 flex-1 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   OUTREACH CRM PAGE
══════════════════════════════════════════════════════════════════════════════ */
export function OutreachCRMSkeleton() {
  return (
    <div className="min-h-screen p-5 md:p-6 lg:p-8" style={{ background: "#F8FAFC" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <S className="h-8 w-8 rounded-lg" />
            <S className="h-7 w-36 rounded-lg" />
          </div>
          <S className="h-4 w-72 rounded-md ml-11" />
        </div>
        <S className="h-10 w-40 rounded-lg flex-shrink-0" />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border border-[#E2E8F0] bg-white space-y-3">
            <div className="flex items-center justify-between">
              <S className="h-3.5 w-24 rounded" />
              <S className="h-8 w-8 rounded-lg" />
            </div>
            <S className="h-7 w-16 rounded-md" />
            <S className="h-3 w-28 rounded" />
            <S className="h-5 w-32 rounded" />
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div className="flex flex-col xl:flex-row gap-5">

        {/* Left — queue */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <S className="h-7 w-7 rounded-lg" />
              <div className="space-y-1.5">
                <S className="h-4 w-32 rounded" />
                <S className="h-3 w-24 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <S className="h-5 w-16 rounded" />
              <S className="h-4 w-16 rounded" />
            </div>
          </div>
          <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
            {/* Table header */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-[#FAFBFC]"
              style={{ borderBottom: "1px solid #F1F5F9" }}>
              {[5, 9, 999, 68, 100, 120].map((w, j) => (
                <S key={j} className={`h-3 ${w === 999 ? "flex-1" : `w-${w === 68 ? 16 : w === 100 ? 24 : w === 120 ? 28 : w === 9 ? 9 : 5}`} rounded`} />
              ))}
            </div>
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-4 py-3"
                style={{ borderBottom: i < 6 ? "1px solid #F1F5F9" : "none" }}
              >
                <S className="h-3.5 w-5 rounded flex-shrink-0" />
                <S className="h-9 w-9 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <S className="h-3.5 w-32 rounded" />
                    <S className="h-4 w-16 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <S className="h-3 w-24 rounded" />
                    <S className="h-3 w-16 rounded" />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 flex-shrink-0 w-16">
                  <S className="h-5 w-8 rounded" />
                  <S className="h-1 w-11 rounded-full" />
                </div>
                <S className="h-7 w-24 rounded-md flex-shrink-0" />
                <S className="h-7 w-24 rounded-md flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Right — campaigns */}
        <div className="flex flex-col gap-5 xl:w-[350px] xl:flex-shrink-0">
          <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
            {/* Section header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <div className="flex items-center gap-2.5">
                <S className="h-7 w-7 rounded-lg" />
                <div className="space-y-1.5">
                  <S className="h-4 w-24 rounded" />
                  <S className="h-3 w-36 rounded" />
                </div>
              </div>
              <S className="h-7 w-14 rounded-md" />
            </div>
            {/* Tabs */}
            <div className="flex px-5 gap-1" style={{ borderBottom: "1px solid #F1F5F9" }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <S key={i} className="h-8 w-20 rounded-t-md" />
              ))}
            </div>
            {/* Campaign rows */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-5 py-4 space-y-2.5"
                style={{ borderBottom: i < 2 ? "1px solid #F1F5F9" : "none" }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1.5 mr-2">
                    <S className="h-3.5 w-40 rounded" />
                    <div className="flex items-center gap-3">
                      <S className="h-3 w-16 rounded" />
                      <S className="h-3 w-20 rounded" />
                    </div>
                  </div>
                  <S className="h-5 w-20 rounded" />
                </div>
                <S className="h-1.5 w-full rounded-full" />
                <div className="flex items-center justify-between">
                  <S className="h-3 w-24 rounded" />
                  <div className="flex items-center gap-1.5">
                    <S className="h-6 w-6 rounded" />
                    <S className="h-6 w-6 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ANALYTICS ROI PAGE
══════════════════════════════════════════════════════════════════════════════ */
export function AnalyticsROISkeleton() {
  return (
    <div className="min-h-screen p-5 md:p-6 lg:p-8" style={{ background: "#F8FAFC" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <S className="h-8 w-8 rounded-lg" />
            <S className="h-7 w-40 rounded-lg" />
          </div>
          <S className="h-4 w-72 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <S key={i} className="h-8 w-16 rounded-lg" />
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-lg border border-[#E2E8F0] bg-white space-y-3">
            <div className="flex items-center justify-between">
              <S className="h-3.5 w-24 rounded" />
              <S className="h-8 w-8 rounded-lg" />
            </div>
            <S className="h-8 w-24 rounded-md" />
            <S className="h-3 w-28 rounded" />
            <S className="h-5 w-28 rounded" />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Main bar/line chart */}
        <div className="lg:col-span-2 p-5 rounded-lg border border-[#E2E8F0] bg-white space-y-4">
          <div className="flex items-center justify-between">
            <S className="h-4 w-36 rounded" />
            <S className="h-7 w-24 rounded-md" />
          </div>
          <S className="h-[220px] w-full rounded-lg" />
        </div>
        {/* Pie chart */}
        <div className="p-5 rounded-lg border border-[#E2E8F0] bg-white space-y-4">
          <S className="h-4 w-32 rounded" />
          <S className="h-[160px] w-[160px] rounded-full mx-auto" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <S className="h-3 w-3 rounded-sm" />
                  <S className="h-3 w-24 rounded" />
                </div>
                <S className="h-3 w-8 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Area chart */}
      <div className="p-5 rounded-lg border border-[#E2E8F0] bg-white mb-5 space-y-4">
        <S className="h-4 w-48 rounded" />
        <S className="h-[160px] w-full rounded-lg" />
      </div>

      {/* Campaign table */}
      <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden mb-5">
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid #E2E8F0" }}>
          <S className="h-4 w-36 rounded" />
          <S className="h-7 w-20 rounded-md" />
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="flex items-center gap-4 px-5 py-2.5 bg-[#FAFBFC]"
              style={{ borderBottom: "1px solid #F1F5F9" }}>
              {Array.from({ length: 6 }).map((_, j) => (
                <S key={j} className="h-3 flex-1 rounded" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5"
                style={{ borderBottom: i < 4 ? "1px solid #F1F5F9" : "none" }}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <S key={j} className="h-3.5 flex-1 rounded" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI calculator */}
      <div className="p-5 rounded-lg border border-[#E2E8F0] bg-white">
        <div className="flex items-center gap-2.5 mb-5">
          <S className="h-8 w-8 rounded-lg" />
          <S className="h-4 w-40 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-4 md:col-span-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <S className="h-3.5 w-40 rounded" />
                <S className="h-9 w-full rounded-lg" />
              </div>
            ))}
          </div>
          <S className="h-[200px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MARKET INSIGHTS PAGE
══════════════════════════════════════════════════════════════════════════════ */
export function MarketInsightsSkeleton() {
  return (
    <div className="min-h-screen p-5 md:p-6 lg:p-8" style={{ background: "#F8FAFC" }}>

      {/* Header + city selector */}
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <S className="h-8 w-8 rounded-lg" />
            <S className="h-7 w-44 rounded-lg" />
          </div>
          <S className="h-4 w-64 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <S className="h-9 w-40 rounded-lg" />
          <S className="h-9 w-9 rounded-lg" />
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border border-[#E2E8F0] bg-white">
            <div className="flex items-center gap-2.5">
              <S className="h-9 w-9 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <S className="h-3 w-20 rounded" />
                <S className="h-6 w-14 rounded" />
                <div className="flex items-center gap-1">
                  <S className="h-3 w-3 rounded" />
                  <S className="h-3 w-16 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content — map + right panel */}
      <div className="flex flex-col xl:flex-row gap-5">

        {/* Map */}
        <div className="flex-1 min-w-0 rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid #E2E8F0" }}>
            <S className="h-4 w-36 rounded" />
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <S key={i} className="h-7 w-24 rounded-md" />
              ))}
            </div>
          </div>
          <S className="h-[380px] w-full" />
          {/* Map legend */}
          <div className="flex items-center gap-4 px-5 py-3" style={{ borderTop: "1px solid #F1F5F9" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <S className="h-3 w-3 rounded-full" />
                <S className="h-3 w-14 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4 xl:w-[320px] xl:flex-shrink-0">

          {/* Opportunity areas */}
          <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
            <div className="px-5 py-4 space-y-1.5" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <S className="h-4 w-36 rounded" />
              <S className="h-3 w-48 rounded" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3"
                style={{ borderBottom: i < 4 ? "1px solid #F1F5F9" : "none" }}>
                <S className="h-7 w-7 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <S className="h-3.5 w-24 rounded" />
                    <S className="h-5 w-10 rounded" />
                  </div>
                  <S className="h-3 w-36 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Category trends */}
          <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
            <div className="px-5 py-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <S className="h-4 w-32 rounded" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-5 py-3 space-y-1.5"
                style={{ borderBottom: i < 5 ? "1px solid #F1F5F9" : "none" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <S className="h-2 w-2 rounded-full" />
                    <S className="h-3 w-32 rounded" />
                  </div>
                  <S className="h-5 w-14 rounded" />
                </div>
                <S className="h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   NEW SEARCH PAGE — search results skeleton
   (shown during isSearching state, mimics the table result layout)
══════════════════════════════════════════════════════════════════════════════ */
export function SearchResultsSkeleton({ query }: { query: string }) {
  return (
    <div className="space-y-5">

      {/* AI query summary card — shimmer version */}
      <div
        className="flex items-center gap-4 px-5 py-4 rounded-lg"
        style={{ background: "#FAFBFF", border: "1px solid #C7D2FE" }}
      >
        <S className="h-9 w-9 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <S className="h-3 w-24 rounded" />
          <S className="h-4 w-64 rounded" />
        </div>
        <div className="flex items-center gap-5 flex-shrink-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-right space-y-1">
              <S className="h-4 w-10 rounded" />
              <S className="h-2.5 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <S className="h-4 w-32 rounded" />
          <S className="h-3 w-52 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <S className="h-8 w-36 rounded-lg" />
          <S className="h-8 w-28 rounded-lg" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden" style={{ minWidth: "860px" }}>
        {/* Table header */}
        <div className="flex items-center gap-4 px-4 py-2.5 bg-[#FAFBFC]"
          style={{ borderBottom: "1px solid #E2E8F0" }}>
          {[220, 80, 60, 140, 999, 80, 100, 80].map((w, i) => (
            <S key={i} className={`h-3 rounded ${w === 999 ? "flex-1" : ""}`}
              style={{ width: w !== 999 ? `${w * 0.6}px` : undefined }} />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-4"
            style={{ borderBottom: i < 5 ? "1px solid #F1F5F9" : "none" }}
          >
            <div className="flex items-center gap-3" style={{ width: "220px", flexShrink: 0 }}>
              <S className="h-8 w-8 rounded-lg flex-shrink-0" />
              <div className="space-y-1.5">
                <S className="h-3.5 w-28 rounded" />
                <S className="h-2.5 w-20 rounded" />
              </div>
            </div>
            <S className="h-5 w-16 rounded flex-shrink-0" />
            <div className="flex items-center gap-1" style={{ width: "60px", flexShrink: 0 }}>
              <S className="h-3 w-3 rounded" />
              <S className="h-3 w-6 rounded" />
            </div>
            <div className="space-y-1" style={{ width: "140px", flexShrink: 0 }}>
              <div className="flex justify-between">
                <S className="h-3.5 w-6 rounded" />
                <S className="h-3 w-8 rounded" />
              </div>
              <S className="h-1 w-full rounded-full" />
            </div>
            <S className="h-3.5 flex-1 rounded" />
            <S className="h-6 w-16 rounded flex-shrink-0" />
            <div className="space-y-1" style={{ width: "100px", flexShrink: 0 }}>
              <S className="h-3 w-14 rounded" />
              <S className="h-3.5 w-20 rounded" />
            </div>
            <div className="flex items-center gap-1.5" style={{ flexShrink: 0 }}>
              <S className="h-7 w-7 rounded-md" />
              <S className="h-7 w-7 rounded-md" />
              <S className="h-7 w-7 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Subtle animated label below table */}
      <div className="flex items-center justify-center gap-2 py-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{ background: "#A5B4FC", animationDelay: `${i * 0.15}s` }}
          />
        ))}
        <span style={{ color: "#94A3B8", fontSize: "12px", marginLeft: "6px" }}>
          Memuat {SEARCH_RESULTS_COUNT} hasil untuk "{query}"…
        </span>
      </div>
    </div>
  );
}

// Internal constant just for the label
const SEARCH_RESULTS_COUNT = 6;

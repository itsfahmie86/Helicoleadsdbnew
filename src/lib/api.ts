/**
 * PAKE DATA — Contoh penggunaan di komponen Overview
 * 
 * Cara pakai:
 * 1. Paste pakedata-api-client.ts ke src/lib/api.ts
 * 2. Copy bagian yang relevan ke komponen kamu
 * 3. Sesuaikan className dengan Tailwind yang sudah ada
 */

import { useStats, useLeads, getBadgeColor, getScoreColor, getPainLabel } from '@/lib/api';

// ============================================================
// KOMPONEN: KPI Cards (ganti 4 card dummy di Overview)
// ============================================================
export function KPICards() {
  const { stats, loading } = useStats();

  if (loading) return (
    <div className="grid grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">Total leads</p>
        <p className="text-2xl font-medium">{stats.total}</p>
        <p className="text-xs text-green-600 mt-1">↑ {stats.new_this_week} minggu ini</p>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">Hot leads</p>
        <p className="text-2xl font-medium text-red-500">{stats.hot}</p>
        <p className="text-xs text-gray-400 mt-1">Pain score 70+</p>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">Warm leads</p>
        <p className="text-2xl font-medium text-amber-500">{stats.warm}</p>
        <p className="text-xs text-gray-400 mt-1">Score 50–69</p>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">Baru minggu ini</p>
        <p className="text-2xl font-medium text-blue-500">{stats.new_this_week}</p>
        <p className="text-xs text-gray-400 mt-1">Leads baru masuk</p>
      </div>
    </div>
  );
}

// ============================================================
// KOMPONEN: Lead Cards Grid (ganti dummy leads di Overview)
// ============================================================
export function HotLeadsGrid({ onSelect }: { onSelect?: (placeId: string) => void }) {
  const { leads, loading } = useLeads({ filter: 'hot', limit: 4 });

  if (loading) return (
    <div className="grid grid-cols-2 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      {leads.map(lead => (
        <div
          key={lead.place_id}
          onClick={() => onSelect?.(lead.place_id)}
          className="bg-white border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-gray-300 transition-colors"
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
              {lead.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{lead.name}</p>
              <p className="text-xs text-gray-400">{lead.niche}</p>
            </div>
            <span className={`text-xl font-medium ${getScoreColor(lead.lead_score)}`}>
              {lead.lead_score}
            </span>
          </div>

          {/* Pain tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {lead.primary_pain_category && (
              <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700">
                {getPainLabel(lead.primary_pain_category)}
              </span>
            )}
            <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(lead.badge)}`}>
              {lead.badge}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>📍 {lead.city}</span>
            <span>⭐ {lead.rating} ({lead.review_count})</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// KOMPONEN: My Leads Table (halaman My Leads)
// ============================================================
export function LeadsTable() {
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const { leads, loading } = useLeads({ filter, limit: 20 });

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'hot', 'warm', 'cold'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              filter === f
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {leads.map(lead => (
            <div key={lead.place_id} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors cursor-pointer">
              <span className={`text-lg font-medium w-10 text-center ${getScoreColor(lead.lead_score)}`}>
                {lead.lead_score}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{lead.name}</p>
                <p className="text-xs text-gray-400">{lead.city} · {lead.niche}</p>
              </div>
              {lead.primary_pain_category && (
                <span className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full hidden sm:block">
                  {getPainLabel(lead.primary_pain_category)}
                </span>
              )}
              <span className="text-xs text-gray-400">⭐ {lead.rating}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(lead.badge)}`}>
                {lead.badge}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// KOMPONEN: Pain Radar (halaman Pain Radar)
// ============================================================
import { usePainRadar, getTrendColor } from '@/lib/api';

export function PainRadarList() {
  const { leads, total, date, loading } = usePainRadar({ limit: 20 });

  if (loading) return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <div>
      <p className="text-xs text-gray-400 mb-4">
        {total} bisnis dipantau · Snapshot {date}
      </p>
      <div className="space-y-2">
        {leads.map(lead => (
          <div key={lead.place_id} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl">
            {/* Delta */}
            <div className="text-center w-12 flex-shrink-0">
              <p className={`text-base font-medium ${getTrendColor(lead.score_delta)}`}>
                {lead.trend_icon}
              </p>
              <p className={`text-xs ${getTrendColor(lead.score_delta)}`}>
                +{lead.score_delta}
              </p>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{lead.name}</p>
              <p className="text-xs text-gray-400">
                {lead.city} · ⭐{lead.rating} · {lead.pain_count} pain
                {lead.is_new_this_week && <span className="ml-1 text-green-600">· baru</span>}
              </p>
            </div>

            {/* Score */}
            <div className="text-right">
              <p className={`text-lg font-medium ${getScoreColor(lead.lead_score)}`}>
                {lead.lead_score}
              </p>
              <p className="text-xs text-gray-400">{lead.trend_label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
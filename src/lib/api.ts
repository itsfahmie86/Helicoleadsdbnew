import { useState, useEffect } from 'react';

const N8N_BASE = 'https://prevocational-taperingly-conception.ngrok-free.dev';
const ENDPOINTS = {
  leadsApi: `${N8N_BASE}/webhook/pakedata-leads-api`,
  draftGenerator: `${N8N_BASE}/webhook/pakedata-draft-generator`,
};

export interface Lead {
  place_id: string; name: string; niche: string; city: string;
  rating: number; review_count: number; lead_score: number;
  badge: string; has_complaints: boolean; has_critical: boolean;
  primary_pain_category?: string; primary_pain_quote?: string;
  phone?: string; website?: string; maps_url?: string;
  insight_card?: string; draft_message?: string;
  revenue_loss_min?: number; revenue_loss_max?: number;
  closing_probability?: string; updated_at?: string;
}

export interface Stats {
  total: number; hot: number; warm: number; cold: number; new_this_week: number;
}

async function callAPI<T>(endpoint: string, body: Record<string, unknown>): Promise<T | null> {
  try {
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
      body: JSON.stringify(body),
    });
    if (!resp.ok) return null;
    return await resp.json() as T;
  } catch { return null; }
}

export const api = {
  async getStats(): Promise<Stats> {
    const res = await callAPI<{ success: boolean; data: Stats }>(ENDPOINTS.leadsApi, { action: 'get_stats' });
    return res?.data ?? { total: 0, hot: 0, warm: 0, cold: 0, new_this_week: 0 };
  },
  async getLeads(opts: { niche?: string; city?: string; filter?: string; limit?: number; offset?: number } = {}): Promise<Lead[]> {
    const res = await callAPI<{ success: boolean; data: { leads: Lead[] } }>(ENDPOINTS.leadsApi, {
      action: 'get_leads', ...opts, limit: opts.limit ?? 20, filter: opts.filter ?? 'all',
    });
    return res?.data?.leads ?? [];
  },
  async getPainRadar(opts: { city?: string; niche?: string; limit?: number } = {}) {
    const res = await callAPI<{ success: boolean; data: { leads: unknown[]; total: number; date: string } }>(
      ENDPOINTS.leadsApi, { action: 'get_pain_radar', ...opts, limit: opts.limit ?? 20 }
    );
    return res?.data ?? { leads: [], total: 0, date: '' };
  },
  async getMarketInsight() {
    const res = await callAPI<{ success: boolean; data: { by_niche: unknown[]; total_leads: number } }>(
      ENDPOINTS.leadsApi, { action: 'get_market_insight' }
    );
    return res?.data ?? { by_niche: [], total_leads: 0 };
  },
  async generateDraft(opts: { place_id: string; mode?: string; channel?: string; sender_name?: string; sender_company?: string }) {
    return callAPI(ENDPOINTS.draftGenerator, { mode: 'agensi', channel: 'whatsapp', ...opts });
  },
};

export function useStats() {
  const [stats, setStats] = useState<Stats>({ total: 0, hot: 0, warm: 0, cold: 0, new_this_week: 0 });
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.getStats().then(d => { setStats(d); setLoading(false); }); }, []);
  return { stats, loading };
}

export function useLeads(opts: Parameters<typeof api.getLeads>[0] = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    api.getLeads(opts).then(d => { setLeads(d); setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(opts)]);
  return { leads, loading };
}

export function usePainRadar(opts: Parameters<typeof api.getPainRadar>[0] = {}) {
  const [data, setData] = useState<{ leads: unknown[]; total: number; date: string }>({ leads: [], total: 0, date: '' });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.getPainRadar(opts).then(d => { setData(d); setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(opts)]);
  return { ...data, loading };
}

export const getBadgeColor = (b: string) => ({ hot: 'bg-red-100 text-red-700', priority: 'bg-orange-100 text-orange-700', digital_opportunity: 'bg-blue-100 text-blue-700' }[b] ?? 'bg-gray-100 text-gray-600');
export const getScoreColor = (s: number) => s >= 70 ? 'text-red-500' : s >= 50 ? 'text-amber-500' : 'text-blue-400';
export const getTrendColor = (d: number) => d >= 15 ? 'text-red-500' : d >= 8 ? 'text-amber-500' : 'text-gray-400';
export const getPainLabel = (c: string) => ({ respon_lambat: 'Respon lambat', susah_booking: 'Booking susah', info_tidak_jelas: 'Info tidak jelas', no_reminder: 'Tidak ada reminder', pelayanan_buruk: 'Pelayanan buruk' }[c] ?? c.replace(/_/g, ' '));

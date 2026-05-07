/**
 * errorNavigation.ts — HelicoLeads Error Utility
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Utility untuk mengarahkan user ke halaman error yang sesuai.
 * Dirancang agar backend / API interceptor tinggal import dan panggil.
 *
 * ─── CARA PENGGUNAAN ─────────────────────────────────────────────────────────
 *
 * 1. Dari API Interceptor (Axios / Fetch):
 *    ─────────────────────────────────────
 *    import { redirectToError } from '@/app/lib/errorNavigation';
 *
 *    axios.interceptors.response.use(null, (error) => {
 *      const status = error?.response?.status;
 *      if (status === 401) redirectToError(401);
 *      if (status === 403) redirectToError(403, { feature: 'Export CSV' });
 *      if (status === 500) redirectToError(500, { ref: error.response.data.traceId });
 *      return Promise.reject(error);
 *    });
 *
 * 2. Dari React Router (dalam komponen):
 *    ─────────────────────────────────────
 *    import { useNavigateToError } from '@/app/lib/errorNavigation';
 *
 *    const navigateToError = useNavigateToError();
 *    navigateToError(403, { feature: 'Admin Panel', reason: 'admin' });
 *
 * 3. Dari Router instance langsung (outside React):
 *    ─────────────────────────────────────
 *    import { router } from '@/app/routes';
 *    import { buildErrorPath } from '@/app/lib/errorNavigation';
 *
 *    router.navigate(buildErrorPath(500, { msg: 'Database connection failed' }));
 *
 * ─── URL PARAMS YANG DIDUKUNG PER ERROR ─────────────────────────────────────
 *
 *  401: msg, redirect
 *  403: msg, feature, reason ("admin" | "premium")
 *  500: msg, code, ref
 *  404: (tidak ada params — selalu dari routing)
 */

import { useNavigate } from "react-router";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ErrorCode = 401 | 403 | 500;

export interface Error401Options {
  /** Pesan kustom yang ditampilkan ke user */
  msg?: string;
  /** Setelah login, redirect ke URL ini */
  redirect?: string;
}

export interface Error403Options {
  /** Pesan kustom yang ditampilkan ke user */
  msg?: string;
  /** Nama fitur yang dicoba diakses (ditampilkan di halaman error) */
  feature?: string;
  /** Jenis restriksi: "premium" (default) atau "admin" */
  reason?: "premium" | "admin";
}

export interface Error500Options {
  /** Pesan error kustom dari backend */
  msg?: string;
  /** Kode error internal (contoh: "DB_CONN_FAILED") */
  code?: string;
  /** Request ID / Trace ID dari backend untuk referensi support */
  ref?: string;
}

type ErrorOptions = Error401Options | Error403Options | Error500Options;

// ─── URL builder ─────────────────────────────────────────────────────────────

/**
 * Membuat URL path error dengan query params.
 * Contoh: buildErrorPath(403, { feature: 'Export', reason: 'premium' })
 * → "/403?feature=Export&reason=premium"
 */
export function buildErrorPath(code: ErrorCode, options?: ErrorOptions): string {
  if (!options || Object.keys(options).length === 0) return `/${code}`;

  const params = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `/${code}?${queryString}` : `/${code}`;
}

// ─── Hard redirect (tanpa React Router) ──────────────────────────────────────

/**
 * Redirect ke halaman error menggunakan window.location.
 * Gunakan ini di luar komponen React (e.g. API interceptor, service worker).
 *
 * @example
 * redirectToError(401);
 * redirectToError(403, { feature: 'Export CSV', reason: 'premium' });
 * redirectToError(500, { msg: 'Database crash', ref: 'TRC-abc123' });
 */
export function redirectToError(code: ErrorCode, options?: ErrorOptions): void {
  window.location.href = buildErrorPath(code, options);
}

// ─── React Router hook ───────────────────────────────────────────────────────

/**
 * Hook untuk navigate ke halaman error menggunakan React Router.
 * Gunakan ini dalam komponen React.
 *
 * @example
 * const navigateToError = useNavigateToError();
 * navigateToError(403, { feature: 'Admin Panel', reason: 'admin' });
 */
export function useNavigateToError() {
  const navigate = useNavigate();

  return function navigateToError(code: ErrorCode, options?: ErrorOptions): void {
    navigate(buildErrorPath(code, options));
  };
}

// ─── Convenience shortcuts ────────────────────────────────────────────────────

/** Shortcut: redirect ke 401 Unauthorized */
export const toUnauthorized = (options?: Error401Options) =>
  redirectToError(401, options);

/** Shortcut: redirect ke 403 Forbidden */
export const toForbidden = (options?: Error403Options) =>
  redirectToError(403, options);

/** Shortcut: redirect ke 500 Server Error */
export const toServerError = (options?: Error500Options) =>
  redirectToError(500, options);

// ─── HTTP status → error page mapper ─────────────────────────────────────────

/**
 * Otomatis peta HTTP status code ke halaman error yang sesuai.
 * Berguna di API interceptor generik.
 *
 * @example
 * // Di axios interceptor:
 * handleHttpError(error.response.status, error.response.data);
 */
export function handleHttpError(
  status: number,
  data?: {
    message?: string;
    code?: string;
    traceId?: string;
    feature?: string;
  }
): void {
  switch (status) {
    case 401:
      redirectToError(401, {
        msg: data?.message,
      });
      break;

    case 403:
      redirectToError(403, {
        msg: data?.message,
        feature: data?.feature,
        reason: "premium",
      });
      break;

    case 500:
    case 502:
    case 503:
    case 504:
      redirectToError(500, {
        msg: data?.message,
        code: data?.code ?? String(status),
        ref: data?.traceId,
      });
      break;

    default:
      // Status lain (404, dll) ditangani oleh React Router wildcard
      break;
  }
}

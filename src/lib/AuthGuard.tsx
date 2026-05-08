import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import type { Session } from '@supabase/supabase-js';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Running in development mode.');
      setLoading(false);
      setSession({ user: { id: 'dev-user' } } as Session);
      return;
    }

    async function initAuth() {
      // Step 1: Cek apakah ada token di URL params
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        // Set session dari token URL
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (!error && data.session) {
          // Hapus token dari URL
          window.history.replaceState({}, '', '/');
          setSession(data.session);
          setLoading(false);
          return;
        }
      }

      // Step 2: Cek session yang sudah ada
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => { setSession(session); }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#4F46E5] border-r-transparent"></div>
          <p className="mt-4 text-sm text-[#64748B]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session && isSupabaseConfigured) {
    window.location.href = 'https://auth.helicoleads.com';
    return null;
  }

  return <>{children}</>;
}

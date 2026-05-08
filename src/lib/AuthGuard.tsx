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
    // If Supabase is not configured, skip auth check (development mode)
    if (!isSupabaseConfigured) {
      console.warn('⚠️ Supabase not configured. Running in development mode without authentication.');
      setLoading(false);
      setSession({ user: { id: 'dev-user' } } as Session);
      return;
    }

    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch((error) => {
      console.error('Auth session error:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading state
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

  // Redirect to auth if no session (only in production with Supabase configured)
  if (!session && isSupabaseConfigured) {
    window.location.href = 'https://auth.helicoleads.com';
    return null;
  }

  // Render children if authenticated (or in dev mode)
  return <>{children}</>;
}

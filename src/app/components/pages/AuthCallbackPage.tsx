import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auth callback is handled by Supabase automatically
    // After successful auth, redirect to dashboard
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#4F46E5] border-r-transparent"></div>
        <p className="mt-4 text-sm text-[#64748B]">Authenticating...</p>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { supabase } from "../lib/supabase";

export default function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    
    if (accessToken && refreshToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then(() => {
        window.history.replaceState({}, '', '/');
      });
    }
  }, []);

  return <RouterProvider router={router} />;
}

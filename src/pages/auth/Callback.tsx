import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import type { EmailOtpType } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const finish = (target = "/admin/login?verified=1") => {
      if (!cancelled) {
        navigate(target, { replace: true });
      }
    };

    const confirmAuth = async () => {
      if (!supabase) {
        finish("/admin/login");
        return;
      }

      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      const search = window.location.search.startsWith("?")
        ? window.location.search.slice(1)
        : window.location.search;
      const params = new URLSearchParams(hash || search);
      const code = params.get("code");
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const tokenHash = params.get("token_hash");
      const type = params.get("type");

      try {
        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        } else if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        } else if (tokenHash && type) {
          await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as EmailOtpType,
          });
        }

        await supabase.auth.signOut();
        finish("/admin/login?verified=1");
      } catch {
        finish("/admin/login?verified=0");
      }
    };

    void confirmAuth();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-svh gap-4 bg-background">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Redirection...</p>
    </div>
  );
}

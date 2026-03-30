import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Status = "loading" | "valid" | "already" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token) { setStatus("invalid"); return; }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    fetch(`${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`, {
      headers: { apikey: anonKey },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.valid === false && data.reason === "already_unsubscribed") setStatus("already");
        else if (data.valid) setStatus("valid");
        else setStatus("invalid");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  const handleUnsubscribe = async () => {
    const { error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    setStatus(error ? "error" : "success");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="flex items-center px-6 md:px-12 py-6 border-b border-border">
        <Link to="/"><Logo /></Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-[440px] text-center">
          {status === "loading" && <p className="text-muted-foreground animate-pulse">Verifying…</p>}

          {status === "valid" && (
            <>
              <h1 className="font-serif text-[28px] mb-4">Unsubscribe</h1>
              <p className="text-[14px] text-muted-foreground mb-8">
                You will no longer receive app emails from Jaifferson. Auth emails (password reset, etc.) are not affected.
              </p>
              <Button onClick={handleUnsubscribe} className="w-full py-6 text-[14px] tracking-widest uppercase">
                Confirm unsubscribe
              </Button>
            </>
          )}

          {status === "already" && (
            <>
              <h1 className="font-serif text-[28px] mb-4">Already unsubscribed</h1>
              <p className="text-[14px] text-muted-foreground">You have already unsubscribed from these emails.</p>
            </>
          )}

          {status === "success" && (
            <>
              <h1 className="font-serif text-[28px] mb-4">Done</h1>
              <p className="text-[14px] text-muted-foreground">You have been unsubscribed. You will no longer receive app emails.</p>
            </>
          )}

          {status === "invalid" && (
            <>
              <h1 className="font-serif text-[28px] mb-4">Invalid link</h1>
              <p className="text-[14px] text-muted-foreground">This unsubscribe link is invalid or has expired.</p>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="font-serif text-[28px] mb-4">Something went wrong</h1>
              <p className="text-[14px] text-muted-foreground">Please try again later.</p>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Unsubscribe;

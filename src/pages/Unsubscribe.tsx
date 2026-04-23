import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, MailCheck, MailX, TriangleAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type State = "loading" | "confirm" | "success" | "invalid" | "already" | "error";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<State>("loading");
  const [message, setMessage] = useState("Checking your unsubscribe link…");
  const [submitting, setSubmitting] = useState(false);

  const token = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setState("invalid");
        setMessage("This unsubscribe link is missing its token.");
        return;
      }

      try {
        const response = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: supabaseAnonKey } }
        );
        const result = await response.json().catch(() => ({}));

        if (response.ok && result.valid) {
          setState("confirm");
          setMessage("You can confirm the unsubscribe below.");
          return;
        }

        if (result.reason === "already_unsubscribed") {
          setState("already");
          setMessage("This email address has already been unsubscribed.");
          return;
        }

        setState("invalid");
        setMessage(result.error || "This unsubscribe link is invalid or expired.");
      } catch {
        setState("error");
        setMessage("We couldn't validate this link right now.");
      }
    };

    void validateToken();
  }, [token]);

  const confirmUnsubscribe = async () => {
    if (!token || submitting) return;
    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });

      if (error) {
        setState("error");
        setMessage("We couldn't complete the unsubscribe right now.");
        return;
      }

      if (data?.reason === "already_unsubscribed") {
        setState("already");
        setMessage("This email address has already been unsubscribed.");
        return;
      }

      if (data?.success) {
        setState("success");
        setMessage("You have been unsubscribed from app emails.");
        return;
      }

      setState("error");
      setMessage("We couldn't complete the unsubscribe right now.");
    } finally {
      setSubmitting(false);
    }
  };

  const Icon =
    state === "loading"
      ? Loader2
      : state === "success"
        ? MailCheck
        : state === "confirm"
          ? MailX
          : TriangleAlert;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-7 py-16">
        <div className="border border-line bg-card/40 p-8 sm:p-10">
          <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-gold">Email preferences</p>
          <h1 className="font-display text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">
            Unsubscribe
          </h1>
          <div className="mt-8 flex items-center gap-3">
            <Icon className={state === "loading" ? "h-5 w-5 animate-spin text-gold" : "h-5 w-5 text-gold"} />
            <p className="text-sm leading-6 text-muted-foreground">{message}</p>
          </div>

          {state === "confirm" && (
            <div className="mt-8">
              <Button
                onClick={confirmUnsubscribe}
                disabled={submitting}
                className="rounded-none bg-gold px-6 text-primary-foreground hover:bg-gold/90"
              >
                {submitting ? "Confirming…" : "Confirm unsubscribe"}
              </Button>
            </div>
          )}

          <div className="mt-10 border-t border-line pt-6 text-sm text-muted-foreground">
            <Link to="/" className="text-gold hover:text-gold-soft transition-colors">
              Return to cloarec.ai
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Unsubscribe;

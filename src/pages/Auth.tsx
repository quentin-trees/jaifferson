import { useState } from "react";
import Logo from "@/components/Logo";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
        },
      });

      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      console.error("Magic link error:", err);
      toast.error(err.message || "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-border">
        <Link to="/">
          <Logo />
        </Link>
        <LanguageSwitcher />
      </nav>

      <div className="flex flex-col items-center justify-center py-32 px-6">
        {sent ? (
          <div className="text-center max-w-md">
            <CheckCircle2 className="h-12 w-12 text-gold mx-auto mb-6" />
            <h1 className="font-serif text-3xl mb-4">Check your inbox</h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed mb-8">
              We've sent a magic link to <strong className="text-foreground">{email}</strong>.
              Click the link in the email to sign in.
            </p>
            <Button
              variant="outline"
              onClick={() => setSent(false)}
              className="border-border"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Try a different email
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-sm">
            <h1 className="font-serif text-3xl mb-2 text-center">Sign in</h1>
            <p className="text-muted-foreground text-[15px] text-center mb-8">
              Enter your email. We'll send you a magic link — no password needed.
            </p>
            <form onSubmit={handleMagicLink} className="space-y-4">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border"
              />
              <Button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send magic link"
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;

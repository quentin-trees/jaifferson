import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CalendarDays, Users, Globe, Lock, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface SessionData {
  id: string;
  title: string;
  topic_refined: string | null;
  topic_raw: string | null;
  scheduled_at: string | null;
  max_participants: number | null;
  is_public: boolean | null;
  status: string | null;
  host_id: string;
}

interface Question {
  id: string;
  question: string;
  order_index: number;
}

const Session = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [session, setSession] = useState<SessionData | null>(null);
  const [host, setHost] = useState<{ first_name: string | null; last_name: string | null } | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingApplication, setExistingApplication] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [acceptedCount, setAcceptedCount] = useState(0);

  const fetchSessionData = async (currentUser: any) => {
    if (!id) return;

    // Fetch session
    const { data: sessionData, error } = await supabase
      .from("jaifferson_sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !sessionData) {
      setLoading(false);
      return;
    }
    setSession(sessionData);

    // Fetch host, questions, accepted count in parallel
    const [hostRes, questionsRes, countRes] = await Promise.all([
      supabase.from("users").select("first_name, last_name").eq("id", sessionData.host_id).single(),
      supabase.from("session_questions").select("*").eq("session_id", id).order("order_index"),
      supabase.from("session_applications").select("*", { count: "exact", head: true }).eq("session_id", id).eq("status", "accepted"),
    ]);

    setHost(hostRes.data);
    setQuestions(questionsRes.data || []);
    setAcceptedCount(countRes.count || 0);

    // Check existing application
    if (currentUser) {
      const { data: app } = await supabase
        .from("session_applications")
        .select("status")
        .eq("session_id", id)
        .eq("user_id", currentUser.id)
        .maybeSingle();
      if (app) setExistingApplication(app.status);
    }

    setLoading(false);
  };

  useEffect(() => {
    // Listen for auth state changes (handles magic link redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      // Re-check existing application when user signs in
      if (currentUser && id) {
        supabase
          .from("session_applications")
          .select("status")
          .eq("session_id", id)
          .eq("user_id", currentUser.id)
          .maybeSingle()
          .then(({ data: app }) => {
            if (app) setExistingApplication(app.status);
          });
      }
    });

    // Initial fetch
    const init = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      await fetchSessionData(currentUser);
    };
    init();

    return () => subscription.unsubscribe();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      window.location.href = `/auth?redirect=/session/${id}`;
      return;
    }

    if (!id || questions.some((q) => !answers[q.id]?.trim())) {
      toast.error("Please answer all questions before applying.");
      return;
    }

    setSubmitting(true);

    const answersPayload = questions.map((q) => ({
      question_id: q.id,
      question: q.question,
      answer: answers[q.id].trim(),
    }));

    const { data, error } = await supabase.functions.invoke("submit-session-application", {
      body: {
        sessionId: id,
        answers: answersPayload,
      },
    });

    if (error || !data?.success) {
      console.error("Application error:", error || data);
      toast.error("Something went wrong. Try again.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setExistingApplication(data.status || "pending");
    toast.success(
      data.alreadyApplied
        ? "Application already submitted."
        : data.emailQueued === false
        ? "Application submitted, but the confirmation email could not be queued."
        : "Application submitted. The host will review it."
    );
    setSubmitting(false);
  };

  const seatsLeft = session ? Math.max(0, (session.max_participants || 6) - acceptedCount) : 0;
  const hostName = host ? [host.first_name, host.last_name].filter(Boolean).join(" ") : "";
  const topic = session?.topic_refined || session?.topic_raw || "";
  const isHost = user && session && user.id === session.host_id;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Session not found.</p>
        <Link to="/explore" className="text-gold hover:underline text-[14px]">← Back to Explore</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-border sticky top-0 bg-background z-50">
        <Link to="/"><Logo /></Link>
        <div className="flex items-center gap-6">
          <Link to="/explore" className="text-[13px] font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            {t.nav.explore}
          </Link>
          <LanguageSwitcher />
        </div>
      </nav>

      <main className="px-6 md:px-12 max-w-[740px] mx-auto py-16">
        {/* Session Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            {session.is_public ? <Globe className="w-3.5 h-3.5 text-gold" /> : <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground">
              {session.is_public ? "Public session" : "Private session"} · Hosted by {hostName}
            </span>
          </div>
          <h1 className="font-serif text-[clamp(28px,4vw,44px)] leading-[1.15] text-foreground mb-4">
            {session.title}
          </h1>
          {topic && (
            <p className="text-[16px] leading-[1.7] text-muted-foreground mb-8">
              {topic}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-6 text-[13px] text-muted-foreground border-t border-b border-border py-4">
            {session.scheduled_at && (
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" />
                <span>{format(new Date(session.scheduled_at), "EEEE, MMMM d, yyyy · HH:mm")}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span className={seatsLeft === 0 ? "text-destructive font-medium" : ""}>
                {seatsLeft === 0 ? "No seats left" : `${seatsLeft} of ${session.max_participants} seats available`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>~90 minutes</span>
            </div>
          </div>
        </div>

        {/* Application Form or Status */}
        {isHost ? (
          <div className="border border-gold/30 bg-gold/5 p-6">
            <p className="text-foreground font-medium mb-2">You are the host of this session.</p>
            <Link to="/dashboard" className="text-gold hover:underline text-[14px]">
              Go to your dashboard to manage applications →
            </Link>
          </div>
        ) : existingApplication || submitted ? (
          <div className="border border-border p-8 text-center">
            <CheckCircle className="w-8 h-8 text-gold mx-auto mb-4" />
            <h3 className="font-serif text-[22px] mb-2">Application submitted</h3>
            <p className="text-[14px] text-muted-foreground">
              {existingApplication === "accepted"
                ? "You have been accepted. Check your email for the calendar invite."
                : existingApplication === "declined"
                ? "Your application was not accepted for this session."
                : "The host will review your answers and get back to you."}
            </p>
          </div>
        ) : seatsLeft === 0 ? (
          <div className="border border-border p-8 text-center">
            <p className="text-muted-foreground">This session is full. No more seats available.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-[24px] mb-2">Apply for a seat</h2>
              <p className="text-[14px] text-muted-foreground">
                Answer the host's questions. Be honest — this is how they decide who belongs at the table.
              </p>
            </div>

            {questions.length > 0 ? (
              <div className="space-y-6">
                {questions.map((q, idx) => (
                  <div key={q.id}>
                    <label className="block text-[14px] font-medium text-foreground mb-2">
                      {idx + 1}. {q.question}
                    </label>
                    <Textarea
                      value={answers[q.id] || ""}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      placeholder="Your answer..."
                      className="min-h-[100px] text-[14px] bg-background border-border"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-[14px]">No onboarding questions for this session.</p>
            )}

            <Button
              onClick={handleApply}
              disabled={submitting || (questions.length > 0 && questions.some((q) => !answers[q.id]?.trim()))}
              className="w-full py-6 text-[14px] font-medium tracking-widest uppercase"
            >
              {submitting ? "Submitting..." : user ? "Submit application" : "Sign in to apply"}
            </Button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-2 text-[13px] text-muted-foreground">
        <span>{t.footer.brand}</span>
        <a href="https://www.linkedin.com/in/quentincloarec/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
          {t.footer.right}
        </a>
      </footer>
    </div>
  );
};

export default Session;

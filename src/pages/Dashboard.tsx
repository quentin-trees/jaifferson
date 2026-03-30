import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CalendarDays, Users, ChevronRight, CheckCircle, XCircle, Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SessionRow {
  id: string;
  title: string;
  topic_refined: string | null;
  topic_raw: string | null;
  scheduled_at: string | null;
  max_participants: number | null;
  status: string | null;
  is_public: boolean | null;
}

interface Application {
  id: string;
  session_id: string;
  user_id: string;
  answers: any;
  status: string | null;
  applied_at: string | null;
  user?: { first_name: string | null; last_name: string | null; email: string } | null;
}

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        navigate("/auth?redirect=/dashboard");
        return;
      }
      setUser(currentUser);

      const { data } = await supabase
        .from("jaifferson_sessions")
        .select("*")
        .eq("host_id", currentUser.id)
        .order("created_at", { ascending: false });

      setSessions(data || []);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const loadApplications = async (sessionId: string) => {
    setSelectedSession(sessionId);
    setLoadingApps(true);

    const { data } = await supabase
      .from("session_applications")
      .select("*")
      .eq("session_id", sessionId)
      .order("applied_at", { ascending: true });

    // Enrich with user info
    const enriched = await Promise.all(
      (data || []).map(async (app) => {
        const { data: userData } = await supabase
          .from("users")
          .select("first_name, last_name, email")
          .eq("id", app.user_id)
          .single();
        return { ...app, user: userData };
      })
    );

    setApplications(enriched);
    setLoadingApps(false);
  };

  const updateApplicationStatus = async (appId: string, status: "accepted" | "declined") => {
    const { error } = await supabase
      .from("session_applications")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", appId);

    if (error) {
      toast.error("Failed to update application.");
      return;
    }

    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a))
    );
    toast.success(`Application ${status}.`);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
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
          <Link
            to="/create"
            className="bg-primary text-primary-foreground text-[13px] font-medium tracking-widest uppercase px-6 py-2.5 hover:bg-primary/90 transition-colors"
          >
            {t.nav.hostCta}
          </Link>
          <button onClick={handleSignOut} className="text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <div className="px-6 md:px-12 max-w-[1000px] mx-auto py-12">
        <header className="mb-10">
          <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold mb-3 block">
            Dashboard
          </span>
          <h1 className="font-serif text-[clamp(28px,4vw,40px)] leading-[1.15] text-foreground">
            Your Jaiffersons
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
          {/* Sessions List */}
          <div className="space-y-3">
            <h2 className="text-[12px] font-medium tracking-[0.15em] uppercase text-muted-foreground mb-2">
              Sessions ({sessions.length})
            </h2>
            {sessions.length === 0 ? (
              <div className="border border-border p-6 text-center">
                <p className="text-muted-foreground text-[14px] mb-4">No sessions yet.</p>
                <Link
                  to="/create"
                  className="text-gold hover:underline text-[14px]"
                >
                  Host your first Jaifferson →
                </Link>
              </div>
            ) : (
              sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => loadApplications(session.id)}
                  className={`w-full text-left border p-4 transition-colors ${
                    selectedSession === session.id
                      ? "border-gold bg-gold/5"
                      : "border-border hover:border-foreground/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-[15px] text-foreground truncate">
                        {session.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-[12px] text-muted-foreground">
                        {session.scheduled_at && (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            {format(new Date(session.scheduled_at), "MMM d")}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {session.max_participants} seats
                        </span>
                        <span className="capitalize px-1.5 py-0.5 bg-muted text-[11px] tracking-wider uppercase">
                          {session.status}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Applications Panel */}
          <div>
            {!selectedSession ? (
              <div className="border border-border p-12 text-center">
                <p className="text-muted-foreground text-[14px]">
                  Select a session to review applications.
                </p>
              </div>
            ) : loadingApps ? (
              <div className="border border-border p-12 text-center animate-pulse">
                <p className="text-muted-foreground">Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="border border-border p-12 text-center">
                <p className="text-muted-foreground text-[14px]">No applications yet for this session.</p>
                <p className="text-[13px] text-muted-foreground mt-2">
                  Share the session link to get applicants.
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/session/${selectedSession}`);
                    toast.success("Session link copied!");
                  }}
                  className="mt-4 text-gold hover:underline text-[13px]"
                >
                  Copy session link
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-[12px] font-medium tracking-[0.15em] uppercase text-muted-foreground mb-2">
                  Applications ({applications.length})
                </h2>
                {applications.map((app) => {
                  const name = app.user
                    ? [app.user.first_name, app.user.last_name].filter(Boolean).join(" ") || app.user.email
                    : "Unknown";
                  const answersArr = Array.isArray(app.answers) ? app.answers : [];

                  return (
                    <div key={app.id} className="border border-border p-5">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium text-[15px] text-foreground">{name}</p>
                          {app.applied_at && (
                            <p className="text-[12px] text-muted-foreground">
                              Applied {format(new Date(app.applied_at), "MMM d, yyyy")}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {app.status === "pending" && <Clock className="w-4 h-4 text-gold" />}
                          {app.status === "accepted" && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {app.status === "declined" && <XCircle className="w-4 h-4 text-destructive" />}
                          <span className="text-[12px] uppercase tracking-wider text-muted-foreground capitalize">
                            {app.status}
                          </span>
                        </div>
                      </div>

                      {/* Answers */}
                      {answersArr.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {answersArr.map((a: any, i: number) => (
                            <div key={i}>
                              <p className="text-[12px] font-medium text-muted-foreground mb-1">
                                {a.question}
                              </p>
                              <p className="text-[14px] text-foreground leading-relaxed">
                                {a.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      {app.status === "pending" && (
                        <div className="flex gap-3 pt-3 border-t border-border">
                          <Button
                            size="sm"
                            onClick={() => updateApplicationStatus(app.id, "accepted")}
                            className="text-[12px] tracking-widest uppercase"
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateApplicationStatus(app.id, "declined")}
                            className="text-[12px] tracking-widest uppercase"
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

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

export default Dashboard;

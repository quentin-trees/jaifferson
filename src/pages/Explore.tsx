import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CalendarDays, Users, Globe, Lock } from "lucide-react";

interface SessionRow {
  id: string;
  title: string;
  topic_refined: string | null;
  topic_raw: string | null;
  scheduled_at: string | null;
  max_participants: number | null;
  is_public: boolean | null;
  status: string | null;
  host_id: string;
  host?: { first_name: string | null; last_name: string | null } | null;
  applicant_count?: number;
}

const Explore = () => {
  const { t } = useLanguage();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("jaifferson_sessions")
        .select("*")
        .eq("is_public", true)
        .in("status", ["open", "published", "scheduled"])
        .order("scheduled_at", { ascending: true });

      if (error) {
        console.error("Error fetching sessions:", error);
        setLoading(false);
        return;
      }

      // Fetch host names and application counts
      const enriched = await Promise.all(
        (data || []).map(async (session) => {
          const { data: host } = await supabase
            .from("users")
            .select("first_name, last_name")
            .eq("id", session.host_id)
            .single();

          const { count } = await supabase
            .from("session_applications")
            .select("*", { count: "exact", head: true })
            .eq("session_id", session.id)
            .eq("status", "accepted");

          return { ...session, host, applicant_count: count || 0 };
        })
      );

      setSessions(enriched);
      setLoading(false);
    };

    fetchSessions();
  }, []);

  const seatsLeft = (session: SessionRow) => {
    const max = session.max_participants || 6;
    const taken = session.applicant_count || 0;
    return Math.max(0, max - taken);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-border sticky top-0 bg-background z-50">
        <Link to="/"><Logo /></Link>
        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <Link
            to="/create"
            className="bg-primary text-primary-foreground text-[13px] font-medium tracking-widest uppercase px-6 py-2.5 hover:bg-primary/90 transition-colors"
          >
            {t.nav.hostCta}
          </Link>
        </div>
      </nav>

      {/* HEADER */}
      <header className="px-6 md:px-12 pt-16 pb-12 max-w-[900px] mx-auto">
        <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold mb-4 block">
          {t.upcoming.label}
        </span>
        <h1 className="font-serif text-[clamp(28px,4vw,44px)] leading-[1.15] text-foreground mb-4">
          {t.upcoming.heading}
        </h1>
        <p className="text-[15px] text-muted-foreground max-w-[520px]">
          Browse upcoming public Jaiffersons. Find the table that fits you. Apply to earn your seat.
        </p>
      </header>

      {/* SESSIONS LIST */}
      <main className="px-6 md:px-12 max-w-[900px] mx-auto pb-24">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-border p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/3 mb-3" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20 border border-border">
            <p className="text-muted-foreground text-[15px] mb-6">{t.upcoming.empty}</p>
            <Link
              to="/create"
              className="bg-primary text-primary-foreground text-[13px] font-medium tracking-widest uppercase px-6 py-3 hover:bg-primary/90 transition-colors inline-block"
            >
              {t.upcoming.ctaHost}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const seats = seatsLeft(session);
              const hostName = session.host
                ? [session.host.first_name, session.host.last_name].filter(Boolean).join(" ")
                : "Unknown host";
              const topic = session.topic_refined || session.topic_raw || "";

              return (
                <Link
                  key={session.id}
                  to={`/session/${session.id}`}
                  className="block border border-border hover:border-foreground/20 transition-colors p-6 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {session.is_public ? (
                          <Globe className="w-3.5 h-3.5 text-gold" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                        <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground">
                          Hosted by {hostName}
                        </span>
                      </div>
                      <h3 className="font-serif text-[22px] text-foreground group-hover:text-gold transition-colors mb-1">
                        {session.title}
                      </h3>
                      {topic && (
                        <p className="text-[14px] text-muted-foreground line-clamp-2">
                          {topic}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-6 text-[13px] text-muted-foreground shrink-0">
                      {session.scheduled_at && (
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="w-4 h-4" />
                          <span>{format(new Date(session.scheduled_at), "MMM d, yyyy · HH:mm")}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span className={seats === 0 ? "text-destructive font-medium" : ""}>
                          {seats === 0 ? "Full" : `${seats} seat${seats > 1 ? "s" : ""} left`}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
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

export default Explore;

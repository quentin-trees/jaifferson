import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CalendarDays, Users } from "lucide-react";

interface SessionRow {
  id: string;
  title: string;
  topic_refined: string | null;
  scheduled_at: string | null;
  max_participants: number | null;
  host_id: string;
  host_name?: string;
  accepted_count?: number;
}

const UpcomingSessions = () => {
  const { t } = useLanguage();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("jaifferson_sessions")
        .select("id, title, topic_refined, scheduled_at, max_participants, host_id")
        .eq("is_public", true)
        .in("status", ["open", "published", "scheduled"])
        .order("scheduled_at", { ascending: true })
        .limit(3);

      if (!data || data.length === 0) {
        setLoading(false);
        return;
      }

      const enriched = await Promise.all(
        data.map(async (s) => {
          const { data: host } = await supabase
            .from("users")
            .select("first_name")
            .eq("id", s.host_id)
            .single();
          const { count } = await supabase
            .from("session_applications")
            .select("*", { count: "exact", head: true })
            .eq("session_id", s.id)
            .eq("status", "accepted");
          return { ...s, host_name: host?.first_name || "Someone", accepted_count: count || 0 };
        })
      );

      setSessions(enriched);
      setLoading(false);
    };
    fetch();
  }, []);

  const seatsLeft = (s: SessionRow) => Math.max(0, (s.max_participants || 6) - (s.accepted_count || 0));

  return (
    <section className="px-6 py-24 max-w-[900px] mx-auto">
      <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold text-center mb-4">
        {t.upcoming.label}
      </p>
      <h2 className="font-serif text-4xl text-center mb-16">
        {t.upcoming.heading}
      </h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="border border-border p-6 animate-pulse">
              <div className="h-5 bg-muted rounded w-1/3 mb-3" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border">
          <p className="text-muted-foreground text-[15px] mb-6">
            {t.upcoming.empty}
          </p>
          <Link
            to="/create"
            className="text-primary text-[13px] font-medium tracking-widest uppercase hover:text-primary/80 transition-colors"
          >
            {t.upcoming.ctaHost}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const seats = seatsLeft(session);
            return (
              <Link
                key={session.id}
                to={`/session/${session.id}`}
                className="block border border-border hover:border-foreground/20 transition-colors p-6 group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground mb-1 block">
                      Hosted by {session.host_name}
                    </span>
                    <h3 className="font-serif text-[20px] text-foreground group-hover:text-gold transition-colors">
                      {session.title}
                    </h3>
                    {session.topic_refined && (
                      <p className="text-[14px] text-muted-foreground line-clamp-1 mt-1">{session.topic_refined}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-5 text-[13px] text-muted-foreground shrink-0">
                    {session.scheduled_at && (
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4" />
                        {format(new Date(session.scheduled_at), "MMM d · HH:mm")} CET
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {seats === 0 ? "Full" : `${seats} seat${seats > 1 ? "s" : ""} left`}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          <div className="text-center pt-6">
            <Link
              to="/explore"
              className="text-primary text-[13px] font-medium tracking-widest uppercase hover:text-primary/80 transition-colors"
            >
              {t.upcoming.ctaHost} →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default UpcomingSessions;

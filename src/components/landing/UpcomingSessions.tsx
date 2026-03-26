import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const UpcomingSessions = () => {
  const { t } = useLanguage();

  // TODO: Replace with real data from Supabase once sessions table is populated
  return (
    <section className="px-6 py-24 max-w-[900px] mx-auto">
      <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold text-center mb-4">
        {t.upcoming.label}
      </p>
      <h2 className="font-serif text-4xl text-center mb-16">
        {t.upcoming.heading}
      </h2>

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
    </section>
  );
};

export default UpcomingSessions;

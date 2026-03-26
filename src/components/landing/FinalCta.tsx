import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const FinalCta = () => {
  const { t } = useLanguage();

  return (
    <section className="px-6 py-24 text-center max-w-[700px] mx-auto">
      <h2 className="font-serif text-[clamp(24px,4vw,36px)] leading-[1.2] mb-3">
        {t.finalCta.heading}
      </h2>
      <p className="font-serif italic text-gold text-[clamp(20px,3vw,28px)] mb-12">
        {t.finalCta.sub}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/create"
          className="bg-primary text-primary-foreground text-[13px] font-medium tracking-[0.12em] uppercase px-8 py-4 hover:bg-primary/90 transition-colors"
        >
          {t.finalCta.ctaHost}
        </Link>
        <Link
          to="/explore"
          className="border border-primary text-primary text-[13px] font-medium tracking-[0.12em] uppercase px-8 py-4 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          {t.finalCta.ctaExplore}
        </Link>
      </div>
    </section>
  );
};

export default FinalCta;

import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="flex flex-col items-center text-center px-6 pt-24 md:pt-[120px] pb-24 max-w-[820px] mx-auto">
      <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold mb-6">
        {t.hero.label}
      </span>
      <h1 className="font-serif text-[clamp(36px,6vw,60px)] leading-[1.1] text-foreground mb-4">
        {t.hero.title1}
        <br />
        {t.hero.title2}{" "}
        <em className="text-gold italic">{t.hero.titleEmphasis}</em>
      </h1>
      <p className="text-[17px] leading-[1.75] text-muted-foreground max-w-[580px] mb-12">
        {t.hero.desc}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/create"
          className="bg-primary text-primary-foreground text-[13px] font-medium tracking-[0.12em] uppercase px-8 py-4 hover:bg-primary/90 transition-colors"
        >
          {t.hero.ctaHost}
        </Link>
        <Link
          to="/explore"
          className="border border-primary text-primary text-[13px] font-medium tracking-[0.12em] uppercase px-8 py-4 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          {t.hero.ctaExplore}
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;

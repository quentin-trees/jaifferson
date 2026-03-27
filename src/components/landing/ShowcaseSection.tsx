import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowRight } from "lucide-react";

const ShowcaseSection = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-primary text-primary-foreground py-20 px-6">
      <div className="max-w-[900px] mx-auto text-center">
        <span className="text-[11px] font-medium tracking-[0.2em] uppercase opacity-50 mb-4 block">
          {t.showcase.label}
        </span>
        <h2 className="font-serif text-[clamp(24px,4vw,36px)] mb-4">
          {t.showcase.heading}
        </h2>
        <p className="text-[15px] leading-relaxed opacity-75 max-w-[560px] mx-auto mb-12">
          {t.showcase.desc}
        </p>
        <div className="flex justify-center gap-12 md:gap-20 mb-12">
          {t.showcase.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-serif text-4xl md:text-5xl mb-2 opacity-90">
                {stat.value}
              </p>
              <p className="text-[12px] tracking-[0.1em] uppercase opacity-50">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        <Link
          to="/festin"
          className="inline-flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground text-[13px] font-medium tracking-[0.12em] uppercase px-8 py-4 hover:bg-primary-foreground hover:text-primary transition-colors"
        >
          Voir le Festin 00
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default ShowcaseSection;

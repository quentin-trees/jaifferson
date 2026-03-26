import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-border sticky top-0 bg-background z-50">
        <Logo />
        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <Link
            to="/session"
            className="bg-primary text-primary-foreground text-[13px] font-medium tracking-widest uppercase px-6 py-2.5 hover:bg-primary/90 transition-colors"
          >
            {t.nav.cta}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center text-center px-6 pt-24 md:pt-[100px] pb-20 max-w-[780px] mx-auto">
        <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold mb-6">
          {t.hero.label}
        </span>
        <h1 className="font-serif text-[clamp(38px,6vw,64px)] leading-[1.15] text-foreground mb-6">
          {t.hero.title1}
          <br />
          {t.hero.title2} <em className="text-gold italic">{t.hero.titleEmphasis}</em>
        </h1>
        <p className="text-[17px] leading-[1.75] text-muted-foreground max-w-[560px] mb-12">
          {t.hero.desc}
        </p>
        <Link
          to="/session"
          className="bg-primary text-primary-foreground text-[13px] font-medium tracking-[0.15em] uppercase px-10 py-4 hover:bg-primary/90 transition-colors"
        >
          {t.hero.cta} →
        </Link>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-24 max-w-[900px] mx-auto">
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold text-center mb-4">
          {t.how.label}
        </p>
        <h2 className="font-serif text-4xl text-center mb-16">
          {t.how.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {t.how.steps.map((step, i) => (
            <div key={i}>
              <p className="font-serif text-5xl text-foreground/10 leading-none mb-4">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-base font-medium mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <section className="bg-primary text-primary-foreground py-20 px-6 text-center">
        <blockquote className="font-serif italic text-[clamp(20px,3vw,28px)] leading-relaxed max-w-[700px] mx-auto mb-6 opacity-95">
          {t.quote.text}
        </blockquote>
        <p className="text-[13px] tracking-[0.1em] uppercase opacity-50">
          {t.quote.source}
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-2 text-[13px] text-muted-foreground">
        <span>Jaifferson</span>
        <a href="https://www.linkedin.com/in/quentincloarec/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
          {t.footer.right}
        </a>
      </footer>
    </div>
  );
};

export default Index;

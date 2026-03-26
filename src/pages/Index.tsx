import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import ShowcaseSection from "@/components/landing/ShowcaseSection";
import UpcomingSessions from "@/components/landing/UpcomingSessions";
import FinalCta from "@/components/landing/FinalCta";

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-border sticky top-0 bg-background z-50">
        <Logo />
        <div className="flex items-center gap-6">
          <Link
            to="/explore"
            className="text-[13px] font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors hidden md:block"
          >
            {t.nav.explore}
          </Link>
          <LanguageSwitcher />
          <Link
            to="/create"
            className="bg-primary text-primary-foreground text-[13px] font-medium tracking-widest uppercase px-6 py-2.5 hover:bg-primary/90 transition-colors"
          >
            {t.nav.hostCta}
          </Link>
        </div>
      </nav>

      <HeroSection />
      <HowItWorks />
      <ShowcaseSection />
      <UpcomingSessions />
      <FinalCta />

      {/* FOOTER */}
      <footer className="border-t border-border px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-2 text-[13px] text-muted-foreground">
        <span>{t.footer.brand}</span>
        <a
          href="https://www.linkedin.com/in/quentincloarec/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          {t.footer.right}
        </a>
      </footer>
    </div>
  );
};

export default Index;

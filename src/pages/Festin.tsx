import { Link } from "react-router-dom";
import { FileText, Download, Play, Users, Clock, BookOpen } from "lucide-react";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState } from "react";

const participants = [
  { name: "Oussama", words: "~2,100", pct: "30%", mbti: "ENTJ", enneagram: "8w7", archetype: "Le Stratège Combattant", file: "festin00-individuel-ousama.pdf" },
  { name: "Carlos", words: "~1,400", pct: "21%", mbti: "ENFJ", enneagram: "3w2", archetype: "Le Catalyseur", file: "festin00-individuel-carlos.pdf" },
  { name: "Guillaume", words: "~900", pct: "13%", mbti: "ISTP", enneagram: "5w6", archetype: "L'Ingénieur Silencieux", file: "festin00-individuel-guillaume.pdf" },
  { name: "Wallerand", words: "~850", pct: "12%", mbti: "ENTP", enneagram: "7w8", archetype: "Le Franc-Tireur Médiatique", file: "festin00-individuel-valrand.pdf" },
  { name: "Paul", words: "~700", pct: "10%", mbti: "INFP", enneagram: "4w5", archetype: "Le Révolté Silencieux", file: "festin00-individuel-paul.pdf" },
  { name: "MJ Smile", words: "~400", pct: "6%", mbti: "—", enneagram: "—", archetype: "Sous le seuil", file: "festin00-individuel-mj.pdf", belowThreshold: true },
  { name: "Jules", words: "~350", pct: "5%", mbti: "—", enneagram: "—", archetype: "Sous le seuil", file: "festin00-individuel-jules.pdf", belowThreshold: true },
];

const keyIdeas = [
  { title: "La liberté se mesure en réveils ratés", quote: "Aucun de nous n'a payé pour être à ce dîner." },
  { title: "L'écosystème français est une aristocratie génétiquement appauvrie", quote: "S'il n'y a pas d'exit massif en France, c'est parce qu'il est impossible d'atteindre le stade de massif." },
  { title: "La revanche est le carburant que personne ne revendique", quote: "Moi ce qui me faisait chier c'est que les gens me considèrent différemment parce que j'avais pas de tune." },
  { title: "Partir n'est pas trahir — mais rester est le vrai pouvoir", quote: "On peut aimer un pays et vouloir le quitter." },
  { title: "Le média comme arme asymétrique", quote: "Si tu contrôles pas le récit, quelqu'un le contrôle pour toi." },
];

const Festin = () => {
  const { t } = useLanguage();
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-border sticky top-0 bg-background z-50">
        <Logo />
        <div className="flex items-center gap-6">
          <Link to="/story" className="text-[13px] font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            Story
          </Link>
          <Link to="/explore" className="text-[13px] font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            {t.nav.explore}
          </Link>
          <LanguageSwitcher />
          <Link to="/create" className="bg-primary text-primary-foreground text-[13px] font-medium tracking-widest uppercase px-6 py-2.5 hover:bg-primary/90 transition-colors">
            {t.nav.hostCta}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="px-6 md:px-12 pt-20 md:pt-28 pb-16 max-w-[820px] mx-auto text-center">
        <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold mb-4 block">
          Festin 00 — Session #1
        </span>
        <h1 className="font-serif text-[clamp(28px,5vw,48px)] leading-[1.15] text-foreground mb-4">
          Le dîner des pirates de la tech française
        </h1>
        <p className="text-[17px] leading-[1.75] text-muted-foreground max-w-[580px] mx-auto mb-8">
          Organisé par Carlos · Paris · ~70 min · 7 participants.
          Voici ce que Jaifferson a produit à partir d'une seule conversation.
        </p>

        {/* STATS */}
        <div className="flex justify-center gap-8 md:gap-12 mb-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="w-4 h-4 text-gold" />
              <span className="font-serif text-[28px] text-foreground">7</span>
            </div>
            <span className="text-[12px] uppercase tracking-widest text-muted-foreground">participants</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-gold" />
              <span className="font-serif text-[28px] text-foreground">70</span>
            </div>
            <span className="text-[12px] uppercase tracking-widest text-muted-foreground">minutes</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-gold" />
              <span className="font-serif text-[28px] text-foreground">15,708</span>
            </div>
            <span className="text-[12px] uppercase tracking-widest text-muted-foreground">mots transcrits</span>
          </div>
        </div>
      </header>

      {/* VIDEO */}
      <section className="px-6 md:px-12 max-w-[820px] mx-auto mb-20">
        <div className="aspect-video bg-primary/5 border border-border relative overflow-hidden">
          {showVideo ? (
            <iframe
              src="https://www.youtube.com/embed/ryAHzGa82og?autoplay=1"
              title="Festin 00"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            <button
              onClick={() => setShowVideo(true)}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4 hover:bg-primary/10 transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 ml-1" />
              </div>
              <span className="text-[13px] font-medium tracking-widest uppercase text-muted-foreground">
                Regarder le Festin 00
              </span>
            </button>
          )}
        </div>
      </section>

      {/* GLOBAL REPORT */}
      <section className="px-6 md:px-12 max-w-[820px] mx-auto mb-20">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-5 h-5 text-gold" />
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            Rapport global de session
          </h2>
        </div>
        <p className="text-[16px] leading-[1.8] text-muted-foreground mb-8">
          Le rapport partagé avec tous les participants. Une lecture de ce qui s'est passé dans la salle — pas un résumé, une analyse.
        </p>

        {/* 5 KEY IDEAS */}
        <div className="space-y-4 mb-8">
          {keyIdeas.map((idea, i) => (
            <div key={i} className="border border-border p-6">
              <div className="flex items-start gap-4">
                <span className="font-serif text-[24px] text-gold leading-none mt-0.5">{i + 1}</span>
                <div>
                  <h3 className="font-serif text-[18px] text-foreground mb-2">{idea.title}</h3>
                  <p className="text-[15px] text-muted-foreground italic border-l-2 border-gold/40 pl-4">
                    "{idea.quote}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <a
          href="/reports/festin00-global-report.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-[13px] font-medium tracking-[0.12em] uppercase px-6 py-3 hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Télécharger le rapport global
        </a>
      </section>

      {/* INDIVIDUAL REPORTS */}
      <section className="px-6 md:px-12 max-w-[820px] mx-auto mb-20">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-gold" />
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            Synthèses individuelles
          </h2>
        </div>
        <p className="text-[16px] leading-[1.8] text-muted-foreground mb-8">
          Chaque participant reçoit un rapport privé : archétype psychologique, contributions clés, angles morts, et un move concret avant la prochaine session.
        </p>

        <div className="grid gap-3">
          {participants.map((p) => (
            <a
              key={p.name}
              href={`/reports/${p.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border p-5 flex items-center justify-between hover:bg-accent/50 transition-colors group"
            >
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-[14px] font-medium text-primary">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[15px] font-medium text-foreground">{p.name}</span>
                    {p.belowThreshold && (
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5">
                        Sous le seuil
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-[13px] text-muted-foreground">
                    <span>{p.words} mots</span>
                    <span>{p.pct} de parole</span>
                    {!p.belowThreshold && (
                      <>
                        <span className="hidden sm:inline">{p.mbti}</span>
                        <span className="hidden sm:inline text-gold">{p.archetype}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 max-w-[820px] mx-auto pb-24 text-center">
        <p className="font-serif text-[24px] text-foreground mb-2">
          Ce que 70 minutes produisent quand quelqu'un écoute vraiment.
        </p>
        <p className="text-[15px] text-muted-foreground mb-8">
          Organisez le vôtre. Recevez le même niveau d'analyse.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

export default Festin;

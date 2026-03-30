import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

// ─── Festin preview data ───────────────────────────────────────────────────
// TODO: replace with live Supabase query once sessions table is ready
const FESTINS: {
  id: string;
  number: string;
  title: string;
  titleFr: string;
  host: string;
  location: string;
  date: string;
  participants: number;
  maxParticipants: number;
  status: "past" | "upcoming" | "open";
  tags: string[];
  highlight: string;
  highlightFr: string;
  isPublic: boolean;
}[] = [
  {
    id: "festin-00",
    number: "00",
    title: "The dinner of French tech pirates",
    titleFr: "Le dîner des pirates de la tech française",
    host: "Carlos",
    location: "Paris",
    date: "March 2026",
    participants: 7,
    maxParticipants: 8,
    status: "past",
    tags: ["tech", "startup", "exits"],
    highlight: "7 profiles · 15,708 words analysed · 8 reports generated",
    highlightFr: "7 profils · 15 708 mots analysés · 8 rapports générés",
    isPublic: true,
  },
  {
    id: "next",
    number: "01",
    title: "Your topic. Your table. Your rules.",
    titleFr: "Votre sujet. Votre table. Vos règles.",
    host: "—",
    location: "—",
    date: "",
    participants: 0,
    maxParticipants: 8,
    status: "open",
    tags: [],
    highlight: "Create the next Jaifferson in under 5 minutes",
    highlightFr: "Créez le prochain Jaifferson en moins de 5 minutes",
    isPublic: false,
  },
];

// ─── Results stats from Festin 00 ─────────────────────────────────────────
const STATS = [
  { value: "15,708", label: "words transcribed", labelFr: "mots transcrits" },
  { value: "7", label: "individual profiles", labelFr: "profils individuels" },
  { value: "48h", label: "reports delivered", labelFr: "pour recevoir les rapports" },
  { value: "500+", label: "word threshold for psych profile", labelFr: "mots min. pour un profil psy" },
];

// ─── Status badge config ───────────────────────────────────────────────────
const STATUS_CONFIG = {
  past:     { en: "Completed",  fr: "Terminé",   cls: "bg-foreground/10 text-foreground/50" },
  upcoming: { en: "Upcoming",   fr: "À venir",   cls: "bg-gold/15 text-gold" },
  open:     { en: "Open",       fr: "Ouvert",    cls: "bg-primary/10 text-primary" },
};

// ─── Component ─────────────────────────────────────────────────────────────
const Index = () => {
  const { t, locale } = useLanguage();
  const navigate = useNavigate();
  const isFr = locale === "fr";

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <Logo />
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/story")}
            className="text-[13px] font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors hidden md:block"
          >
            Story
          </button>
          <button
            onClick={() => navigate("/explore")}
            className="text-[13px] font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors hidden md:block"
          >
            {isFr ? "Explorer" : "Explore"}
          </button>
          <LanguageSwitcher />
          <button
            onClick={() => navigate("/create")}
            className="bg-primary text-primary-foreground text-[13px] font-medium tracking-widest uppercase px-6 py-2.5 hover:bg-primary/90 transition-colors"
          >
            {isFr ? "Créer un Jaifferson" : "Host a Jaifferson"}
          </button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center text-center px-6 pt-24 md:pt-[100px] pb-20 max-w-[820px] mx-auto">
        <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold mb-6">
          {isFr ? "Intelligence de salle" : "Room intelligence"}
        </span>
        <h1 className="font-serif text-[clamp(38px,6vw,68px)] leading-[1.1] text-foreground mb-8">
          {isFr ? (
            <>
              La salle parle.<br />
              Jaifferson <em className="text-gold italic">retient.</em>
            </>
          ) : (
            <>
              The room talks.<br />
              Jaifferson <em className="text-gold italic">remembers.</em>
            </>
          )}
        </h1>
        <p className="text-[17px] leading-[1.8] text-muted-foreground max-w-[580px] mb-4">
          {isFr
            ? "Vous avez un sujet qui mérite une vraie conversation. Invitez les bonnes personnes. Jaifferson enregistre, analyse, et produit un rapport global et une synthèse privée pour chaque participant."
            : "You have a subject worth a real conversation. Invite the right people. Jaifferson records, analyses, and delivers a global session report and a private synthesis for every participant."}
        </p>
        <p className="text-[13px] tracking-wide text-muted-foreground/70 mb-14 italic font-serif">
          {isFr
            ? "Pas un résumé. Une lecture de salle."
            : "Not a summary. A reading of the room."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate("/create")}
            className="bg-primary text-primary-foreground text-[13px] font-medium tracking-widest uppercase px-10 py-4 hover:bg-primary/90 transition-colors"
          >
            {isFr ? "Organiser un Jaifferson" : "Host a Jaifferson"}
          </button>
          <button
            onClick={() => navigate("/explore")}
            className="border border-border text-foreground text-[13px] font-medium tracking-widest uppercase px-10 py-4 hover:border-foreground transition-colors"
          >
            {isFr ? "Explorer les Jaiffersons" : "Explore Jaiffersons"}
          </button>
        </div>
      </section>

      {/* ── DIVIDER ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-6 md:px-24 mb-0">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] tracking-[0.25em] uppercase text-gold">Jaifferson</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-[1000px] mx-auto">
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold text-center mb-4">
          {isFr ? "Comment ça fonctionne" : "How it works"}
        </p>
        <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-center mb-4 leading-tight">
          {isFr ? "Deux parcours. Une intelligence." : "Two journeys. One intelligence."}
        </h2>
        <p className="text-center text-muted-foreground text-[15px] max-w-[520px] mx-auto mb-16 leading-relaxed">
          {isFr
            ? "Que vous organisiez ou que vous participiez, Jaifferson s'adapte à votre rôle dans la salle."
            : "Whether you host or attend, Jaifferson adapts to your role in the room."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

          {/* HOST TRACK */}
          <div className="border border-border p-8 bg-card">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[10px] tracking-[0.2em] uppercase font-medium bg-primary text-primary-foreground px-3 py-1">
                {isFr ? "Hôte" : "Host"}
              </span>
              <span className="text-[13px] text-muted-foreground">
                {isFr ? "Vous organisez" : "You organise"}
              </span>
            </div>
            <div className="space-y-8">
              {[
                {
                  n: "01",
                  en: { title: "Create your Jaifferson", desc: "Set the topic, choose public or private, define the number of participants and the onboarding questions Jaifferson will send to applicants." },
                  fr: { title: "Créez votre Jaifferson", desc: "Définissez le sujet, choisissez public ou privé, le nombre de participants et les questions d'onboarding que Jaifferson enverra aux candidats." },
                },
                {
                  n: "02",
                  en: { title: "Jaifferson handles logistics", desc: "Invitations are sent. Fireflies joins the call automatically. You approve applicants. Everyone receives a calendar invite with the meeting link." },
                  fr: { title: "Jaifferson gère la logistique", desc: "Les invitations sont envoyées. Fireflies rejoint l'appel automatiquement. Vous approuvez les candidats. Chacun reçoit une invitation calendrier avec le lien de réunion." },
                },
                {
                  n: "03",
                  en: { title: "Receive the intelligence", desc: "Within 24 hours: a global session report for the group and a private psychological synthesis for each participant — grounded in word counts, not guesswork." },
                  fr: { title: "Recevez l'intelligence", desc: "Sous 24h : un rapport global pour le groupe et une synthèse psychologique privée pour chaque participant — fondée sur les volumes de parole, pas sur des suppositions." },
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-5">
                  <span className="font-serif text-4xl text-foreground/10 leading-none shrink-0 w-10">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="text-[14px] font-medium mb-1.5">
                      {isFr ? step.fr.title : step.en.title}
                    </h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                      {isFr ? step.fr.desc : step.en.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PARTICIPANT TRACK */}
          <div className="border border-border p-8 bg-card">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[10px] tracking-[0.2em] uppercase font-medium border border-foreground/30 text-foreground px-3 py-1">
                {isFr ? "Participant" : "Participant"}
              </span>
              <span className="text-[13px] text-muted-foreground">
                {isFr ? "Vous rejoignez" : "You join"}
              </span>
            </div>
            <div className="space-y-8">
              {[
                {
                  n: "01",
                  en: { title: "Discover & apply", desc: "Browse public Jaiffersons or receive a private invitation. Answer the host's onboarding questions. Your application goes directly to the host for approval." },
                  fr: { title: "Découvrez & candidatez", desc: "Parcourez les Jaiffersons publics ou recevez une invitation privée. Répondez aux questions d'onboarding de l'hôte. Votre candidature est transmise directement à l'hôte." },
                },
                {
                  n: "02",
                  en: { title: "Get accepted & attend", desc: "Once approved, you receive a confirmation email and a calendar invitation with the meeting link. Fireflies is already in the call. Just show up." },
                  fr: { title: "Soyez accepté & participez", desc: "Une fois approuvé, vous recevez un email de confirmation et une invitation calendrier avec le lien. Fireflies est déjà dans l'appel. Soyez juste présent." },
                },
                {
                  n: "03",
                  en: { title: "Receive your private synthesis", desc: "Within 24 hours: a private report written only for you. Your presence in the room. Your psychological reading. Your one strategic move before the next Festin." },
                  fr: { title: "Recevez votre synthèse privée", desc: "Sous 24h : un rapport privé écrit pour vous seul. Votre présence dans la salle. Votre lecture psychologique. Votre prochain mouvement stratégique." },
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-5">
                  <span className="font-serif text-4xl text-foreground/10 leading-none shrink-0 w-10">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="text-[14px] font-medium mb-1.5">
                      {isFr ? step.fr.title : step.en.title}
                    </h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                      {isFr ? step.fr.desc : step.en.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FESTIN 00 RESULTS SHOWCASE ───────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold/80 text-center mb-4">
            {isFr ? "Résultats réels · Festin 00" : "Real results · Festin 00"}
          </p>
          <h2 className="font-serif text-[clamp(24px,3.5vw,38px)] text-center text-primary-foreground mb-4 leading-snug">
            {isFr
              ? "Le dîner des pirates de la tech française"
              : "The dinner of French tech pirates"}
          </h2>
          <p className="text-center text-primary-foreground/60 text-[14px] mb-14 italic font-serif">
            {isFr
              ? "Organisé par Carlos · Paris · 7 participants · ~70 minutes"
              : "Hosted by Carlos · Paris · 7 participants · ~70 minutes"}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {STATS.map((s, i) => (
              <div key={i} className="text-center border border-primary-foreground/10 p-6">
                <p className="font-serif text-[36px] leading-none text-gold mb-2">{s.value}</p>
                <p className="text-[11px] uppercase tracking-widest text-primary-foreground/50 leading-snug">
                  {isFr ? s.labelFr : s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Sample insight */}
          <div className="border border-primary-foreground/10 p-8 md:p-10">
            <p className="text-[10px] tracking-[0.2em] uppercase text-gold/70 mb-6">
              {isFr ? "Extrait · Rapport global Festin 00" : "Extract · Festin 00 global report"}
            </p>
            <blockquote className="font-serif italic text-[clamp(16px,2.5vw,22px)] leading-relaxed text-primary-foreground/90 mb-6">
              {isFr
                ? "\"Ce que la salle a évité de dire, c'est la question du retour. Chacun a construit quelque chose. Aucun n'a nommé ce qu'il a laissé derrière.\""
                : "\"What the room avoided saying was the question of return. Each person had built something. None named what they left behind.\""}
            </blockquote>
            <p className="text-[12px] tracking-widest uppercase text-primary-foreground/30">
              — Jaifferson · {isFr ? "Section : Ce qui n'a pas été dit" : "Section: What was not said"}
            </p>
          </div>
        </div>
      </section>

      {/* ── UPCOMING FESTINS PREVIEW ─────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-[1000px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold mb-3">
              {isFr ? "Jaiffersons publics" : "Public Jaiffersons"}
            </p>
            <h2 className="font-serif text-[clamp(24px,3.5vw,38px)] leading-tight">
              {isFr ? "Les prochaines tables." : "The next tables."}
            </h2>
          </div>
          <button
            onClick={() => navigate("/explore")}
            className="hidden md:block text-[12px] tracking-widest uppercase text-muted-foreground hover:text-foreground border-b border-muted-foreground/30 hover:border-foreground transition-colors pb-0.5"
          >
            {isFr ? "Voir tout →" : "See all →"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FESTINS.map((f) => {
            const status = STATUS_CONFIG[f.status];
            return (
              <div
                key={f.id}
                className={`border border-border p-7 flex flex-col gap-5 group cursor-pointer hover:border-foreground/40 transition-colors`}
                onClick={() => {
                  if (f.id === "festin-00") navigate("/festin");
                  else if (f.status === "open") navigate("/create");
                  else navigate(`/explore`);
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <span className="font-serif text-5xl text-foreground/8 leading-none">
                    {f.number}
                  </span>
                  <span className={`text-[10px] tracking-widest uppercase px-2.5 py-1 ${status.cls}`}>
                    {isFr ? status.fr : status.en}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-serif text-[15px] leading-snug mb-1">
                    {isFr ? f.titleFr : f.title}
                  </h3>
                  {f.host !== "—" && (
                    <p className="text-[12px] text-muted-foreground">
                      {isFr ? "Hôte" : "Host"}: {f.host} · {f.location}
                    </p>
                  )}
                </div>

                {/* Tags */}
                {f.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {f.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-wide border border-border px-2 py-0.5 text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Participants bar */}
                {f.status !== "open" && (
                  <div>
                    <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5">
                      <span>{isFr ? "Participants" : "Participants"}</span>
                      <span>{f.participants}/{f.maxParticipants}</span>
                    </div>
                    <div className="h-0.5 bg-border w-full">
                      <div
                        className="h-0.5 bg-gold transition-all"
                        style={{ width: `${(f.participants / f.maxParticipants) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Highlight / CTA */}
                <p className="text-[11px] text-muted-foreground/70 italic border-t border-border pt-4 mt-auto leading-relaxed">
                  {isFr ? f.highlightFr : f.highlight}
                </p>

                {f.status === "open" && (
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate("/create"); }}
                    className="w-full border border-primary text-primary text-[12px] tracking-widest uppercase py-2.5 hover:bg-primary hover:text-primary-foreground transition-colors mt-1"
                  >
                    {isFr ? "Créer un Jaifferson" : "Create a Jaifferson"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile see all */}
        <div className="flex justify-center mt-8 md:hidden">
          <button
            onClick={() => navigate("/explore")}
            className="text-[12px] tracking-widest uppercase text-muted-foreground hover:text-foreground border-b border-muted-foreground/30 transition-colors"
          >
            {isFr ? "Voir tous les Jaiffersons →" : "See all Jaiffersons →"}
          </button>
        </div>
      </section>

      {/* ── QUOTE ────────────────────────────────────────────────────────── */}
      <section className="bg-foreground text-background py-20 px-6 text-center">
        <blockquote className="font-serif italic text-[clamp(18px,3vw,26px)] leading-relaxed max-w-[680px] mx-auto mb-6 opacity-90">
          {isFr
            ? "\"La plupart des conversations importent une fois. Jaifferson les fait compter dans le temps.\""
            : "\"Most conversations matter once. Jaifferson makes them compound.\""}
        </blockquote>
        <p className="text-[12px] tracking-[0.15em] uppercase opacity-30">
          — Jaifferson · {isFr ? "Curator-Stratège" : "Curator-Strategist"}
        </p>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 text-center max-w-[600px] mx-auto">
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold mb-6">
          {isFr ? "Commencez" : "Begin"}
        </p>
        <h2 className="font-serif text-[clamp(26px,4vw,42px)] leading-tight mb-6">
          {isFr
            ? "Votre prochain appel mérite mieux qu'un bon souvenir."
            : "Your next call deserves more than a good memory."}
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-10">
          {isFr
            ? "Créez un Jaifferson en moins de 5 minutes. Jaifferson s'occupe du reste."
            : "Create a Jaifferson in under 5 minutes. Jaifferson handles the rest."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/create")}
            className="bg-primary text-primary-foreground text-[13px] font-medium tracking-widest uppercase px-10 py-4 hover:bg-primary/90 transition-colors"
          >
            {isFr ? "Organiser un Jaifferson" : "Host a Jaifferson"}
          </button>
          <button
            onClick={() => navigate("/explore")}
            className="border border-border text-foreground text-[13px] font-medium tracking-widest uppercase px-10 py-4 hover:border-foreground transition-colors"
          >
            {isFr ? "Explorer les Jaiffersons" : "Explore Jaiffersons"}
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-2 text-[13px] text-muted-foreground">
        <span className="font-serif">Jaifferson</span>
        <span className="text-[11px] tracking-widest uppercase text-muted-foreground/50">
          {isFr ? "L'intelligence dans la salle" : "The intelligence in the room"}
        </span>
        <a
          href="https://www.linkedin.com/in/quentincloarec/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          {isFr ? "Par Quentin Cloarec" : "By Quentin Cloarec"}
        </a>
      </footer>
    </div>
  );
};

export default Index;

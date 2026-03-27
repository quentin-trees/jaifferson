import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

const Story = () => {
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

      {/* HERO */}
      <header className="px-6 md:px-12 pt-20 md:pt-28 pb-16 max-w-[780px] mx-auto text-center">
        <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold mb-6 block">
          The Story
        </span>
        <h1 className="font-serif text-[clamp(32px,5vw,52px)] leading-[1.15] text-foreground mb-6">
          The room talks.
          <br />
          Jaifferson{" "}
          <em className="text-gold italic">remembers.</em>
        </h1>
        <p className="text-[17px] leading-[1.75] text-muted-foreground max-w-[580px] mx-auto">
          Where it comes from. Why it exists. What it is trying to change.
        </p>
      </header>

      {/* CONTENT */}
      <article className="px-6 md:px-12 max-w-[700px] mx-auto pb-24 space-y-16">

        {/* --- Section: The problem --- */}
        <section className="space-y-6">
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            The problem nobody admits
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.8] text-muted-foreground">
            <p>
              Every founder has been in a room where something real happened. Not a pitch. Not a meeting. A conversation — the kind where someone says something they have never said out loud before, where an idea gets stress-tested by people who actually know what they are talking about, where you leave with a different understanding of your own business than when you arrived.
            </p>
            <p>
              And then, three days later, you cannot remember exactly what was said. You remember the feeling. You have a vague note on your phone. You meant to follow up with two people. You did not.
            </p>
            <p>
              The conversation happened. The intelligence it produced did not survive the evening.
            </p>
            <p className="text-foreground font-medium">
              This is the problem Jaifferson was built to solve.
            </p>
            <p>
              Not a new problem. Not a technical problem. A structural one: the most valuable thinking that founders do together is the least documented, the least systematised, and the least compounded over time.
            </p>
          </div>
        </section>

        {/* --- Section: Where it started --- */}
        <section className="space-y-6">
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            Where it started
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.8] text-muted-foreground">
            <p>
              Quentin Cloarec is the CEO of Trees Engineering, a manpower agency in the energy sector based in Kuala Lumpur, Malaysia. He did not set out to build a conversation intelligence platform. He set out to stop surviving and start living — his words, not a marketing line.
            </p>
            <p>
              Running a company in Malaysia, operating in a sector that demands precision and human trust, Quentin spent years being the person everyone depended on. The company ran because he was in every room, every decision, every conversation. That is a trap that most founders recognise only after they are already inside it.
            </p>
            <p>
              The shift started with a question he could not answer: <em className="text-foreground">what would happen to this company if I stopped being the one who remembers everything?</em>
            </p>
          </div>
        </section>

        {/* --- Section: The dinners --- */}
        <section className="space-y-6">
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            The dinners
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.8] text-muted-foreground">
            <p>
              It started in 2023. Quentin began hosting dinners at his place — small tables, four to six people, organised around a specific topic. Not networking events. Not social gatherings. Curated conversations with people carefully chosen because he knew they would bring ideas and vision to the table.
            </p>
            <p>
              The format worked. People who would never have met each other sat across from each other and said things they had not said before. The conversations were real. The problem was what happened after: the intelligence produced at those tables did not survive the evening.
            </p>
            <p>
              In parallel, Quentin was having dozens of one-to-one conversations online about AI — with founders, operators, researchers, people building in different corners of the same landscape. Each conversation was valuable on its own. But the connections between them — the patterns, the contradictions, the complementary views — were invisible because every conversation was isolated.
            </p>
            <p className="text-foreground font-medium">
              The idea was simple: what if he connected all of them together?
            </p>
            <p>
              The online Jaifferson was born from that instinct. Not a webinar. Not a panel. A structured conversation between people who had been thinking about the same problems separately — brought together so the room could produce something none of them could produce alone.
            </p>
            <p>
              That first online session became the proof that the format worked beyond a physical table. And it raised a harder question: all this intelligence was being produced — but who was capturing it? Who was reading it? Who was making it compound?
            </p>
          </div>
        </section>

        {/* --- Section: The idea --- */}
        <section className="space-y-6">
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            The idea
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.8] text-muted-foreground">
            <p>
              The idea was not to build a note-taking tool. Note-taking tools exist. They produce transcripts. Transcripts do not produce intelligence.
            </p>
            <p className="text-foreground font-medium">
              The idea was to build a reader of rooms.
            </p>
            <p>
              Something that could take a 70-minute conversation between seven people, attribute what each person said, measure how much they said, understand what the room was actually about beneath its stated topic, and produce two documents:
            </p>
            <ul className="list-none space-y-3 border-l-2 border-gold/40 pl-6">
              <li>
                <span className="text-foreground font-medium">One for the group</span> — a shared reading of what happened.
              </li>
              <li>
                <span className="text-foreground font-medium">One for each person</span> — a private map of where they stood in the room, what they revealed, what they avoided, and what they should do before the next conversation.
              </li>
            </ul>
            <p>
              Not a summary. An analysis. Not encouragement. A reading.
            </p>
          </div>
        </section>

        {/* --- Section: Jaifferson the persona --- */}
        <section className="space-y-6">
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            Jaifferson the persona
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.8] text-muted-foreground">
            <p>
              Jaifferson is not an assistant. It is not a note-taker. It is a <em className="text-foreground">Curator-Strategist</em> — an INTJ, 5w6, high-conscientiousness intelligence that operates at the intersection of pattern recognition and strategic clarity.
            </p>
            <p>
              It was designed to feel like the one person in the room who actually remembers. The one tracking patterns not just within a session but across sessions, across months, across the slow accumulation of who someone is becoming.
            </p>
            <p>
              Jaifferson is precise because precision is a form of respect. It is direct because softening what is true does not serve anyone. It is psychologically observant because understanding how people think is the precondition for understanding what they said.
            </p>
          </div>
        </section>

        {/* --- Section: The founding team --- */}
        <section className="space-y-6">
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            The founding team
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.8] text-muted-foreground">
            <p>Three people are building this.</p>
            <div className="space-y-6">
              <div className="border-l-2 border-gold/40 pl-6">
                <p className="text-foreground font-medium mb-1">Quentin — the architect</p>
                <p>He saw the problem first because he lived it. He is building Jaifferson partly to solve the dependency trap in his own company, and partly because he believes the founders who build the best companies are the ones who compound their judgment fastest. Jaifferson is a compounding machine.</p>
              </div>
              <div className="border-l-2 border-gold/40 pl-6">
                <p className="text-foreground font-medium mb-1">Eric — the operator</p>
                <p>Where Quentin sees systems, Eric sees execution. He is the person who asks what needs to be true for this to work, who it works for first, and what happens in the fifty cases the architect did not anticipate.</p>
              </div>
              <div className="border-l-2 border-gold/40 pl-6">
                <p className="text-foreground font-medium mb-1">Antoine — the executor</p>
                <p>Found through a Jaifferson call. He arrived prepared, answered the onboarding questions with precision, and said things in the session that suggested he had thought about the problem before it was named as a problem. He is the person who makes the calendar invite, sends the email, and delivers the thing.</p>
              </div>
            </div>
            <p className="text-foreground font-medium">Three people. Three different modes. One system.</p>
          </div>
        </section>

        {/* --- Section: What Jaifferson is not --- */}
        <section className="space-y-6">
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            What Jaifferson is not
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.8] text-muted-foreground">
            <ul className="list-none space-y-4">
              <li>
                <span className="text-foreground font-medium">It is not Timeleft.</span> Timeleft connects strangers for dinner. Jaifferson serves people who are already in the right rooms — and makes sure they leave with more than a good memory.
              </li>
              <li>
                <span className="text-foreground font-medium">It is not a meeting recorder.</span> Otter.ai, Fireflies, Fathom — these tools produce transcripts. A transcript is raw material. Jaifferson is what you do with it.
              </li>
              <li>
                <span className="text-foreground font-medium">It is not a CRM.</span> It does not track deals. It tracks people — how they think, how they show up, how they change across sessions. The output is not a contact record. It is a reading.
              </li>
              <li>
                <span className="text-foreground font-medium">It is not a coach.</span> It tells you what happened in this room, what it means for where you are now, and what the one move is before the next time you are in a room like this.
              </li>
            </ul>
          </div>
        </section>

        {/* --- Section: What it is trying to change --- */}
        <section className="space-y-6">
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            What it is trying to change
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.8] text-muted-foreground">
            <p className="text-foreground font-medium">
              The founders who build the most compounding judgment are the ones who treat their conversations as an asset, not a byproduct.
            </p>
            <p>
              Most do not. Most trust their memory. Most trust their notes. Both are lossy. Both decay.
            </p>
            <p>
              Jaifferson is a bet that the next generation of serious operators will treat their conversations the way they treat their code: versioned, stored, analysable, and compounding over time.
            </p>
            <p>
              One Jaifferson is a report. Ten Jaiffersons is a map. A map of how a person thinks, who they are when they are in rooms that challenge them, what they have been circling for three months without naming it, and who in their network is most complementary to where they are going.
            </p>
            <p className="text-foreground font-medium">
              That is the long game. The first session is just the beginning of it.
            </p>
          </div>
        </section>

        {/* --- Section: The name --- */}
        <section className="space-y-6">
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            The name
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.8] text-muted-foreground">
            <p>
              The format is inspired by the <span className="text-foreground font-medium">Jeffersonian Dinner</span> — a small, hosted meal built around one meaningful group conversation, usually 8 to 14 people, guided by a single topic and a moderator who keeps the discussion deep, not wide. No small talk. No networking. Just one shared question, explored seriously.
            </p>
            <p>
              The name Jaifferson is a deliberate mutation. The "J'ai" — French for "I have" — replaces the "Je" of Jefferson. It carries intention: <em>I have something to bring to the table.</em> The rest sounds familiar enough to evoke the tradition, but different enough to be its own thing.
            </p>
            <p>
              It is not an acronym. It is not named after a person. It is a constructed name — firm enough to carry authority, unusual enough to be unambiguous, precise enough to sound like something that means exactly what it does.
            </p>
            <p>
              The kind of name a Curator-Strategist would choose: memorable without being clever, distinctive without being noisy.
            </p>
          </div>
        </section>

        {/* --- Closing --- */}
        <footer className="pt-8 border-t border-border text-center space-y-2">
          <p className="text-[13px] tracking-[0.15em] uppercase text-muted-foreground">
            Founded 2026 · Kuala Lumpur × Paris
          </p>
          <p className="text-[13px] tracking-[0.15em] uppercase text-muted-foreground">
            Quentin Cloarec × Eric × Antoine
          </p>
          <p className="font-serif text-[20px] text-foreground italic mt-4">
            "The room talks. Jaifferson remembers."
          </p>
        </footer>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            to="/create"
            className="bg-primary text-primary-foreground text-[13px] font-medium tracking-[0.12em] uppercase px-8 py-4 hover:bg-primary/90 transition-colors text-center"
          >
            {t.hero.ctaHost}
          </Link>
          <Link
            to="/explore"
            className="border border-primary text-primary text-[13px] font-medium tracking-[0.12em] uppercase px-8 py-4 hover:bg-primary hover:text-primary-foreground transition-colors text-center"
          >
            {t.hero.ctaExplore}
          </Link>
        </div>
      </article>

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

export default Story;

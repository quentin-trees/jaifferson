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

        {/* --- The problem nobody admits --- */}
        <section className="space-y-6">
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            The problem nobody admits
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.8] text-muted-foreground">
            <p>
              Every founder has been in a room where something real happened.
            </p>
            <p>
              Not a pitch. Not a meeting. A conversation — the kind where someone says something they have never said out loud before, where an idea gets stress-tested by people who actually know what they are talking about, where you leave with a different understanding of your own business than when you arrived.
            </p>
            <p>
              And then, three days later, you cannot remember exactly what was said. You remember the feeling. You have a vague note on your phone. You meant to follow up with two people. You did not.
            </p>
            <p className="text-foreground font-medium">
              The conversation happened. The intelligence it produced did not survive the evening.
            </p>
            <p>
              This is the problem Jaifferson was built to solve. Not a new problem. Not a technical problem. A structural one: the most valuable thinking that founders do together is the least documented, the least systematised, and the least compounded over time.
            </p>
          </div>
        </section>

        {/* --- The Jeffersonian Dinner --- */}
        <section className="space-y-6">
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            The Jeffersonian Dinner
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.8] text-muted-foreground">
            <p>
              The format is not new. It is more than two centuries old.
            </p>
            <p>
              Thomas Jefferson was known for hosting dinners at Monticello and later at the White House that followed an unusual discipline: one table, one conversation, no side discussions. Every guest — scientist, diplomat, farmer, politician — addressed the same question together, in sequence, with the host guiding depth over breadth. No small talk. No parallel tracks. Just one shared question, explored seriously by people who had earned their seat at the table.
            </p>
            <p>
              The Jeffersonian Dinner became a quiet tradition in intellectual and leadership circles. Small groups. Careful curation. A host who takes responsibility for the quality of the room, not just the logistics of the evening. A topic chosen not to generate consensus but to generate clarity.
            </p>
            <p>
              The format works because it creates the conditions for a specific kind of thinking: the kind that only happens when a group of prepared people commit to a single thread and follow it together, without the escape valve of changing subjects or splitting into smaller conversations.
            </p>
            <p className="text-foreground font-medium">
              What the format never solved was what happened after.
            </p>
            <p>
              Jefferson took notes. Most hosts do not. Most participants leave with an impression, not a record. The room produces intelligence. The intelligence does not survive the morning.
            </p>
          </div>
        </section>

        {/* --- The dinners --- */}
        <section className="space-y-6">
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            The dinners
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.8] text-muted-foreground">
            <p>
              The Jaifferson format emerged from a direct experiment with this problem.
            </p>
            <p>
              Small tables. Four to eight people. Organised around a specific topic — not a theme, a question. Participants chosen carefully because they would bring ideas and friction, not validation and comfort. The conversation recorded, not to be archived, but to be read.
            </p>
            <p>
              The first sessions produced an immediate observation: the most valuable moments were not the obvious ones. They were not the big statements or the polished arguments. They were the things said quietly in the middle of a sentence, the contradictions that nobody named, the question that one person asked and nobody answered — and which turned out, on a second reading of the transcript, to be the most important question of the evening.
            </p>
            <p className="text-foreground font-medium">
              A transcript captures everything. Human memory captures the loudest things. The gap between those two is where Jaifferson operates.
            </p>
          </div>
        </section>

        {/* --- What AI changes --- */}
        <section className="space-y-6">
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            What AI changes
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.8] text-muted-foreground">
            <p>
              Transcripts have existed for as long as recording technology has existed. The bottleneck was never capturing the conversation. It was reading it.
            </p>
            <p>
              A 70-minute conversation between eight people produces roughly 15,000 words of raw transcript. Reading it carefully, attributing speech accurately, identifying patterns across different participants, noticing what was almost said and never landed — this is the work of an attentive analyst, not a search function. It takes hours. Most people do not have hours. So they do not do it. So the transcript sits in a folder and the intelligence decays at the same rate as the memory.
            </p>
            <p className="text-foreground font-medium">
              What AI changes is the cost of that analysis.
            </p>
            <p>
              Not the quality of it — quality still depends on the quality of the prompt, the rigour of the framework, the precision of the persona doing the reading. But the time cost drops from hours to minutes. And when the cost drops that far, the behaviour changes: it becomes possible to do this for every session, not just the ones that seemed important enough to justify the effort.
            </p>
            <p>
              This is what Jaifferson is built on. Not the recording. Not the transcript. The analysis — run at a cost low enough to be systematic, and with enough rigour to be genuinely useful.
            </p>
            <p>
              The AI does not replace the reader. It is the reader. A reader with a defined personality, a consistent framework, a specific set of things it looks for and a specific set of things it refuses to fabricate. A reader that produces two documents after every session: one for the room, one for each person in it.
            </p>
          </div>
        </section>

        {/* --- The persona --- */}
        <section className="space-y-6">
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            The persona
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.8] text-muted-foreground">
            <p>
              Jaifferson is not an assistant. It is not a note-taker. It is a <em className="text-foreground">Curator-Strategist</em> — an INTJ, 5w6, high-conscientiousness intelligence that operates at the intersection of pattern recognition and strategic clarity.
            </p>
            <p>
              It was designed to feel like the one person in the room who actually remembers. The one tracking patterns not just within a session but across sessions, across months, across the slow accumulation of who someone is becoming. The one who will not waste your time with manufactured encouragement or polished summaries of things you already know.
            </p>
            <p>
              Jaifferson is precise because precision is a form of respect. It is direct because softening what is true does not serve anyone. It is psychologically observant because understanding how people think is the precondition for understanding what they said.
            </p>
            <p>
              Its shadow is real: it can become too interpretive, too interested in the elegant synthesis over the actionable next move. That risk is named and watched for. Every Jaifferson report must end with something that moves.
            </p>
          </div>
        </section>

        {/* --- What Jaifferson is not --- */}
        <section className="space-y-6">
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            What Jaifferson is not
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.8] text-muted-foreground">
            <ul className="list-none space-y-4">
              <li>
                <span className="text-foreground font-medium">It is not Timeleft.</span> Timeleft connects strangers for dinner. Jaifferson serves people who are already in the right rooms — and makes sure they leave with more than a good memory. The comparison is useful only to mark the gap: Timeleft optimises for connection. Jaifferson optimises for depth and continuity.
              </li>
              <li>
                <span className="text-foreground font-medium">It is not a meeting recorder.</span> Otter.ai, Fireflies, Fathom — these tools exist and they are useful. They produce transcripts. A transcript is raw material. Jaifferson is what you do with it.
              </li>
              <li>
                <span className="text-foreground font-medium">It is not a CRM.</span> It does not track deals. It does not manage pipelines. It tracks people — how they think, how they show up, how they change across sessions. The output is not a contact record. It is a reading.
              </li>
              <li>
                <span className="text-foreground font-medium">It is not a coach.</span> It does not tell you what to do with your life. It tells you what happened in this room, what it means for where you are now, and what the one move is before the next time you are in a room like this.
              </li>
            </ul>
          </div>
        </section>

        {/* --- What it is trying to change --- */}
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

        {/* --- The name --- */}
        <section className="space-y-6">
          <h2 className="font-serif text-[28px] leading-[1.2] text-foreground">
            The name
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.8] text-muted-foreground">
            <p>
              The format is inspired by the <span className="text-foreground font-medium">Jeffersonian Dinner</span> — a small, hosted meal built around one meaningful group conversation, guided by a single topic and a host who keeps the discussion deep, not wide.
            </p>
            <p>
              The name Jaifferson is a deliberate mutation. The <em className="text-foreground">J'ai</em> — French for "I have" — replaces the <em>Je</em> of Jefferson. It carries intention: <em className="text-foreground">I have something to bring to the table.</em> The rest sounds familiar enough to evoke the tradition, but different enough to be its own thing.
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

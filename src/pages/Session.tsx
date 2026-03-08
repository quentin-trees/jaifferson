import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const Session = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-8 md:px-16">
        <Logo />
      </header>

      {/* Hero */}
      <main className="px-6 md:px-16">
        <div className="mx-auto max-w-3xl py-16 md:py-24">
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-2">Session #01</h1>
          <p className="text-lg text-muted-foreground mb-12">What is Jaifferson?</p>

          <div className="space-y-6 text-base leading-relaxed text-foreground max-w-2xl">
            <p>
              Most meetings are broken. Jaifferson is a new way of doing them — inspired by the
              gatherings Thomas Jefferson was famous for: a small group, one topic, everyone
              contributes, and the conversation actually produces something.
            </p>
            <p>
              Jaifferson brings that format to any setting — a video call, a restaurant, a living
              room — and uses AI to do the preparation that makes it work: understanding who is in
              the room, structuring the session, and capturing what came out of it. Any subject. Any
              group.
            </p>
          </div>

          <div className="mt-12">
            <Button asChild size="lg" className="rounded-none text-base px-8 py-6">
              <Link to="/onboard">Complete your onboarding →</Link>
            </Button>
          </div>
        </div>

        {/* Session Details */}
        <div className="mx-auto max-w-3xl border-t border-border pt-12 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Topic</p>
              <p className="text-foreground">What is Jaifferson?</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Format</p>
              <p className="text-foreground">Video call · ~90 minutes · Small group</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Host</p>
              <p className="text-foreground">Quentin Cloarec, Trees Engineering</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 md:px-16">
        <p className="text-sm text-muted-foreground">
          Jaifferson · A project by Trees Engineering · Session #01
        </p>
      </footer>
    </div>
  );
};

export default Session;

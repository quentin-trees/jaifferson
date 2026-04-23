import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X, Check, AlertCircle, Linkedin, Menu, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type View = "home" | "terms" | "privacy";
type ModalStep = "email" | "success" | "not-enough" | null;

const Index = () => {
  const [view, setView] = useState<View>("home");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<ModalStep>(null);
  const [submitting, setSubmitting] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view !== "home") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  const closeModal = () => {
    setStep(null);
    setUrl("");
  };

  const launchProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    const hasEnough = !/\/(404|notfound)\b/i.test(url);
    setStep(hasEnough ? "email" : "not-enough");
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("cloarec-decode-request", {
        body: { url, email },
      });
      if (error) throw error;
      setStep("success");
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToId = (id: string) => {
    setView("home");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="min-h-screen text-foreground">
      <div className="max-w-[1080px] mx-auto px-7 pt-8 pb-20">
        <nav className="flex items-center justify-between py-2 mb-14">
          <button
            onClick={() => setView("home")}
            className="font-display font-extrabold text-[22px] tracking-tight"
          >
            cloarec<span className="text-gold">.ai</span>
          </button>
          
          {/* Desktop nav */}
          <div className="hidden md:flex gap-7 text-sm text-muted-foreground items-center">
            <button onClick={() => scrollToId("how")} className="hover:text-foreground transition-colors">
              How it works
            </button>
            <button onClick={() => scrollToId("preview")} className="hover:text-foreground transition-colors">
              What you get
            </button>
            <button onClick={() => scrollToId("faq")} className="hover:text-foreground transition-colors">
              FAQ
            </button>
            <Link to="/examples" className="text-gold hover:text-gold-soft transition-colors font-medium">
              Examples
            </Link>
            <a
              href="https://www.linkedin.com/in/quentincloarec/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </a>
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <button className="p-2 -mr-2 text-muted-foreground hover:text-foreground">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-[hsl(var(--background-2))] border-l border-line">
              <div className="flex flex-col gap-6 pt-8">
                <Link to="/" className="font-display font-extrabold text-xl tracking-tight">
                  cloarec<span className="text-gold">.ai</span>
                </Link>
                <div className="h-px bg-line" />
                <div className="flex flex-col gap-4 text-sm">
                  <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </Link>
                  <Link to="/examples" className="text-gold font-medium">
                    Examples
                  </Link>
                  <a
                    href="https://www.linkedin.com/in/quentincloarec/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>

        {view === "home" && (
          <>
            <section className="py-10 pb-12">
              <span className="inline-block text-[12px] tracking-[0.18em] uppercase text-gold border border-line rounded-full px-3.5 py-1.5 mb-7">
                Strategic Intelligence, on anyone
              </span>
              <h1 className="font-display font-semibold leading-[1.02] tracking-[-0.03em] text-[clamp(42px,6vw,76px)] mb-6">
                Decode anyone<br />
                in <em className="italic font-normal text-gold-soft">60 seconds.</em>
              </h1>
              <p className="text-[19px] leading-[1.55] text-muted-foreground max-w-[640px] mb-5">
                Paste a LinkedIn or X link. Get a deep strategic profile — identity, values, MBTI hypothesis,
                blue ocean, and how to approach them.
              </p>
              
              {/* CTA Examples */}
              <Link
                to="/examples"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-gold hover:text-gold-soft transition-colors mb-6 group"
              >
                <span className="inline-flex items-center gap-2 border border-gold/30 rounded-full px-4 py-2 group-hover:border-gold/50 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                  See 5 sample dossiers
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>

              <div className="inline-flex items-center gap-2 text-[13px] text-gold-soft bg-[hsl(var(--gold)/0.08)] border border-line rounded-full px-3.5 py-2 mb-10">
                <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_hsl(var(--gold))]" />
                100% based on publicly available information
              </div>

              <div className="rounded-[20px] border border-line bg-gradient-to-b from-white/[0.03] to-white/[0.01] backdrop-blur-md p-7">
                <form onSubmit={launchProfile} className="flex flex-wrap gap-2.5">
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/...  or  https://x.com/..."
                    className="flex-1 min-w-[260px] bg-black/25 border border-line text-foreground rounded-xl px-[18px] py-4 text-base outline-none focus:border-gold focus:bg-black/35 transition-colors placeholder:text-[hsl(var(--muted-foreground)/0.55)]"
                  />
                  <button
                    type="submit"
                    className="bg-gold text-primary-foreground rounded-xl px-7 py-4 text-base font-semibold tracking-[0.01em] hover:bg-gold-soft hover:-translate-y-0.5 transition-all"
                  >
                    Launch profile →
                  </button>
                </form>
                <p className="text-[13px] text-muted-foreground mt-3.5">
                  Works with <strong className="text-gold-soft font-medium">LinkedIn</strong> and{" "}
                  <strong className="text-gold-soft font-medium">X / Twitter</strong>. No login needed to start.
                </p>
                <p className="text-[12px] text-muted-foreground mt-4 pt-4 border-t border-dashed border-line leading-[1.55]">
                  Cloarec.ai analyses <strong className="text-foreground font-medium">only publicly available information</strong> from
                  the link you provide and open-web sources. We do not scrape private data, DMs, emails, or anything behind
                  authentication. If the public footprint is too thin, we'll tell you — no report will be generated.
                </p>
              </div>
            </section>

            <section id="how" className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { n: "01 — Paste", d: "Drop any public LinkedIn or X profile URL. One field, zero friction." },
                {
                  n: "02 — Decode",
                  d: "We run the Cloarec methodology on their public footprint — compressed CV, deep values, MBTI hypothesis, psychological read, blue ocean.",
                },
                {
                  n: "03 — Approach",
                  d: "Concrete fit analysis and a tailored approach strategy. Walk in already knowing them.",
                },
              ].map((f) => (
                <div key={f.n} className="border border-line rounded-2xl p-6">
                  <h3 className="font-display font-semibold text-[19px] mb-2.5 text-gold-soft">{f.n}</h3>
                  <p className="text-sm leading-[1.6] text-muted-foreground">{f.d}</p>
                </div>
              ))}
            </section>

            <div className="h-px bg-line my-20" />

            <section id="preview">
              <div className="font-display text-sm uppercase tracking-[0.2em] text-gold mb-5">
                What's inside every profile
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-sm">
                {[
                  ["Identity", "Name, role, trajectory in one glance"],
                  ["Compressed CV", "Career arc, distilled"],
                  ["Deep Values", "What actually drives them"],
                  ["MBTI Hypothesis", "Cognitive profile, with evidence"],
                  ["Psychological Read", "Patterns, tensions, probable wounds"],
                  ["Blue Ocean", "Where they could win uncontested"],
                  ["Fit Analysis", "Alignment with your goal"],
                  ["Approach Strategy", "Exact angle to open the door"],
                ].map(([title, sub]) => (
                  <div
                    key={title}
                    className="px-[18px] py-3.5 border-l-2 border-gold bg-white/[0.02] rounded-[4px]"
                  >
                    {title}
                    <span className="block text-xs text-muted-foreground mt-0.5">{sub}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-px bg-line my-20" />

            <section id="faq">
              <h2 className="font-display font-semibold text-[34px] tracking-[-0.02em] mb-3">
                Frequently asked
              </h2>
              <p className="text-muted-foreground text-base mb-9 max-w-[580px]">
                The honest answers before you paste your first link.
              </p>
              <div className="flex flex-col gap-2.5">
                {FAQ.map((item, i) => (
                  <details
                    key={i}
                    open={i === 0}
                    className="border border-line rounded-xl px-[22px] py-[18px] bg-white/[0.02] open:bg-white/[0.04] transition-colors group"
                  >
                    <summary className="cursor-pointer list-none flex justify-between items-center font-medium text-base text-foreground">
                      {item.q}
                      <span className="text-gold text-2xl transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p
                      className="mt-3 text-muted-foreground leading-[1.65] text-[15px]"
                      dangerouslySetInnerHTML={{ __html: item.a }}
                    />
                  </details>
                ))}
              </div>
            </section>
          </>
        )}

        {view === "terms" && (
          <Legal title="Terms & Conditions" updated="23 April 2026" onBack={() => setView("home")}>
            <h2>1. Acceptance</h2>
            <p>By using Cloarec.ai ("the Service") you agree to these Terms. If you do not agree, do not use the Service.</p>
            <h2>2. What the Service does</h2>
            <p>Cloarec.ai generates strategic profiles of individuals based <strong>exclusively on publicly available information</strong>. The Service does not access private data, authenticated-only content, or data obtained in breach of any third party's terms of service.</p>
            <h2>3. Acceptable use</h2>
            <ul>
              <li>You will use the Service only for lawful professional purposes — business development, recruiting, due diligence, research, journalism.</li>
              <li>You will <strong>not</strong> use the Service to stalk, harass, discriminate, defame, or cause harm to any individual.</li>
              <li>You will <strong>not</strong> use outputs to make consequential decisions (hiring, lending, housing) without independent human review.</li>
              <li>You will not attempt to reverse-engineer, resell, or redistribute reports without written permission.</li>
            </ul>
            <h2>4. Nature of the output</h2>
            <p>Profiles contain <strong>hypotheses and interpretations</strong>, not facts or guaranteed truths. Psychological and MBTI sections are informed guesses from public patterns — treat accordingly. Cloarec.ai disclaims all liability for decisions made on the basis of a report.</p>
            <h2>5. Results are not guaranteed</h2>
            <p>If the public footprint is insufficient, no report is delivered. Paid credits are refunded automatically in that case.</p>
            <h2>6. Intellectual property</h2>
            <p>The Cloarec methodology, prompts, design system, and infrastructure are proprietary. Reports delivered to you are licensed for your own internal use.</p>
            <h2>7. Pricing & refunds</h2>
            <p>Free preview with limited sections; paid plans unlock the full 8-section report. Refunds issued automatically when we cannot deliver a credible profile.</p>
            <h2>8. Termination</h2>
            <p>We may suspend or terminate any account that breaches these Terms, or that we suspect of using the Service to harm others.</p>
            <h2>9. Governing law</h2>
            <p>These Terms are governed by French law. Disputes are subject to the exclusive jurisdiction of the courts of Paris.</p>
            <h2>10. Contact</h2>
            <p>hello@cloarec.ai</p>
          </Legal>
        )}

        {view === "privacy" && (
          <Legal title="Privacy Policy" updated="23 April 2026" onBack={() => setView("home")}>
            <h2>1. Who we are</h2>
            <p>Cloarec.ai ("we", "us") is the data controller for personal data processed through this service. Contact: <strong>privacy@cloarec.ai</strong>.</p>
            <h2>2. Data we process about you (our user)</h2>
            <ul>
              <li>Email address (to deliver reports and account communications).</li>
              <li>URLs you submit and reports generated from them.</li>
              <li>Basic usage telemetry (to operate and improve the Service).</li>
            </ul>
            <h2>3. Data we process about profiled subjects</h2>
            <p>When you submit a URL, we collect and analyse <strong>only publicly available information</strong> about the subject — what appears on the public profile plus what is indexed on the open web. We do not scrape private data, authenticated-only pages, DMs, or emails.</p>
            <p>Legal basis: legitimate interest (GDPR Art. 6(1)(f)) — enabling lawful professional research. We balance this against the subject's rights and refuse clearly abusive requests.</p>
            <h2>4. Data retention</h2>
            <ul>
              <li>Reports are stored in your account until you delete them or close your account.</li>
              <li>Account data is retained for the life of the account and deleted within 30 days of closure.</li>
              <li>Logs are retained for 90 days for security and debugging.</li>
            </ul>
            <h2>5. Your rights (GDPR)</h2>
            <p>You have the right to access, rectify, delete, restrict, or port your data, and to object to processing. Email <strong>privacy@cloarec.ai</strong> to exercise any of these.</p>
            <h2>6. Rights of profiled subjects</h2>
            <p>Any individual profiled through the Service may request access, correction, or deletion of the data we hold about them by emailing <strong>privacy@cloarec.ai</strong>. We honour these requests within 30 days.</p>
            <h2>7. Sub-processors</h2>
            <ul>
              <li><strong>Anthropic</strong> — AI model inference (reports are generated via the Claude API).</li>
              <li><strong>Cloud hosting</strong> — EU-based infrastructure providers.</li>
              <li><strong>Transactional email</strong> — to deliver reports to your inbox.</li>
            </ul>
            <h2>8. Cookies</h2>
            <p>We use only strictly necessary cookies for authentication and session management. No ad tracking, no third-party marketing pixels.</p>
            <h2>9. International transfers</h2>
            <p>Where data is transferred outside the EEA, we rely on Standard Contractual Clauses.</p>
            <h2>10. Changes</h2>
            <p>We will notify you by email of material changes at least 30 days before they take effect.</p>
          </Legal>
        )}

        <footer className="mt-24 pt-7 border-t border-line flex flex-wrap justify-between gap-4 text-[13px] text-muted-foreground">
          <div>© 2026 Cloarec.ai — by Quentin Cloarec</div>
          <div className="flex gap-5">
            <button onClick={() => setView("terms")} className="hover:text-gold-soft transition-colors">
              Terms
            </button>
            <button onClick={() => setView("privacy")} className="hover:text-gold-soft transition-colors">
              Privacy
            </button>
            <a href="mailto:hello@cloarec.ai" className="hover:text-gold-soft transition-colors">
              Contact
            </a>
            <a
              href="https://www.linkedin.com/in/quentincloarec/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-soft transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </div>

      {step !== null && (
        <div
          ref={overlayRef}
          onClick={(e) => e.target === overlayRef.current && closeModal()}
          className="fixed inset-0 z-50 bg-[hsl(211_56%_5%/0.78)] backdrop-blur-md flex items-center justify-center p-5"
        >
          <div className="bg-[hsl(var(--background-2))] border border-line rounded-[20px] max-w-[480px] w-full p-9 text-center relative">
            <button
              onClick={closeModal}
              className="absolute top-5 right-6 text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {step === "email" && (
              <>
                <h2 className="font-display font-semibold text-[28px] tracking-[-0.02em] mb-3">
                  Profile ready.
                </h2>
                <p className="text-muted-foreground mb-6 leading-[1.5]">
                  We found enough public signal to decode this target. Drop your email and we'll deliver the full
                  8-section report to your inbox.
                </p>
                <form onSubmit={submitEmail}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-black/25 border border-line text-foreground rounded-xl px-[18px] py-4 text-base outline-none focus:border-gold focus:bg-black/35 transition-colors placeholder:text-[hsl(var(--muted-foreground)/0.55)] mb-3"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gold text-primary-foreground rounded-xl px-7 py-4 text-base font-semibold hover:bg-gold-soft transition-colors disabled:opacity-60"
                  >
                    {submitting ? "Sending..." : "Send me the full profile →"}
                  </button>
                </form>
                <p className="text-xs text-muted-foreground mt-4 text-left leading-[1.5]">
                  By submitting you confirm the subject's information is publicly available and that you'll use the
                  report for lawful professional purposes. See our{" "}
                  <button onClick={() => { setView("terms"); closeModal(); }} className="text-gold hover:text-gold-soft">
                    Terms
                  </button>{" "}
                  and{" "}
                  <button onClick={() => { setView("privacy"); closeModal(); }} className="text-gold hover:text-gold-soft">
                    Privacy Policy
                  </button>
                  .
                </p>
              </>
            )}

            {step === "success" && (
              <>
                <div className="w-14 h-14 rounded-full bg-gold text-primary-foreground flex items-center justify-center mx-auto mb-5">
                  <Check className="w-7 h-7" />
                </div>
                <h2 className="font-display font-semibold text-[28px] tracking-[-0.02em] mb-3">
                  Check your inbox.
                </h2>
                <p className="text-muted-foreground mb-6 leading-[1.5]">
                  Your target profile is being generated and will land in your inbox within a few minutes.
                </p>
                <button
                  onClick={closeModal}
                  className="w-full border border-line text-foreground rounded-xl px-7 py-4 text-base font-semibold hover:border-gold hover:text-gold-soft transition-colors"
                >
                  Decode another
                </button>
              </>
            )}

            {step === "not-enough" && (
              <>
                <div className="w-14 h-14 rounded-full bg-[hsl(var(--gold)/0.15)] border border-gold text-gold flex items-center justify-center mx-auto mb-5">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h2 className="font-display font-semibold text-[28px] tracking-[-0.02em] mb-3">
                  Not enough public signal.
                </h2>
                <p className="text-muted-foreground mb-6 leading-[1.5]">
                  This profile doesn't have enough publicly available information for us to produce a credible report.
                  Try a more active profile, or paste additional context (articles, interviews) on the next step.
                </p>
                <button
                  onClick={closeModal}
                  className="w-full border border-line text-foreground rounded-xl px-7 py-4 text-base font-semibold hover:border-gold hover:text-gold-soft transition-colors"
                >
                  Try another link
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const FAQ = [
  {
    q: "Is this based on private data?",
    a: 'No. Cloarec.ai only analyses <strong class="text-foreground font-medium">publicly available information</strong> — what appears on the public LinkedIn or X profile, plus what\'s indexed on the open web (interviews, articles, podcasts, public posts). We do not access private messages, connections, emails, or anything behind a login.',
  },
  {
    q: "What happens if there's not enough public info?",
    a: "We only deliver a report when we have enough signal to produce a credible profile. If the public footprint is too thin (private profile, minimal activity, no press coverage), we'll tell you — and you won't receive a report. No half-baked output.",
  },
  {
    q: "How accurate are the psychological and MBTI sections?",
    a: 'They are <strong class="text-foreground font-medium">hypotheses</strong>, not diagnoses. Built on observed patterns in public behaviour, language, and career choices. Treat them as strategic working hypotheses to refine on first contact — not verdicts.',
  },
  {
    q: "Is this legal and GDPR-compliant?",
    a: "Yes. We process only publicly available personal data under a legitimate-interest basis (GDPR Art. 6(1)(f)) for the user conducting lawful outreach or research. Any subject may request access, correction, or deletion of data we hold on them.",
  },
  {
    q: "Can I profile someone who is a private individual?",
    a: "Cloarec.ai is designed for professional research — prospects, candidates, partners, investors, public figures. We discourage using it on private individuals with no public-facing professional presence, and we reserve the right to refuse any request.",
  },
  {
    q: "Do you store the profiles I generate?",
    a: "We store them linked to your account so you can retrieve them later. You can delete any profile from your dashboard.",
  },
  {
    q: "How long does it take?",
    a: "Usually under 90 seconds for a standard profile. Complex subjects with heavy press coverage can take up to 3 minutes. You'll receive the full report by email.",
  },
  {
    q: "Can the person I profile find out?",
    a: "No. We never contact the subject. Generating a profile leaves no trace on their LinkedIn or X account — we don't visit logged-in pages or interact with their profile in any way.",
  },
];

const Legal = ({
  title,
  updated,
  onBack,
  children,
}: {
  title: string;
  updated: string;
  onBack: () => void;
  children: React.ReactNode;
}) => (
  <div className="max-w-[760px]">
    <button
      onClick={onBack}
      className="inline-flex items-center gap-1.5 text-gold hover:text-gold-soft text-sm mb-6"
    >
      ← Back
    </button>
    <h1 className="font-display text-[42px] tracking-[-0.02em] mb-2">{title}</h1>
    <p className="text-muted-foreground text-[13px] mb-8">Last updated: {updated}</p>
    <div className="[&>h2]:font-display [&>h2]:font-semibold [&>h2]:text-[22px] [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:text-gold-soft [&>p]:text-muted-foreground [&>p]:leading-[1.7] [&>p]:text-[15px] [&>p]:mb-3 [&>ul]:pl-[22px] [&>ul]:mb-3 [&>ul]:list-disc [&>ul>li]:text-muted-foreground [&>ul>li]:leading-[1.7] [&>ul>li]:text-[15px] [&>ul>li]:mb-3 [&_strong]:text-foreground [&_strong]:font-medium">
      {children}
    </div>
  </div>
);

export default Index;

import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { ExampleSubject } from "@/data/examples";

/**
 * DossierLayout — editorial dossier in the Mottola style.
 * Palette is hard-coded here intentionally: this view is a
 * standalone artifact that should NOT inherit the dark site theme.
 *   cream  #efe8dc
 *   ink    #17140f
 *   orange #ff5b22
 *   stone  #6b6355
 */
export const DossierLayout = ({
  subject,
  issue = "TREES · INTEL · 04·2026",
  children,
}: {
  subject: ExampleSubject;
  issue?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#efe8dc", color: "#17140f" }}
    >
      {/* Top utility bar — only thing that links back to the app */}
      <div
        className="sticky top-0 z-30 border-b"
        style={{ borderColor: "#17140f22", background: "#efe8dceb", backdropFilter: "blur(8px)" }}
      >
        <div className="max-w-[1200px] mx-auto px-8 py-3 flex items-center justify-between">
          <Link
            to="/examples"
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase hover:opacity-60 transition-opacity"
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All dossiers
          </Link>
          <Link
            to="/"
            className="text-[12px] tracking-[0.18em] uppercase hover:opacity-60 transition-opacity"
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
          >
            cloarec.ai
          </Link>
        </div>
      </div>

      {/* COVER */}
      <section className="max-w-[1200px] mx-auto px-8 pt-20 pb-14">
        <div style={{ height: 4, background: "#17140f" }} />
        <div className="grid grid-cols-12 gap-6 pt-16 pb-10">
          <div className="col-span-12 md:col-span-7">
            <div
              className="text-[12px] tracking-[0.22em] uppercase mb-6"
              style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            >
              Dossier · {subject.shortName} · Trees Intel
            </div>
            <h1
              className="leading-[0.85]"
              style={{
                fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(140px, 20vw, 260px)",
                fontWeight: 400,
                letterSpacing: "-0.04em",
              }}
            >
              {subject.initial}
              <span style={{ color: "#ff5b22" }}>.</span>
            </h1>
            <div style={{ height: 8, background: "#ff5b22", width: "min(640px, 80%)", marginTop: 24 }} />
            <div
              className="mt-8 text-[15px] tracking-[0.18em] uppercase"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            >
              Dossier · {subject.name}
            </div>
            <div
              className="mt-2 text-[13px] tracking-[0.18em] uppercase"
              style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            >
              {issue}
            </div>
          </div>

          <aside className="col-span-12 md:col-span-5 md:pl-8 md:border-l" style={{ borderColor: "#17140f22" }}>
            <Meta label="Subject" value={subject.name} />
            <Meta label="Role" value={subject.role} />
            <Meta label="Location" value={subject.location} />
            <Meta label="Method" value="Cloarec methodology · public footprint only" />
            <Meta label="Issue" value={issue} />
          </aside>
        </div>
        <div style={{ height: 4, background: "#17140f" }} />
      </section>

      {/* CONTENT */}
      <main className="max-w-[1200px] mx-auto px-8 pb-32">{children}</main>

      {/* FOOTER */}
      <footer
        className="border-t"
        style={{ borderColor: "#17140f22" }}
      >
        <div className="max-w-[1200px] mx-auto px-8 py-10 flex items-center justify-between">
          <div
            className="text-[11px] tracking-[0.2em] uppercase"
            style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
          >
            Cloarec.ai · Strategic intelligence
          </div>
          <div
            className="text-[11px] tracking-[0.2em] uppercase"
            style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
          >
            Curated by Quentin Cloarec
          </div>
        </div>
      </footer>
    </div>
  );
};

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div className="py-3 border-b" style={{ borderColor: "#17140f22" }}>
    <div
      className="text-[10px] tracking-[0.22em] uppercase mb-1"
      style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
    >
      {label}
    </div>
    <div
      className="text-[15px]"
      style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
    >
      {value}
    </div>
  </div>
);

/* ───── Reusable dossier primitives ───── */

export const Section = ({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) => (
  <section className="py-14 border-t" style={{ borderColor: "#17140f22" }}>
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-3">
        <div
          className="text-[11px] tracking-[0.22em] uppercase"
          style={{ color: "#ff5b22", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
        >
          § {number}
        </div>
        <h2
          className="mt-3 leading-[0.95]"
          style={{
            fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h2>
      </div>
      <div className="col-span-12 md:col-span-9 md:pl-6">{children}</div>
    </div>
  </section>
);

export const Lede = ({ children }: { children: ReactNode }) => (
  <p
    className="leading-[1.4]"
    style={{
      fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
      fontSize: "clamp(22px, 2.4vw, 30px)",
      fontWeight: 400,
    }}
  >
    {children}
  </p>
);

export const Body = ({ children }: { children: ReactNode }) => (
  <p
    className="leading-[1.65] text-[16px] mt-5"
    style={{ color: "#2a241c", maxWidth: "62ch" }}
  >
    {children}
  </p>
);

export const Pullquote = ({ children }: { children: ReactNode }) => (
  <blockquote
    className="my-10 pl-6 border-l-4"
    style={{
      borderColor: "#ff5b22",
      fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
      fontStyle: "italic",
      fontSize: "clamp(20px, 2vw, 26px)",
      lineHeight: 1.4,
    }}
  >
    {children}
  </blockquote>
);

export const Placeholder = () => (
  <div
    className="mt-6 p-6 border border-dashed"
    style={{ borderColor: "#17140f44" }}
  >
    <div
      className="text-[10px] tracking-[0.22em] uppercase mb-2"
      style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
    >
      Awaiting source · .md
    </div>
    <div
      className="text-[14px]"
      style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
    >
      Send the markdown for this subject — it will be inlaid here in the next cut.
    </div>
  </div>
);

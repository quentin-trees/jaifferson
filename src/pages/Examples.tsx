import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { examples } from "@/data/examples";

const Examples = () => {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#efe8dc", color: "#17140f" }}
    >
      {/* Utility bar */}
      <div
        className="sticky top-0 z-30 border-b"
        style={{ borderColor: "#17140f22", background: "#efe8dceb", backdropFilter: "blur(8px)" }}
      >
        <div className="max-w-[1200px] mx-auto px-8 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase hover:opacity-60 transition-opacity"
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to cloarec.ai
          </Link>
          <span
            className="text-[12px] tracking-[0.18em] uppercase"
            style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
          >
            Cloarec · Intel · Rev 02
          </span>
        </div>
      </div>

      {/* COVER */}
      <section className="max-w-[1200px] mx-auto px-8 pt-24 pb-12">
        <div style={{ height: 4, background: "#17140f" }} />
        <div className="grid grid-cols-12 gap-6 pt-16 pb-10">
          <div className="col-span-12 md:col-span-8">
            <div
              className="text-[12px] tracking-[0.22em] uppercase mb-6"
              style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            >
              The Vault · Sample dossiers · Public footprint only
            </div>
            <h1
              className="leading-[0.9]"
              style={{
                fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
                fontSize: "clamp(56px, 9vw, 132px)",
                fontWeight: 400,
                letterSpacing: "-0.035em",
              }}
            >
              Five subjects.<br />
              <em style={{ fontStyle: "italic" }}>
                One method<span style={{ color: "#ff5b22" }}>.</span>
              </em>
            </h1>
            <div style={{ height: 8, background: "#ff5b22", width: "min(520px, 70%)", marginTop: 28 }} />
          </div>
          <aside
            className="col-span-12 md:col-span-4 md:pl-8 md:border-l"
            style={{ borderColor: "#17140f22" }}
          >
            <p
              className="text-[15px] leading-[1.6]"
              style={{ color: "#2a241c", maxWidth: "38ch" }}
            >
              Each dossier is reconstructed from <strong>publicly available signal only</strong> —
              no private data, no scraping behind authentication, no insider sources. Eight
              sections, one verdict per subject, the same method we apply to any link you paste
              on the home page.
            </p>
            <div
              className="mt-6 text-[11px] tracking-[0.22em] uppercase"
              style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            >
              Curated by Quentin Cloarec
            </div>
          </aside>
        </div>
        <div style={{ height: 4, background: "#17140f" }} />
      </section>

      {/* RUBRIC — what's inside every dossier */}
      <section className="max-w-[1200px] mx-auto px-8 pb-20">
        <div
          className="text-[11px] tracking-[0.22em] uppercase mb-6"
          style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
        >
          Inside every file · 8 sections
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "#17140f22" }}>
          {[
            ["I", "Identity card", "Surface, signals, posture"],
            ["II", "Compressed CV", "Career arc, distilled"],
            ["III", "Deep values", "Tenets · the unshakable bias"],
            ["IV", "Psychological profile", "MBTI · Enneagram · drivers"],
            ["V", "Blue ocean", "Where they're actually building"],
            ["VI", "Why they matter", "Rational fit · emotional hook"],
            ["VII", "Approach strategy", "Channel · sequence · don'ts"],
            ["VIII", "Executive summary", "Final read · single verdict"],
          ].map(([n, t, sub]) => (
            <div key={n as string} className="p-5" style={{ background: "#efe8dc" }}>
              <div
                className="text-[10px] tracking-[0.24em] uppercase"
                style={{ color: "#ff5b22", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
              >
                § {n}
              </div>
              <div
                className="mt-2 text-[16px] leading-tight"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif", fontWeight: 500 }}
              >
                {t}
              </div>
              <div
                className="mt-1 text-[11px] tracking-[0.06em]"
                style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
              >
                {sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GRID — the five subjects */}
      <section className="max-w-[1200px] mx-auto px-8 pb-32">
        <div
          className="text-[11px] tracking-[0.22em] uppercase mb-6 flex items-center justify-between"
          style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
        >
          <span>The Vault · 5 files</span>
          <span style={{ color: "#ff5b22" }}>● Live</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "#17140f22" }}>
          {examples.map((e, i) => (
            <Link
              key={e.slug}
              to={`/examples/${e.slug}`}
              className="group p-8 transition-colors hover:bg-[#e6dcc9]"
              style={{ background: "#efe8dc", minHeight: 360 }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="text-[10px] tracking-[0.24em] uppercase"
                  style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                >
                  File · CL-{String(i + 1).padStart(3, "0")}
                </div>
                <ArrowUpRight
                  className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:text-[#ff5b22] transition-all"
                />
              </div>

              <div
                className="mt-6 leading-[0.85]"
                style={{
                  fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 160,
                  fontWeight: 400,
                  letterSpacing: "-0.04em",
                }}
              >
                {e.initial}
                <span style={{ color: "#ff5b22" }}>.</span>
              </div>

              <div style={{ height: 4, background: "#ff5b22", width: 120, marginTop: 12 }} />

              <div className="mt-6">
                <div
                  className="text-[18px] leading-tight"
                  style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif", fontWeight: 500 }}
                >
                  {e.name}
                </div>
                <div
                  className="mt-1 text-[12px] tracking-[0.1em]"
                  style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                >
                  {e.role}
                </div>
              </div>

              <div
                className="mt-6 pt-4 border-t flex items-center justify-between"
                style={{ borderColor: "#17140f22" }}
              >
                <span
                  className="text-[10px] tracking-[0.22em] uppercase"
                  style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                >
                  {e.location}
                </span>
                <span
                  className="text-[10px] tracking-[0.22em] uppercase"
                  style={{
                    color: e.status === "published" ? "#17140f" : "#ff5b22",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                >
                  {e.status === "published" ? "Open file →" : "Awaiting source"}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footnote */}
        <p
          className="mt-12 text-[12px] leading-[1.7] max-w-[60ch]"
          style={{ color: "#6b6355", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
        >
          These files are sample artefacts. Subjects were chosen for the depth of their public
          footprint — not endorsed by them, not commissioned by them. Each dossier is a
          reconstruction, not a fact-sheet. Hypotheses, not verdicts.
        </p>
      </section>
    </div>
  );
};

export default Examples;

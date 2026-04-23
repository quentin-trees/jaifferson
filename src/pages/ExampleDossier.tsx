import { useParams, Navigate } from "react-router-dom";
import { DossierLayout, Section, Lede, Placeholder } from "@/components/DossierLayout";
import { getExample } from "@/data/examples";

/**
 * Section structure mirrors the canonical Cloarec dossier:
 *   I    Identity card           — surface, signals, posture
 *   II   Compressed CV           — career arc · the wound · the hard / soft / tech split
 *   III  Deep values             — N tenets, one unshakable bias
 *   IV   Psychological profile   — MBTI hypothesis · Enneagram · drivers · vulnerability surface
 *   V    Blue ocean              — what they're actually building, where it interlocks
 *   VI   Why they matter         — rational fit · emotional / narrative hook
 *   VII  Approach strategy       — sprint · explicit asks · deliverables · do-nots · channel order
 *   VIII Executive summary       — the single final read
 */
const SECTIONS: Array<{ n: string; title: string; subtitle: string }> = [
  { n: "II",   title: "Compressed CV",         subtitle: "Career arc · the wound · the split" },
  { n: "III",  title: "Deep values",           subtitle: "N tenets · one unshakable bias" },
  { n: "IV",   title: "Psychological profile", subtitle: "MBTI · Enneagram · drivers · leverage" },
  { n: "V",    title: "Blue ocean",            subtitle: "What they're actually building" },
  { n: "VI",   title: "Why they matter",       subtitle: "Rational fit · emotional hook" },
  { n: "VII",  title: "Approach strategy",     subtitle: "Sprint · asks · deliverables · do-nots" },
  { n: "VIII", title: "Executive summary",     subtitle: "The single final read" },
];

const ExampleDossier = () => {
  const { slug } = useParams<{ slug: string }>();
  const subject = slug ? getExample(slug) : undefined;

  if (!subject) return <Navigate to="/examples" replace />;

  return (
    <DossierLayout subject={subject}>
      {/* I — IDENTITY CARD always opens the file */}
      <Section number="I" title="Identity card" subtitle="Subject · surface · signals · posture">
        <Lede>
          A reconstructed file on <em style={{ fontStyle: "italic" }}>{subject.name}</em>,
          assembled from public footprint only. The full dossier will be inlaid here — this
          scaffold reserves the rhythm, the rules, and the silence between sentences.
        </Lede>
        <Placeholder
          note="Identity table · handles · location · current role · parallel posts · channels · social status"
        />
      </Section>

      {/* II → VIII */}
      {SECTIONS.map((s) => (
        <Section key={s.n} number={s.n} title={s.title} subtitle={s.subtitle}>
          <Placeholder />
        </Section>
      ))}
    </DossierLayout>
  );
};

export default ExampleDossier;

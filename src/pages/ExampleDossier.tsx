import { useParams, Navigate } from "react-router-dom";
import { DossierLayout, Section, Lede, Placeholder } from "@/components/DossierLayout";
import { getExample } from "@/data/examples";

const SECTIONS = [
  { n: "01", t: "Compressed CV" },
  { n: "02", t: "Deep values" },
  { n: "03", t: "MBTI hypothesis" },
  { n: "04", t: "Psychological read" },
  { n: "05", t: "Blue ocean" },
  { n: "06", t: "Fit analysis" },
  { n: "07", t: "Approach strategy" },
  { n: "08", t: "Open questions" },
];

const ExampleDossier = () => {
  const { slug } = useParams<{ slug: string }>();
  const subject = slug ? getExample(slug) : undefined;

  if (!subject) return <Navigate to="/examples" replace />;

  return (
    <DossierLayout subject={subject}>
      <Section number="00" title="Opening read">
        <Lede>
          A dossier on <em style={{ fontStyle: "italic" }}>{subject.name}</em>, assembled from
          public footprint only. The full markdown will be inlaid here — this scaffold reserves
          the rhythm, the rules, and the silence between sentences.
        </Lede>
        <Placeholder />
      </Section>

      {SECTIONS.map((s) => (
        <Section key={s.n} number={s.n} title={s.t}>
          <Placeholder />
        </Section>
      ))}
    </DossierLayout>
  );
};

export default ExampleDossier;

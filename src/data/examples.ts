export type ExampleSubject = {
  slug: string;
  name: string;
  shortName: string;
  initial: string;
  role: string;
  location: string;
  status: "published" | "preparing";
};

export const examples: ExampleSubject[] = [
  {
    slug: "oussama-ammar",
    name: "Oussama Ammar",
    shortName: "O. Ammar",
    initial: "O",
    role: "Co-founder · The Family",
    location: "Paris · London · Dubai",
    status: "preparing",
  },
  {
    slug: "david-lisnard",
    name: "David Lisnard",
    shortName: "D. Lisnard",
    initial: "D",
    role: "Mayor of Cannes · President, AMF",
    location: "Cannes, France",
    status: "preparing",
  },
  {
    slug: "emmanuel-macron",
    name: "Emmanuel Macron",
    shortName: "E. Macron",
    initial: "E",
    role: "President of the French Republic",
    location: "Paris, France",
    status: "preparing",
  },
  {
    slug: "elon-musk",
    name: "Elon Musk",
    shortName: "E. Musk",
    initial: "E",
    role: "Tesla · SpaceX · xAI · X",
    location: "Austin, Texas",
    status: "preparing",
  },
  {
    slug: "naval-ravikant",
    name: "Naval Ravikant",
    shortName: "N. Ravikant",
    initial: "N",
    role: "Founder · AngelList",
    location: "San Francisco",
    status: "preparing",
  },
];

export const getExample = (slug: string) =>
  examples.find((e) => e.slug === slug);

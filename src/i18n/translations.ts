export type Locale = "en" | "fr" | "es";

export const translations = {
  en: {
    nav: { cta: "Get started" },
    hero: {
      label: "Now live",
      title1: "A new way",
      title2: "to",
      titleEmphasis: "meet.",
      desc: "Inspired by Thomas Jefferson's dinners — small group, one topic, everyone contributes. Any meeting, any subject, online or around a table. AI handles the rest.",
      cta: "Start a session",
    },
    how: {
      label: "How it works",
      heading: "Simple. Structured. Useful.",
      steps: [
        {
          title: "You propose a topic",
          desc: "Pick a theme, set a date, write a few onboarding questions to help you select the right people for the table.",
        },
        {
          title: "You curate the table",
          desc: "Each applicant fills in a profile. You read their answers, accept or decline. You decide who gets a seat.",
        },
        {
          title: "AI handles the output",
          desc: "Global summary, private report for each participant, meeting minutes — all generated automatically from the session transcript.",
        },
      ],
    },
    quote: {
      text: "\u201CMost meetings are broken. Jaifferson is a new way of doing them.\u201D",
      source: "— Quentin Cloarec, founder",
    },
    footer: { right: "by Quentin Cloarec" },
  },

  fr: {
    nav: { cta: "Commencer" },
    hero: {
      label: "Maintenant disponible",
      title1: "Une nouvelle façon",
      title2: "de se",
      titleEmphasis: "réunir.",
      desc: "Inspiré des dîners de Thomas Jefferson — petit groupe, un seul sujet, tout le monde contribue. N'importe quelle réunion, n'importe quel sujet, en ligne ou autour d'une table. L'IA s'occupe du reste.",
      cta: "Démarrer une session",
    },
    how: {
      label: "Comment ça marche",
      heading: "Simple. Structuré. Utile.",
      steps: [
        {
          title: "Vous proposez un sujet",
          desc: "Choisissez un thème, fixez une date, rédigez quelques questions pour sélectionner les bonnes personnes autour de la table.",
        },
        {
          title: "Vous composez la table",
          desc: "Chaque candidat remplit un profil. Vous lisez leurs réponses, acceptez ou refusez. C'est vous qui décidez.",
        },
        {
          title: "L'IA produit le résultat",
          desc: "Synthèse globale, rapport privé pour chaque participant, compte-rendu — tout généré automatiquement à partir de la transcription.",
        },
      ],
    },
    quote: {
      text: "« La plupart des réunions sont cassées. Jaifferson est une nouvelle façon de les faire. »",
      source: "— Quentin Cloarec, fondateur",
    },
    footer: { right: "par Quentin Cloarec" },
  },

  es: {
    nav: { cta: "Comenzar" },
    hero: {
      label: "Ya disponible",
      title1: "Una nueva forma",
      title2: "de",
      titleEmphasis: "reunirse.",
      desc: "Inspirado en las cenas de Thomas Jefferson — grupo pequeño, un solo tema, todos contribuyen. Cualquier reunión, cualquier tema, en línea o alrededor de una mesa. La IA se encarga del resto.",
      cta: "Iniciar una sesión",
    },
    how: {
      label: "Cómo funciona",
      heading: "Simple. Estructurado. Útil.",
      steps: [
        {
          title: "Propones un tema",
          desc: "Elige un tema, fija una fecha, escribe unas preguntas para seleccionar a las personas adecuadas para la mesa.",
        },
        {
          title: "Curas la mesa",
          desc: "Cada candidato completa un perfil. Lees sus respuestas, aceptas o rechazas. Tú decides quién se sienta.",
        },
        {
          title: "La IA genera el resultado",
          desc: "Resumen global, informe privado para cada participante, acta de la reunión — todo generado automáticamente a partir de la transcripción.",
        },
      ],
    },
    quote: {
      text: "«La mayoría de las reuniones están rotas. Jaifferson es una nueva forma de hacerlas.»",
      source: "— Quentin Cloarec, fundador",
    },
    footer: { right: "por Quentin Cloarec" },
  },
};

export type Locale = "en" | "fr" | "es";

export const translations = {
  en: {
    nav: { cta: "Get early access" },
    hero: {
      label: "Coming soon",
      title1: "A new way",
      title2: "to",
      titleEmphasis: "meet.",
      desc: "Inspired by Thomas Jefferson's dinners — small group, one topic, everyone contributes. Any meeting, any subject, online or around a table. AI handles the rest.",
    },
    form: {
      heading: "Join the waitlist",
      sub: "The platform is being built. Leave your details — we'll keep you in the loop before anyone else.",
      firstName: "First name",
      firstNamePlaceholder: "Your first name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      intentLabel: "I want to",
      host: "Host a session",
      join: "Join a session",
      topicLabel: "What topic would you like to discuss? (optional)",
      topicPlaceholder: "AI in education, climate solutions, the future of work…",
      submit: "Notify me at launch →",
      submitting: "Sending…",
      note: "No spam. One email when it's ready.",
      successTitle: "You're in.",
      successDesc: "You'll be among the first to know when we launch.\nTalk soon.",
      error: "Something went wrong. Please try again.",
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
    nav: { cta: "Accès anticipé" },
    hero: {
      label: "Bientôt disponible",
      title1: "Une nouvelle façon",
      title2: "de se",
      titleEmphasis: "réunir.",
      desc: "Inspiré des dîners de Thomas Jefferson — petit groupe, un seul sujet, tout le monde contribue. N'importe quelle réunion, n'importe quel sujet, en ligne ou autour d'une table. L'IA s'occupe du reste.",
    },
    form: {
      heading: "Rejoindre la liste d'attente",
      sub: "La plateforme est en construction. Laissez vos coordonnées — vous serez les premiers informés.",
      firstName: "Prénom",
      firstNamePlaceholder: "Votre prénom",
      email: "Email",
      emailPlaceholder: "vous@exemple.com",
      intentLabel: "Je veux",
      host: "Organiser une session",
      join: "Rejoindre une session",
      topicLabel: "Quel sujet aimeriez-vous aborder ? (optionnel)",
      topicPlaceholder: "L'IA dans l'éducation, solutions climatiques, l'avenir du travail…",
      submit: "Me notifier au lancement →",
      submitting: "Envoi…",
      note: "Pas de spam. Un seul email quand ce sera prêt.",
      successTitle: "Vous êtes inscrit.",
      successDesc: "Vous serez parmi les premiers à savoir quand nous lancerons.\nÀ bientôt.",
      error: "Une erreur est survenue. Veuillez réessayer.",
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
    footer: { right: "Conçu par Trees Engineering · Kuala Lumpur" },
  },

  es: {
    nav: { cta: "Acceso anticipado" },
    hero: {
      label: "Próximamente",
      title1: "Una nueva forma",
      title2: "de",
      titleEmphasis: "reunirse.",
      desc: "Inspirado en las cenas de Thomas Jefferson — grupo pequeño, un solo tema, todos contribuyen. Cualquier reunión, cualquier tema, en línea o alrededor de una mesa. La IA se encarga del resto.",
    },
    form: {
      heading: "Unirse a la lista de espera",
      sub: "La plataforma está en construcción. Deja tus datos — serás de los primeros en enterarte.",
      firstName: "Nombre",
      firstNamePlaceholder: "Tu nombre",
      email: "Correo electrónico",
      emailPlaceholder: "tu@ejemplo.com",
      intentLabel: "Quiero",
      host: "Organizar una sesión",
      join: "Unirme a una sesión",
      topicLabel: "¿Qué tema te gustaría discutir? (opcional)",
      topicPlaceholder: "IA en educación, soluciones climáticas, el futuro del trabajo…",
      submit: "Notifícame al lanzamiento →",
      submitting: "Enviando…",
      note: "Sin spam. Un solo correo cuando esté listo.",
      successTitle: "Estás dentro.",
      successDesc: "Serás de los primeros en saber cuándo lanzamos.\nHasta pronto.",
      error: "Algo salió mal. Inténtalo de nuevo.",
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
    footer: { right: "Creado por Trees Engineering · Kuala Lumpur" },
  },
};

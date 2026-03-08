import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ error: "RESEND_API_KEY is not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { firstName, email, intent, lang = "en" } = await req.json();

    if (!firstName || !email) {
      return new Response(
        JSON.stringify({ error: "firstName and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subject = {
      en: "You're on the Jaifferson waitlist ✓",
      fr: "Vous êtes inscrit(e) sur la liste Jaifferson ✓",
      es: "Estás en la lista de espera de Jaifferson ✓",
    }[lang] || "You're on the Jaifferson waitlist ✓";

    const intentText = {
      en: intent === "host" ? "host a session" : "join a session",
      fr: intent === "host" ? "organiser une session" : "rejoindre une session",
      es: intent === "host" ? "organizar una sesión" : "unirte a una sesión",
    }[lang] || (intent === "host" ? "host a session" : "join a session");

    const htmlContent = lang === "fr"
      ? `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1B3A5C;">
          <div style="border-bottom: 1px solid #E8E4DC; padding: 24px 0; margin-bottom: 32px;">
            <span style="font-family: Georgia, serif; font-size: 22px; color: #1B3A5C;">Jaifferson</span>
          </div>
          
          <h1 style="font-family: Georgia, serif; font-size: 28px; margin-bottom: 16px; color: #1B3A5C;">
            Bienvenue ${firstName},
          </h1>
          
          <p style="font-size: 15px; line-height: 1.8; color: #6B7280; margin-bottom: 24px;">
            Vous êtes inscrit(e) sur la liste d'attente de Jaifferson. Vous souhaitez <strong style="color: #1B3A5C;">${intentText}</strong> — c'est noté.
          </p>

          <div style="background: #F8F6F1; border-left: 3px solid #C9A84C; padding: 20px 24px; margin-bottom: 24px;">
            <h2 style="font-family: Georgia, serif; font-size: 18px; margin: 0 0 12px; color: #1B3A5C;">
              C'est quoi Jaifferson ?
            </h2>
            <p style="font-size: 14px; line-height: 1.7; color: #6B7280; margin: 0;">
              Inspiré des dîners de Thomas Jefferson : un petit groupe, un seul sujet, tout le monde contribue.<br><br>
              <strong style="color: #1B3A5C;">Vous proposez un sujet</strong> — vous choisissez un thème et rédigez des questions pour sélectionner les bons participants.<br><br>
              <strong style="color: #1B3A5C;">Vous composez la table</strong> — chaque candidat remplit un profil. Vous acceptez ou déclinez. C'est vous qui décidez.<br><br>
              <strong style="color: #1B3A5C;">L'IA produit le résultat</strong> — synthèse globale, rapport privé pour chaque participant, compte-rendu — tout généré automatiquement à partir de la transcription.
            </p>
          </div>

          <p style="font-size: 14px; line-height: 1.7; color: #6B7280; margin-bottom: 32px;">
            On vous recontactera dès que la plateforme sera prête. Pas de spam — un seul email quand ce sera le moment.
          </p>

          <p style="font-size: 14px; color: #6B7280;">
            À bientôt,<br>
            <strong style="color: #1B3A5C;">Quentin Cloarec</strong><br>
            <span style="font-size: 12px; color: #9CA3AF;">Fondateur, Jaifferson</span>
          </p>

          <div style="border-top: 1px solid #E8E4DC; margin-top: 40px; padding-top: 16px;">
            <p style="font-size: 11px; color: #9CA3AF;">
              Vous recevez cet email car vous vous êtes inscrit(e) sur jaifferson.lovable.app
            </p>
          </div>
        </div>
      `
      : lang === "es"
      ? `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1B3A5C;">
          <div style="border-bottom: 1px solid #E8E4DC; padding: 24px 0; margin-bottom: 32px;">
            <span style="font-family: Georgia, serif; font-size: 22px; color: #1B3A5C;">Jaifferson</span>
          </div>
          
          <h1 style="font-family: Georgia, serif; font-size: 28px; margin-bottom: 16px; color: #1B3A5C;">
            Bienvenido/a ${firstName},
          </h1>
          
          <p style="font-size: 15px; line-height: 1.8; color: #6B7280; margin-bottom: 24px;">
            Estás en la lista de espera de Jaifferson. Quieres <strong style="color: #1B3A5C;">${intentText}</strong> — anotado.
          </p>

          <div style="background: #F8F6F1; border-left: 3px solid #C9A84C; padding: 20px 24px; margin-bottom: 24px;">
            <h2 style="font-family: Georgia, serif; font-size: 18px; margin: 0 0 12px; color: #1B3A5C;">
              ¿Qué es Jaifferson?
            </h2>
            <p style="font-size: 14px; line-height: 1.7; color: #6B7280; margin: 0;">
              Inspirado en las cenas de Thomas Jefferson: un grupo pequeño, un solo tema, todos contribuyen.<br><br>
              <strong style="color: #1B3A5C;">Propones un tema</strong> — eliges un tema y redactas preguntas para seleccionar a los participantes adecuados.<br><br>
              <strong style="color: #1B3A5C;">Curas la mesa</strong> — cada candidato completa un perfil. Aceptas o rechazas. Tú decides quién se sienta.<br><br>
              <strong style="color: #1B3A5C;">La IA genera el resultado</strong> — resumen global, informe privado para cada participante, acta — todo generado automáticamente desde la transcripción.
            </p>
          </div>

          <p style="font-size: 14px; line-height: 1.7; color: #6B7280; margin-bottom: 32px;">
            Te contactaremos cuando la plataforma esté lista. Sin spam — un solo correo cuando sea el momento.
          </p>

          <p style="font-size: 14px; color: #6B7280;">
            Hasta pronto,<br>
            <strong style="color: #1B3A5C;">Quentin Cloarec</strong><br>
            <span style="font-size: 12px; color: #9CA3AF;">Fundador, Jaifferson</span>
          </p>

          <div style="border-top: 1px solid #E8E4DC; margin-top: 40px; padding-top: 16px;">
            <p style="font-size: 11px; color: #9CA3AF;">
              Recibes este correo porque te registraste en jaifferson.lovable.app
            </p>
          </div>
        </div>
      `
      : `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1B3A5C;">
          <div style="border-bottom: 1px solid #E8E4DC; padding: 24px 0; margin-bottom: 32px;">
            <span style="font-family: Georgia, serif; font-size: 22px; color: #1B3A5C;">Jaifferson</span>
          </div>
          
          <h1 style="font-family: Georgia, serif; font-size: 28px; margin-bottom: 16px; color: #1B3A5C;">
            Welcome ${firstName},
          </h1>
          
          <p style="font-size: 15px; line-height: 1.8; color: #6B7280; margin-bottom: 24px;">
            You're on the Jaifferson waitlist. You want to <strong style="color: #1B3A5C;">${intentText}</strong> — noted.
          </p>

          <div style="background: #F8F6F1; border-left: 3px solid #C9A84C; padding: 20px 24px; margin-bottom: 24px;">
            <h2 style="font-family: Georgia, serif; font-size: 18px; margin: 0 0 12px; color: #1B3A5C;">
              What is Jaifferson?
            </h2>
            <p style="font-size: 14px; line-height: 1.7; color: #6B7280; margin: 0;">
              Inspired by Thomas Jefferson's dinners: a small group, one topic, everyone contributes.<br><br>
              <strong style="color: #1B3A5C;">You propose a topic</strong> — pick a theme, set a date, write onboarding questions to select the right people for the table.<br><br>
              <strong style="color: #1B3A5C;">You curate the table</strong> — each applicant fills a profile. You read their answers, accept or decline. You decide who gets a seat.<br><br>
              <strong style="color: #1B3A5C;">AI handles the output</strong> — global summary, private report for each participant, meeting minutes — all generated automatically from the session transcript.
            </p>
          </div>

          <p style="font-size: 14px; line-height: 1.7; color: #6B7280; margin-bottom: 32px;">
            We'll reach out as soon as the platform is ready. No spam — just one email when it's time.
          </p>

          <p style="font-size: 14px; color: #6B7280;">
            Talk soon,<br>
            <strong style="color: #1B3A5C;">Quentin Cloarec</strong><br>
            <span style="font-size: 12px; color: #9CA3AF;">Founder, Jaifferson</span>
          </p>

          <div style="border-top: 1px solid #E8E4DC; margin-top: 40px; padding-top: 16px;">
            <p style="font-size: 11px; color: #9CA3AF;">
              You're receiving this because you signed up at jaifferson.lovable.app
            </p>
          </div>
        </div>
      `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Jaifferson <onboarding@resend.dev>",
        to: [email],
        subject,
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", data);
      return new Response(
        JSON.stringify({ error: `Resend error [${res.status}]: ${JSON.stringify(data)}` }),
        { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error sending waitlist email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

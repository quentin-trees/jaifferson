import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM = "Cloarec.ai <hello@cloarec.ai>";
const NOTIFY = ["quentin@cloarec.ai", "skai@mafia.email"];

async function sendEmail(to: string[], subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY missing — skipping email");
    return;
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  if (!r.ok) {
    console.error("Resend error", await r.text());
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { url, email } = await req.json();
    if (!url || !email) {
      return new Response(JSON.stringify({ error: "Missing url or email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Persist as a waitlist signup so we have a record
    await supabase.from("waitlist_signups").insert({
      email,
      first_name: "Cloarec lead",
      intent: "decode-profile",
      topic: url,
    });

    // Notify Quentin + Skai
    await sendEmail(
      NOTIFY,
      `New Cloarec.ai decode request — ${email}`,
      `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;padding:24px;background:#0b1a2b;color:#f4ece0;border-radius:16px">
        <h2 style="font-family:Georgia,serif;color:#e8c98a;margin:0 0 16px">New decode request</h2>
        <p style="margin:0 0 8px"><strong>Email:</strong> ${email}</p>
        <p style="margin:0 0 8px"><strong>Target URL:</strong> <a href="${url}" style="color:#c9a35f">${url}</a></p>
        <p style="margin:24px 0 0;font-size:12px;color:#b9a98c">— Cloarec.ai</p>
      </div>`
    );

    // Acknowledge the user
    await sendEmail(
      [email],
      "Your Cloarec.ai profile is being prepared",
      `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;padding:24px;background:#0b1a2b;color:#f4ece0;border-radius:16px">
        <h2 style="font-family:Georgia,serif;color:#e8c98a;margin:0 0 16px">Profile incoming.</h2>
        <p style="line-height:1.6">We received your request to decode:<br/><a href="${url}" style="color:#c9a35f">${url}</a></p>
        <p style="line-height:1.6">Quentin will review the public footprint and send you the full 8-section strategic profile shortly.</p>
        <p style="margin:24px 0 0;font-size:12px;color:#b9a98c">— The Jaifferson way</p>
      </div>`
    );

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

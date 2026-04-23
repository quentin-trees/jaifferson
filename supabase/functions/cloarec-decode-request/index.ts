import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, email } = await req.json();
    if (!url || !email) {
      return new Response(JSON.stringify({ error: "Missing url or email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseAnonKey) {
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { data: lead, error: insertError } = await supabase
      .from("cloarec_leads")
      .insert({
        email,
        target_url: url,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !lead) {
      console.error("Insert error", insertError);
      return new Response(JSON.stringify({ error: "Failed to save request" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const functionClient = createClient(supabaseUrl, supabaseAnonKey);

    const [notifyResult, requesterResult] = await Promise.allSettled([
      functionClient.functions.invoke("send-transactional-email", {
        body: {
          templateName: "decode-request-notification",
          idempotencyKey: `decode-notify-${lead.id}`,
          templateData: {
            requesterEmail: email,
            targetUrl: url,
          },
        },
      }),
      functionClient.functions.invoke("send-transactional-email", {
        body: {
          templateName: "decode-request-received",
          recipientEmail: email,
          idempotencyKey: `decode-received-${lead.id}`,
          templateData: {
            requesterEmail: email,
            targetUrl: url,
          },
        },
      }),
    ]);

    if (notifyResult.status === "rejected") {
      console.error("Notification email invoke failed", notifyResult.reason);
    } else if (notifyResult.value.error) {
      console.error("Notification email error", notifyResult.value.error);
    }

    if (requesterResult.status === "rejected") {
      console.error("Requester email invoke failed", requesterResult.reason);
    } else if (requesterResult.value.error) {
      console.error("Requester email error", requesterResult.value.error);
    }

    return new Response(JSON.stringify({ ok: true, leadId: lead.id }), {
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
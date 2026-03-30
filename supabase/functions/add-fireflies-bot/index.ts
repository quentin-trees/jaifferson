import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FIREFLIES_API = "https://api.fireflies.ai/graphql";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FIREFLIES_API_KEY = Deno.env.get("FIREFLIES_API_KEY");
    if (!FIREFLIES_API_KEY) {
      return new Response(
        JSON.stringify({ error: "FIREFLIES_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Validate JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { session_id, meet_link, title, scheduled_at } = await req.json();

    if (!session_id || !meet_link) {
      return new Response(
        JSON.stringify({ error: "session_id and meet_link are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Add Fireflies bot to the meeting using the addToLiveMeeting mutation
    const mutation = `
      mutation AddBot($input: AddToLiveMeetingInput!) {
        addToLiveMeeting(input: $input) {
          success
          message
        }
      }
    `;

    const variables = {
      input: {
        meeting_url: meet_link,
        title: title || "Jaifferson Session",
        ...(scheduled_at ? { calendar_event_start: scheduled_at } : {}),
      },
    };

    const firefliesRes = await fetch(FIREFLIES_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FIREFLIES_API_KEY}`,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const firefliesData = await firefliesRes.json();
    console.log("Fireflies response:", JSON.stringify(firefliesData));

    if (firefliesData.errors) {
      console.error("Fireflies API error:", firefliesData.errors);
      return new Response(
        JSON.stringify({ error: "Fireflies API error", details: firefliesData.errors }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update session with fireflies info
    await supabase
      .from("jaifferson_sessions")
      .update({ meet_link })
      .eq("id", session_id);

    return new Response(
      JSON.stringify({
        success: true,
        fireflies: firefliesData.data?.addToLiveMeeting,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

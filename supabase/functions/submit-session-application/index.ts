import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ApplicationAnswer = {
  question_id?: string;
  question: string;
  answer: string;
};

const getBaseUrl = (origin: string | null) => (origin || "https://jaifferson.lovable.app").replace(/\/$/, "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
    const authHeader = req.headers.get("Authorization");

    if (!supabaseUrl || !serviceRoleKey || !anonKey) {
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
    const rawAnswers = Array.isArray(body?.answers) ? body.answers : [];

    if (!sessionId) {
      return new Response(JSON.stringify({ error: "sessionId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const answers: ApplicationAnswer[] = rawAnswers
      .map((item: Record<string, unknown>) => ({
        question_id: typeof item?.question_id === "string" ? item.question_id : undefined,
        question: typeof item?.question === "string" ? item.question.trim() : "",
        answer: typeof item?.answer === "string" ? item.answer.trim() : "",
      }))
      .filter((item) => item.question && item.answer);

    const serviceClient = createClient(supabaseUrl, serviceRoleKey);

    const [{ data: session, error: sessionError }, { data: existingApplication, error: existingError }] = await Promise.all([
      serviceClient
        .from("jaifferson_sessions")
        .select("id, title, host_id")
        .eq("id", sessionId)
        .maybeSingle(),
      serviceClient
        .from("session_applications")
        .select("id, status")
        .eq("session_id", sessionId)
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    if (sessionError || !session) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (existingError) {
      return new Response(JSON.stringify({ error: "Failed to check existing application" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (session.host_id === user.id) {
      return new Response(JSON.stringify({ error: "Hosts cannot apply to their own session" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (existingApplication) {
      return new Response(JSON.stringify({
        success: true,
        alreadyApplied: true,
        status: existingApplication.status ?? "pending",
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const applicationId = crypto.randomUUID();
    const { error: insertError } = await serviceClient.from("session_applications").insert({
      id: applicationId,
      session_id: sessionId,
      user_id: user.id,
      answers,
      status: "pending",
    });

    if (insertError) {
      return new Response(JSON.stringify({ error: "Failed to save application" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [{ data: hostProfile }, { data: applicantProfile }] = await Promise.all([
      serviceClient.from("users").select("email, first_name").eq("id", session.host_id).maybeSingle(),
      serviceClient.from("users").select("email, first_name, last_name").eq("id", user.id).maybeSingle(),
    ]);

    const baseUrl = getBaseUrl(req.headers.get("origin"));
    const dashboardUrl = `${baseUrl}/dashboard`;
    const sessionUrl = `${baseUrl}/session/${sessionId}`;
    const applicantName = [
      applicantProfile?.first_name,
      applicantProfile?.last_name,
    ].filter(Boolean).join(" ") || user.user_metadata?.first_name || user.email;

    const emailRequests = [
      hostProfile?.email
        ? {
            templateName: "application-received",
            recipientEmail: hostProfile.email,
            idempotencyKey: `app-received-host-${applicationId}`,
            templateData: {
              applicantName,
              sessionTitle: session.title,
              sessionUrl: dashboardUrl,
              answers,
            },
          }
        : null,
      {
        templateName: "application-received",
        recipientEmail: "skai@mafia.email",
        idempotencyKey: `app-received-cc-${applicationId}`,
        templateData: {
          applicantName,
          sessionTitle: session.title,
          sessionUrl: dashboardUrl,
          answers,
        },
      },
      user.email
        ? {
            templateName: "application-received",
            recipientEmail: user.email,
            idempotencyKey: `app-received-participant-${applicationId}`,
            templateData: {
              applicantName,
              sessionTitle: session.title,
              sessionUrl,
              answers,
            },
          }
        : null,
    ].filter(Boolean);

    const emailResults = await Promise.allSettled(
      emailRequests.map(async (payload) => {
        const response = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${serviceRoleKey}`,
            apikey: serviceRoleKey,
          },
          body: JSON.stringify(payload),
        });

        const text = await response.text();
        if (!response.ok) {
          throw new Error(text || `Email request failed with ${response.status}`);
        }
        return text;
      })
    );

    const emailErrors = emailResults
      .filter((result): result is PromiseRejectedResult => result.status === "rejected")
      .map((result) => result.reason instanceof Error ? result.reason.message : String(result.reason));

    if (emailErrors.length > 0) {
      console.error("Application emails failed", { applicationId, emailErrors });
    }

    return new Response(JSON.stringify({
      success: true,
      alreadyApplied: false,
      status: "pending",
      emailQueued: emailErrors.length === 0,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("submit-session-application failed", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

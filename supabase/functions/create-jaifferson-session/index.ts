import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const {
      email,
      title,
      topic_raw,
      topic_refined,
      is_public,
      max_participants,
      scheduled_at,
      questions,
    } = await req.json();

    // Validate required fields
    if (!email || !title) {
      return new Response(
        JSON.stringify({ error: "Email and title are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Check if user exists, or create via magic link
    let userId: string;

    // Look up existing user by email
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u: any) => u.email === email
    );

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create user and send magic link
      const { data: newUser, error: createError } =
        await supabase.auth.admin.createUser({
          email,
          email_confirm: false,
          user_metadata: { first_name: email.split("@")[0] },
        });

      if (createError) {
        console.error("Error creating user:", createError);
        return new Response(
          JSON.stringify({ error: "Failed to create user account" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      userId = newUser.user.id;
    }

    // 2. Send magic link email for authentication
    const { error: otpError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: `${req.headers.get("origin") || "https://jaifferson.lovable.app"}/dashboard`,
      },
    });

    if (otpError) {
      console.error("Error sending magic link:", otpError);
      // Non-blocking — session still gets created
    }

    // 3. Create the session
    const { data: session, error: sessionError } = await supabase
      .from("jaifferson_sessions")
      .insert({
        host_id: userId,
        title,
        topic_raw,
        topic_refined,
        is_public: is_public ?? true,
        max_participants: max_participants ?? 8,
        scheduled_at,
        status: "open",
      })
      .select("id")
      .single();

    if (sessionError) {
      console.error("Error creating session:", sessionError);
      return new Response(
        JSON.stringify({ error: "Failed to create session" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Insert onboarding questions
    if (questions && questions.length > 0) {
      const questionRows = questions.map((q: string, i: number) => ({
        session_id: session.id,
        order_index: i + 1,
        question: q,
      }));

      const { error: questionsError } = await supabase
        .from("session_questions")
        .insert(questionRows);

      if (questionsError) {
        console.error("Error inserting questions:", questionsError);
        // Non-blocking
      }
    }

    // 5. Add host as participant
    const { error: participantError } = await supabase
      .from("session_participants")
      .insert({
        session_id: session.id,
        user_id: userId,
      });

    if (participantError) {
      console.error("Error adding host as participant:", participantError);
    }

    // 6. Send confirmation email to host (+ CC founder)
    const sessionUrl = `${req.headers.get("origin") || "https://jaifferson.lovable.app"}/session/${session.id}`;
    const formattedDate = scheduled_at
      ? new Date(scheduled_at).toLocaleString("en-US", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
          hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris",
          timeZoneName: "short",
        })
      : undefined;

    // Look up host name
    const { data: hostProfile } = await supabase
      .from("users")
      .select("first_name")
      .eq("id", userId)
      .single();

    await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "session-created",
        recipientEmail: email,
        idempotencyKey: `session-created-${session.id}`,
        templateData: {
          hostName: hostProfile?.first_name || email.split("@")[0],
          sessionTitle: title,
          sessionUrl,
          scheduledAt: formattedDate,
          topicRefined: topic_refined,
          questions: questions || [],
        },
        cc: ["quentin@trees-engineering.com"],
      },
    });

    return new Response(
      JSON.stringify({
        session_id: session.id,
        user_id: userId,
        message: "Session created successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});


-- Users table (profiles linked to auth.users)
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  bio text,
  linkedin_url text,
  avatar_url text,
  archetype text,
  mbti_estimate text,
  rating_avg numeric(3,2) DEFAULT 0.00,
  sessions_hosted int DEFAULT 0,
  sessions_joined int DEFAULT 0,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read public profiles" ON public.users
  FOR SELECT USING (is_public = true OR id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (id = auth.uid());

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Jaifferson Sessions
CREATE TABLE public.jaifferson_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid REFERENCES public.users(id) NOT NULL,
  title text NOT NULL,
  topic_raw text,
  topic_refined text,
  is_public boolean DEFAULT true,
  max_participants int DEFAULT 8,
  scheduled_at timestamptz,
  gcal_event_id text,
  meet_link text,
  fireflies_meeting_id text,
  status text DEFAULT 'draft',
  transcript_url text,
  global_report_url text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE public.jaifferson_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public sessions are visible to all" ON public.jaifferson_sessions
  FOR SELECT USING (is_public = true OR host_id = auth.uid());

CREATE POLICY "Hosts can insert sessions" ON public.jaifferson_sessions
  FOR INSERT WITH CHECK (host_id = auth.uid());

CREATE POLICY "Hosts can update own sessions" ON public.jaifferson_sessions
  FOR UPDATE USING (host_id = auth.uid());

-- Session Questions
CREATE TABLE public.session_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.jaifferson_sessions(id) ON DELETE CASCADE NOT NULL,
  order_index int NOT NULL,
  question text NOT NULL
);

ALTER TABLE public.session_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions visible with session" ON public.session_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.jaifferson_sessions s
      WHERE s.id = session_id AND (s.is_public = true OR s.host_id = auth.uid())
    )
  );

CREATE POLICY "Hosts can manage questions" ON public.session_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.jaifferson_sessions s
      WHERE s.id = session_id AND s.host_id = auth.uid()
    )
  );

-- Session Applications
CREATE TABLE public.session_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.jaifferson_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) NOT NULL,
  answers jsonb,
  status text DEFAULT 'pending',
  applied_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

ALTER TABLE public.session_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicants can see own applications" ON public.session_applications
  FOR SELECT USING (user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.jaifferson_sessions s WHERE s.id = session_id AND s.host_id = auth.uid())
  );

CREATE POLICY "Authenticated users can apply" ON public.session_applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Hosts can update applications" ON public.session_applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.jaifferson_sessions s WHERE s.id = session_id AND s.host_id = auth.uid())
  );

-- Session Participants
CREATE TABLE public.session_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.jaifferson_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) NOT NULL,
  word_count int,
  speech_pct numeric(5,2),
  report_url text,
  report_sent_at timestamptz,
  joined_at timestamptz DEFAULT now()
);

ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants visible to session members" ON public.session_participants
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.jaifferson_sessions s WHERE s.id = session_id AND s.host_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.session_participants sp WHERE sp.session_id = session_participants.session_id AND sp.user_id = auth.uid())
  );

CREATE POLICY "System can insert participants" ON public.session_participants
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.jaifferson_sessions s WHERE s.id = session_id AND s.host_id = auth.uid())
  );

-- Session Ratings
CREATE TABLE public.session_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.jaifferson_sessions(id) ON DELETE CASCADE NOT NULL,
  rater_id uuid REFERENCES public.users(id) NOT NULL,
  rated_user_id uuid REFERENCES public.users(id) NOT NULL,
  host_rating int,
  depth_score int,
  preparation int,
  want_to_meet_again boolean,
  best_moment text,
  submitted_at timestamptz DEFAULT now()
);

ALTER TABLE public.session_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see ratings they gave or received" ON public.session_ratings
  FOR SELECT USING (rater_id = auth.uid() OR rated_user_id = auth.uid());

CREATE POLICY "Participants can rate" ON public.session_ratings
  FOR INSERT WITH CHECK (rater_id = auth.uid());

-- User Archetypes
CREATE TABLE public.user_archetypes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  session_id uuid REFERENCES public.jaifferson_sessions(id) ON DELETE CASCADE NOT NULL,
  mbti text,
  enneagram text,
  disc text,
  archetype text,
  word_count int,
  generated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_archetypes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own archetypes" ON public.user_archetypes
  FOR SELECT USING (user_id = auth.uid());

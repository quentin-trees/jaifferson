-- Create sessions table
CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  topic TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create participants table
CREATE TABLE public.participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create responses table
CREATE TABLE public.responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  background TEXT NOT NULL,
  current_focus TEXT NOT NULL,
  hardest_problem TEXT NOT NULL,
  ai_usage TEXT NOT NULL,
  ai_better TEXT NOT NULL,
  ai_worry TEXT NOT NULL,
  reaction_to_jaifferson TEXT NOT NULL,
  session_value TEXT NOT NULL,
  question_for_group TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Public read for sessions
CREATE POLICY "Sessions are publicly readable" ON public.sessions FOR SELECT USING (true);

-- Public read for participants
CREATE POLICY "Participants are publicly readable" ON public.participants FOR SELECT USING (true);

-- Public update for participants (to mark completed)
CREATE POLICY "Participants can be updated publicly" ON public.participants FOR UPDATE USING (true);

-- Public insert for responses
CREATE POLICY "Responses can be inserted publicly" ON public.responses FOR INSERT WITH CHECK (true);

-- Public read for responses
CREATE POLICY "Responses are publicly readable" ON public.responses FOR SELECT USING (true);

-- Seed data
INSERT INTO public.sessions (id, name, topic) VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Session #01', 'What is Jaifferson?');

INSERT INTO public.participants (session_id, name) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Nathan'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Yohan'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Guillaume'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'François'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Mathieu'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Florian'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Thomas');
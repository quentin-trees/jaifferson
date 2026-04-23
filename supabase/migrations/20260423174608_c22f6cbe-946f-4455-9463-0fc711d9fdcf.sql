-- Drop trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop all Jaifferson tables
DROP TABLE IF EXISTS public.session_ratings CASCADE;
DROP TABLE IF EXISTS public.user_archetypes CASCADE;
DROP TABLE IF EXISTS public.session_participants CASCADE;
DROP TABLE IF EXISTS public.session_questions CASCADE;
DROP TABLE IF EXISTS public.session_applications CASCADE;
DROP TABLE IF EXISTS public.jaifferson_sessions CASCADE;

-- Drop legacy v1 tables
DROP TABLE IF EXISTS public.responses CASCADE;
DROP TABLE IF EXISTS public.participants CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;

-- Drop email infrastructure tables
DROP TABLE IF EXISTS public.email_send_log CASCADE;
DROP TABLE IF EXISTS public.email_send_state CASCADE;
DROP TABLE IF EXISTS public.email_unsubscribe_tokens CASCADE;
DROP TABLE IF EXISTS public.suppressed_emails CASCADE;

-- Drop custom users + waitlist
DROP TABLE IF EXISTS public.waitlist_signups CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create the ONLY table we need: cloarec_leads
CREATE TABLE public.cloarec_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  target_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  profile_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_cloarec_leads_email ON public.cloarec_leads(email);
CREATE INDEX idx_cloarec_leads_created_at ON public.cloarec_leads(created_at DESC);

ALTER TABLE public.cloarec_leads ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a lead
CREATE POLICY "Anyone can submit a lead"
ON public.cloarec_leads
FOR INSERT
WITH CHECK (true);

-- Only service role can read/update
CREATE POLICY "Service role can read leads"
ON public.cloarec_leads
FOR SELECT
USING (auth.role() = 'service_role');

CREATE POLICY "Service role can update leads"
ON public.cloarec_leads
FOR UPDATE
USING (auth.role() = 'service_role');
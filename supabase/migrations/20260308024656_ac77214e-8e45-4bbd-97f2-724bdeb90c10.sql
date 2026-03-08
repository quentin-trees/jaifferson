CREATE TABLE public.waitlist_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  intent TEXT NOT NULL CHECK (intent IN ('host', 'join')),
  topic TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on waitlist_signups"
  ON public.waitlist_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

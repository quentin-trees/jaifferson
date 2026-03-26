
-- Tighten old prototype table policies
DROP POLICY IF EXISTS "Participants can be updated publicly" ON public.participants;
DROP POLICY IF EXISTS "Responses can be inserted publicly" ON public.responses;
DROP POLICY IF EXISTS "Allow public inserts on waitlist_signups" ON public.waitlist_signups;

-- Waitlist: anyone can insert (public form), but restrict update/delete
CREATE POLICY "Anyone can sign up to waitlist" ON public.waitlist_signups
  FOR INSERT WITH CHECK (true);

-- Participants: only allow updates where completed = true (marking completion)
CREATE POLICY "Participants can mark themselves completed" ON public.participants
  FOR UPDATE USING (true) WITH CHECK (completed = true);

-- Responses: anyone can insert (public onboarding form)
CREATE POLICY "Anyone can submit responses" ON public.responses
  FOR INSERT WITH CHECK (true);

# Jaifferson — Session #01

A salon-style meeting preparation app inspired by Jefferson dinners, with people conversation. Three pages, elegant design, Supabase backend.

## Design System

- **Fonts**: Inter (body) + Playfair Display (headings/logo) via Google Fonts
- **Colors**: Off-white `#F8F6F1` background, near-black `#1A1A1A` text, deep ink blue `#1B3A5C` accent, warm gray `#E0DDD8` borders
- **Style**: Sharp-cornered buttons, generous whitespace, no gradients/emoji/pill buttons. The logo is "Jaifferson" in serif with a thin horizontal rule beneath.

## Database (Supabase via Lovable Cloud)

- **sessions** table: id, name, topic, created_at
- **participants** table: id, session_id (FK), name, completed (default false), created_at
- **responses** table: id, participant_id (FK), all form fields (location, background, current_focus, hardest_problem, ai_usage, ai_better, ai_worry, reaction_to_jaifferson, session_value, question_for_group nullable), submitted_at
- **Seed data**: One session ("Session #01", topic "What is Jaifferson?") and 7 participants (Nathan, Yohan, Guillaume, François, Mathieu, Florian, Thomas)

## Page 1: `/` — Session Landing

- Logo top-left, large serif "Session #01" heading
- Two-paragraph description of the Jaifferson concept
- CTA button → `/onboard`
- Three-column session details: Topic, Format, Host
- Minimal footer

## Page 2: `/onboard` — Multi-Step Onboarding Form

- **Step indicator**: 4 numbered dots at the top
- **Step 1 — Identity**: Name dropdown (pre-filled from `?name=` URL param), location input, background textarea
- **Step 2 — Current Work**: Current focus textarea, hardest problem textarea
- **Step 3 — AI Relationship**: AI usage textarea, what AI improved (text input), AI concern (text input)
- **Step 4 — Session Prep**: Reaction to concept textarea, desired session value textarea, optional question for group textarea
- Navigation with "Next →" / "← Back" buttons, no skipping
- Personalized greeting ("Welcome, Nathan") after name selection
- All fields required except final question
- On submit: mark participant completed, save responses, show elegant confirmation message
- Fully mobile-responsive

## Page 3: `/admin` — Host Dashboard

- Password gate on first visit (password: `jaifferson01`, stored in localStorage)
- Session summary: "Session #01 · X of 7 participants completed"
- Card list of participants with name, location, completion status (green/gray dot), "View profile →"
- Profile detail view (modal or sub-route) showing all answers, read-only, with labeled sections
- Auto-refresh completion status every 60 seconds

## Tone & Copy

All copy written in the voice described in the brief — thoughtful, intelligent, respecting the participant. No generic form language.
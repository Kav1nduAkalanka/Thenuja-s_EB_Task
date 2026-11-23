-- ==============================================================================
-- oGV B2C Strategic Performance & Flyer Portal - Database Schema
-- AIESEC in University of Moratuwa · Term 27.28
-- Target: PostgreSQL / Remote Supabase with Row Level Security (RLS) & RBAC
-- Idempotent script: Safe to execute repeatedly in Supabase SQL Editor
-- ==============================================================================

-- 1. Create Enums (Idempotent)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('member', 'leader', 'lcvp', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE kanban_column AS ENUM ('member', 'leader', 'lcvp');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Users & Roles Table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'member',
    team_name TEXT NOT NULL DEFAULT 'Team Alpha (Global Classroom)',
    title TEXT,
    initials TEXT,
    avatar_bg TEXT DEFAULT 'bg-[#0052CC]',
    is_approved BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Flyers (Campaign Deliverables) Table
CREATE TABLE IF NOT EXISTS public.flyers (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL,
    title TEXT NOT NULL,
    caption TEXT,
    canva_url TEXT NOT NULL,
    types TEXT[] NOT NULL DEFAULT ARRAY['trend_based'],
    priority TEXT NOT NULL DEFAULT 'medium',
    "column" kanban_column NOT NULL DEFAULT 'member',
    uploader_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    uploader_name TEXT NOT NULL,
    uploader_role TEXT NOT NULL DEFAULT 'member',
    team_name TEXT NOT NULL,
    start_date DATE,
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_moved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    month TEXT NOT NULL DEFAULT to_char(NOW(), 'YYYY-MM')
);

ALTER TABLE public.flyers ENABLE ROW LEVEL SECURITY;

-- 4. Review Feedback & Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    flyer_id TEXT REFERENCES public.flyers(id) ON DELETE CASCADE,
    author_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL,
    text TEXT NOT NULL,
    is_movement_log BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- Supports both Supabase Auth & Anon Public Client for AIESEC Portal
-- ==============================================================================

DROP POLICY IF EXISTS "Allow select on users" ON public.users;
CREATE POLICY "Allow select on users"
ON public.users FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow insert on users" ON public.users;
CREATE POLICY "Allow insert on users"
ON public.users FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update on users" ON public.users;
CREATE POLICY "Allow update on users"
ON public.users FOR UPDATE
TO public
USING (true);

DROP POLICY IF EXISTS "Allow select on flyers" ON public.flyers;
CREATE POLICY "Allow select on flyers"
ON public.flyers FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow insert on flyers" ON public.flyers;
CREATE POLICY "Allow insert on flyers"
ON public.flyers FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update on flyers" ON public.flyers;
CREATE POLICY "Allow update on flyers"
ON public.flyers FOR UPDATE
TO public
USING (true);

DROP POLICY IF EXISTS "Allow delete on flyers" ON public.flyers;
CREATE POLICY "Allow delete on flyers"
ON public.flyers FOR DELETE
TO public
USING (true);

DROP POLICY IF EXISTS "Allow select on comments" ON public.comments;
CREATE POLICY "Allow select on comments"
ON public.comments FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow insert on comments" ON public.comments;
CREATE POLICY "Allow insert on comments"
ON public.comments FOR INSERT
TO public
WITH CHECK (true);

-- ==============================================================================
-- 6. INITIAL SEED DATA (Term 27.28 Official Members & Deliverables)
-- ==============================================================================

INSERT INTO public.users (id, email, full_name, role, team_name, title, initials, avatar_bg, is_approved)
VALUES
  ('u-member-1', 'kavinda.perera@aiesec.net', 'Kavinda Perera', 'member', 'Team Alpha (Global Classroom)', 'Content Creator', 'KP', 'bg-[#0052CC]', true),
  ('u-member-2', 'nimasha.fernando@aiesec.net', 'Nimasha Fernando', 'member', 'Team Alpha (Global Classroom)', 'Campaign Specialist', 'NF', 'bg-[#00B8D9]', true),
  ('u-member-3', 'tharindu.silva@aiesec.net', 'Tharindu Silva', 'member', 'Team Beta (Eco Pioneers)', 'Digital Marketer', 'TS', 'bg-[#6554C0]', true),
  ('u-leader-1', 'senuri.jayawardena@aiesec.net', 'Senuri Jayawardena', 'leader', 'Team Alpha (Global Classroom)', 'Team Leader - Alpha', 'SJ', 'bg-[#FFAB00]', true),
  ('u-leader-2', 'kasun.wickramasinghe@aiesec.net', 'Kasun Wickramasinghe', 'leader', 'Team Beta (Eco Pioneers)', 'Team Leader - Beta', 'KW', 'bg-[#36B37E]', true),
  ('u-lcvp', 'dulani.fernando@aiesec.net', 'Dulani Fernando', 'lcvp', 'Executive Board', 'LCVP oGV B2C', 'DF', 'bg-[#006644]', true),
  ('u-admin', 'thenuja.tm@aiesec.net', 'Thenuja', 'admin', 'Talent Management', 'Candidate LCVP TM', 'TM', 'bg-[#403294]', true)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  team_name = EXCLUDED.team_name,
  title = EXCLUDED.title,
  initials = EXCLUDED.initials;

INSERT INTO public.flyers (id, key, title, caption, canva_url, types, priority, "column", uploader_id, uploader_name, uploader_role, team_name, start_date, due_date, created_at)
VALUES
  ('KB-01', 'OGV-101', 'B2C Digital Campaign: Undergraduate Volunteer Testimonials Reel', 'Fast-paced social media reel highlighting verified exchange experiences for Moratuwa undergraduates. High visual energy with upbeat trending audio.', 'https://www.canva.com/design/DAGTrendReelsWinter26/view', ARRAY['trend_based'], 'high', 'member', 'u-member-3', 'Tharindu Silva', 'member', 'Team Beta (Eco Pioneers)', '2026-11-20', '2026-11-26', NOW() - INTERVAL '3 hours'),
  ('KB-02', 'OGV-102', 'Destination Portfolio: Egypt Cultural & Leadership Exchange Guide', 'Comprehensive destination carousel for volunteer housing, local culture, and Cairo community leadership opportunities for Term 27.28 applicants.', 'https://www.canva.com/design/DAGEgyptCountryPromo26/view', ARRAY['country_based'], 'medium', 'leader', 'u-member-1', 'Kavinda Perera', 'member', 'Team Alpha (Global Classroom)', '2026-11-18', '2026-11-25', NOW() - INTERVAL '1 day'),
  ('KB-03', 'OGV-103', 'Global Classroom SDG 4 Education Campaign: Winter Cohort', 'Primary SDG 4 Quality Education awareness flyer for faculty noticeboards and Instagram story series with registered link in bio CTA.', 'https://www.canva.com/design/DAGSDG4EducationMora/view', ARRAY['project_based'], 'high', 'lcvp', 'u-member-2', 'Nimasha Fernando', 'member', 'Team Alpha (Global Classroom)', '2026-11-15', '2026-11-24', NOW() - INTERVAL '2 days'),
  ('KB-04', 'OGV-104', 'Vietnam Cultural Exchange: Ho Chi Minh City Youth Program', 'Teaching English and cultural immersion program flyer tailored to first-year engineering and IT undergraduates seeking leadership development.', 'https://www.canva.com/design/DAGVietnamExchange26/view', ARRAY['country_based', 'project_based'], 'low', 'member', 'u-member-1', 'Kavinda Perera', 'member', 'Team Alpha (Global Classroom)', '2026-11-22', '2026-11-28', NOW() - INTERVAL '5 hours'),
  ('KB-05', 'OGV-105', 'Instagram Carousel: 5 Reasons to Volunteer Abroad in 2027', 'High-converting carousel post addressing common parental concerns, university credit validation, and international safety protocols.', 'https://www.canva.com/design/DAG5ReasonsCarousel27/view', ARRAY['trend_based'], 'medium', 'leader', 'u-member-3', 'Tharindu Silva', 'member', 'Team Beta (Eco Pioneers)', '2026-11-19', '2026-11-25', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.comments (id, flyer_id, author_id, author_name, author_role, text, is_movement_log, created_at)
VALUES
  ('c-1', 'KB-01', 'u-leader-2', 'Kasun Wickramasinghe', 'Team Leader', 'Design verified. Ensure high logo contrast on the opening frame before escalating to Leader Review.', false, NOW() - INTERVAL '2 hours'),
  ('c-2', 'KB-02', 'u-leader-1', 'Senuri Jayawardena', 'Team Leader', 'Great work on the typography and visa infographic. Reviewed and approved by Team Leader.', false, NOW() - INTERVAL '20 hours'),
  ('c-3', 'KB-03', 'u-lcvp', 'Dulani Fernando', 'LCVP oGV B2C', 'LCVP Final Sign-off Granted: Certified Ready to Post on all official B2C channels.', false, NOW() - INTERVAL '36 hours'),
  ('c-5', 'KB-05', 'u-leader-2', 'Kasun Wickramasinghe', 'Team Leader', 'Reviewed. Visual alignment matches Brand Guidelines 27.28. Escalated for LCVP final sign-off.', false, NOW() - INTERVAL '18 hours')
ON CONFLICT (id) DO NOTHING;

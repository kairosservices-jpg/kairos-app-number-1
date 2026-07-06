-- Users table extensions (Managed by Supabase Auth, but we keep role here or in custom claims. 
-- For simplicity, we'll create a public 'profiles' table that links to auth.users)

CREATE TYPE user_role AS ENUM ('operator', 'partner', 'member');

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role user_role DEFAULT 'member'::user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Gym partners
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  revenue_share_pct NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Clients
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- nullable, not all clients have portal
  operator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  goal TEXT, -- cut/maintain/build
  sex TEXT,
  age INTEGER,
  weight_lbs NUMERIC,
  height_ft INTEGER,
  height_in INTEGER,
  activity_level NUMERIC,
  tier TEXT, -- s/l/xl
  macros JSONB, -- {cal, p, c, f}
  start_date DATE,
  program_week INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active', -- active/completed/paused
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Weekly plans
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  week_of DATE NOT NULL,
  days JSONB NOT NULL DEFAULT '[]', -- full 7-day plan with meals
  macros_target JSONB,
  tier TEXT,
  confirmed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Meal Database Tables
CREATE TABLE public.meal_proteins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  p_per_oz NUMERIC NOT NULL,
  f_per_oz NUMERIC NOT NULL,
  yield_key TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.meal_flavors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.meal_veg_mixes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Lunch items are built dynamically, but can be saved as combos if needed.
-- The prompt mentions meal_combos_lunch, we'll include it for reference.
CREATE TABLE public.meal_combos_lunch (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protein_id UUID REFERENCES public.meal_proteins(id) ON DELETE CASCADE,
  flavor_id UUID REFERENCES public.meal_flavors(id) ON DELETE CASCADE,
  veg_id UUID REFERENCES public.meal_veg_mixes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.meal_dinners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  base_p NUMERIC NOT NULL,
  base_c NUMERIC NOT NULL,
  base_f NUMERIC NOT NULL,
  protein_type TEXT,
  carb_side TEXT,
  veg TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.meal_breakfast (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  p NUMERIC NOT NULL,
  c NUMERIC NOT NULL,
  f NUMERIC NOT NULL,
  scalable BOOLEAN DEFAULT false,
  protein_id UUID REFERENCES public.meal_proteins(id) ON DELETE SET NULL,
  c_fixed NUMERIC,
  f_fixed NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.meal_snacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  p NUMERIC NOT NULL,
  c NUMERIC NOT NULL,
  f NUMERIC NOT NULL,
  scalable BOOLEAN DEFAULT false,
  protein_id UUID REFERENCES public.meal_proteins(id) ON DELETE SET NULL,
  c_fixed NUMERIC,
  f_fixed NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Production runs
CREATE TABLE public.production_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_of DATE NOT NULL,
  operator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_ids JSONB DEFAULT '[]',
  order_counts JSONB DEFAULT '{}',
  totals JSONB DEFAULT '{}',
  note TEXT,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Meal logs (member-facing)
CREATE TABLE public.meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  logged_date DATE NOT NULL,
  meal_key TEXT NOT NULL, -- breakfast/lunch1/lunch2/dinner/snack
  meal_name TEXT NOT NULL,
  p NUMERIC,
  c NUMERIC,
  f NUMERIC,
  cal NUMERIC,
  logged BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Progress snapshots
CREATE TABLE public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  recorded_date DATE NOT NULL,
  program_week INTEGER,
  weight_lbs NUMERIC,
  body_fat_pct NUMERIC,
  waist_in NUMERIC,
  chest_in NUMERIC,
  arms_in NUMERIC,
  legs_in NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Recipes (for DIY members)
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_name TEXT NOT NULL,
  servings INTEGER DEFAULT 1,
  prep_time_min INTEGER,
  cook_time_min INTEGER,
  ingredients JSONB DEFAULT '[]',
  instructions JSONB DEFAULT '[]',
  macros_per_serving JSONB,
  tier_s_multiplier NUMERIC DEFAULT 1.0,
  tier_l_multiplier NUMERIC DEFAULT 1.5,
  tier_xl_multiplier NUMERIC DEFAULT 2.0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create a trigger to automatically create a profile for new auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically assign operator role to specific email
  IF new.email = 'danielwee@gmail.com' THEN
    INSERT INTO public.profiles (id, email, role)
    VALUES (new.id, new.email, 'operator');
  ELSE
    INSERT INTO public.profiles (id, email, role)
    VALUES (new.id, new.email, 'member');
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Helper function to avoid infinite recursion when checking roles in RLS
CREATE OR REPLACE FUNCTION public.is_operator()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'operator'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Turn on RLS for everything
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_proteins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_flavors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_veg_mixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_combos_lunch ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_dinners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_breakfast ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_snacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Operator sees everything.
CREATE POLICY "Operators can do everything" ON public.profiles FOR ALL USING (
  public.is_operator()
);
-- Similarly for other tables, operators bypass. We will refine member policies later.
-- For now, open read access to meal items so members can see them.
CREATE POLICY "Public read meal items" ON public.meal_proteins FOR SELECT USING (true);
CREATE POLICY "Public read meal flavors" ON public.meal_flavors FOR SELECT USING (true);
CREATE POLICY "Public read meal veg mixes" ON public.meal_veg_mixes FOR SELECT USING (true);
CREATE POLICY "Public read meal combos" ON public.meal_combos_lunch FOR SELECT USING (true);
CREATE POLICY "Public read meal dinners" ON public.meal_dinners FOR SELECT USING (true);
CREATE POLICY "Public read meal breakfast" ON public.meal_breakfast FOR SELECT USING (true);
CREATE POLICY "Public read meal snacks" ON public.meal_snacks FOR SELECT USING (true);
CREATE POLICY "Public read recipes" ON public.recipes FOR SELECT USING (true);

-- Member policies (very restrictive)
CREATE POLICY "Members can view own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Members can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Members can view own client data" ON public.clients FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Members can view own plans" ON public.plans FOR SELECT USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));
CREATE POLICY "Members can manage own logs" ON public.meal_logs FOR ALL USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));
CREATE POLICY "Members can manage own progress" ON public.progress FOR ALL USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- We'll add remaining policies as needed.

-- User preferences table (theme persistence across devices)
-- Run in: Supabase Dashboard → SQL Editor → New Query

CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id    UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme      TEXT        NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own preferences"
  ON public.user_preferences
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

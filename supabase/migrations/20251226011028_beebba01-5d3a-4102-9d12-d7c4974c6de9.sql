-- Create user_preferences table to store per-user settings
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id uuid PRIMARY KEY NOT NULL,
  theme text NOT NULL DEFAULT 'dark',
  ai_style text NOT NULL DEFAULT 'SaaS premium',
  ai_tone text NOT NULL DEFAULT 'Profissional',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies: each user can manage only their own preferences
CREATE POLICY "Users can view their own preferences"
ON public.user_preferences
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
ON public.user_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON public.user_preferences
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Reuse existing timestamp trigger function
CREATE TRIGGER user_preferences_set_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
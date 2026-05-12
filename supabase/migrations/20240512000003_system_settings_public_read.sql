-- Allow anonymous users to read system settings for branding purposes
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view settings" ON public.system_settings;

CREATE POLICY "Public can view settings" 
ON public.system_settings FOR SELECT 
TO anon, authenticated 
USING (true);

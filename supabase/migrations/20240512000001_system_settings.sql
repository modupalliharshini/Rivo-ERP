-- 1. Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_name TEXT DEFAULT 'Rivo ERP',
    support_email TEXT DEFAULT 'support@rivo.erp',
    maintenance_mode BOOLEAN DEFAULT false,
    local_currency TEXT DEFAULT 'Indian Rupee (₹)',
    two_factor_auth BOOLEAN DEFAULT true,
    password_complexity BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Anyone authenticated can READ settings (needed for site branding etc)
CREATE POLICY "Anyone can view settings" 
ON public.system_settings FOR SELECT 
TO authenticated 
USING (true);

-- Only Super Admins can UPDATE settings
CREATE POLICY "Super Admins can update settings" 
ON public.system_settings FOR ALL 
TO authenticated 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

-- 4. Initial seed (only if table is empty)
INSERT INTO public.system_settings (platform_name, support_email)
SELECT 'Rivo ERP', 'support@rivo.erp'
WHERE NOT EXISTS (SELECT 1 FROM public.system_settings);

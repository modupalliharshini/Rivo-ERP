-- 1. Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT,
    action TEXT NOT NULL,
    target TEXT,
    ip_address TEXT,
    status TEXT DEFAULT 'Success', -- Success, Denied, Failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 3. Security Policy (Only Super Admins can see logs)
CREATE POLICY "Super Admins can view all logs" 
ON public.audit_logs FOR SELECT 
TO authenticated 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

-- 4. Initial seed data
INSERT INTO public.audit_logs (user_email, action, target, ip_address, status)
VALUES 
('superadmin@rivo.erp', 'System Startup', 'Global Platform', '127.0.0.1', 'Success'),
('admin@greenwood.edu', 'Institution Login', 'Greenwood High', '192.168.1.10', 'Success'),
('unknown@hacker.com', 'Failed Login', 'Super Admin Portal', '10.0.0.45', 'Denied');

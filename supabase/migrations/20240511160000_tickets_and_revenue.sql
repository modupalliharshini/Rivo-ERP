-- Create tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'Open', -- Open, In Progress, Resolved
    priority TEXT DEFAULT 'Medium', -- Low, Medium, High
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add some dummy tickets for the super admin to see
INSERT INTO public.tickets (subject, status, priority)
VALUES 
('Login issue for Greenwood High', 'Open', 'High'),
('Fee report export bug', 'Resolved', 'Medium'),
('New institution onboarding', 'In Progress', 'Low');

-- Add price column to institutions if not exists (to calculate revenue)
ALTER TABLE public.institutions ADD COLUMN IF NOT EXISTS subscription_price NUMERIC DEFAULT 0;

-- Set some prices based on existing plans
UPDATE public.institutions SET subscription_price = 50000 WHERE plan = 'Basic';
UPDATE public.institutions SET subscription_price = 150000 WHERE plan = 'Pro';
UPDATE public.institutions SET subscription_price = 500000 WHERE plan = 'Enterprise';

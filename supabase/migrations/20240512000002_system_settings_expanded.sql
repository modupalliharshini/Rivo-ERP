-- Update system_settings with new columns
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS session_timeout TEXT DEFAULT '30 mins';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS backup_frequency TEXT DEFAULT 'Daily';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT '#3b82f6';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS notification_alerts BOOLEAN DEFAULT true;

-- Migration: Remove foreign key constraint from user_id in student_profiles
-- This allows temporary (unauthenticated) users to save their profiles

-- Drop the foreign key constraint if it exists
ALTER TABLE IF EXISTS public.student_profiles
DROP CONSTRAINT IF EXISTS student_profiles_user_id_fkey;

-- Optional: Keep the UNIQUE constraint on user_id if it exists
-- ALTER TABLE public.student_profiles
-- DROP CONSTRAINT IF EXISTS student_profiles_user_id_key;

-- Add a comment explaining the change
COMMENT ON COLUMN public.student_profiles.user_id IS 'User ID - can be NULL for temporary/unauthenticated users';

-- ============================================
-- Match Maker Path - Database Setup Script
-- Project: jzggpdgvkhdescikbogq
-- ============================================
-- Instructions:
-- 1. Go to: https://supabase.com/dashboard/project/jzggpdgvkhdescikbogq/editor
-- 2. Click "New Query"
-- 3. Copy and paste this entire file
-- 4. Click "Run" (or press Ctrl/Cmd + Enter)
-- ============================================

-- ============================================
-- Create student_profiles table
-- ============================================
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  
  -- Personal Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  linkedin TEXT,
  address TEXT NOT NULL,
  
  -- Academic Profile
  age INTEGER DEFAULT 18,
  education_level TEXT NOT NULL,
  grading_system TEXT NOT NULL,
  academic_score DECIMAL,
  standardized_test TEXT DEFAULT 'none',
  test_score INTEGER DEFAULT 0,
  
  -- Preferences
  target_countries TEXT[] DEFAULT '{}',
  study_level TEXT NOT NULL,
  budget_min INTEGER DEFAULT 20000,
  budget_max INTEGER DEFAULT 60000,
  scholarship_interest BOOLEAN DEFAULT false,
  subjects TEXT[] DEFAULT '{}',
  extracurriculars TEXT[] DEFAULT '{}',
  career_goals TEXT,
  
  -- Experience
  organization TEXT,
  designation TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Constraints
  UNIQUE(user_id)
);

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- Policy: Users can view their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON public.student_profiles;
CREATE POLICY "Users can view their own profile"
  ON public.student_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.student_profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.student_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.student_profiles;
CREATE POLICY "Users can update their own profile"
  ON public.student_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own profile
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.student_profiles;
CREATE POLICY "Users can delete their own profile"
  ON public.student_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Function to auto-update timestamps
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================
-- Trigger for automatic timestamp updates
-- ============================================
DROP TRIGGER IF EXISTS update_student_profiles_updated_at ON public.student_profiles;
CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Create indexes for better performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON public.student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_email ON public.student_profiles(email);
CREATE INDEX IF NOT EXISTS idx_student_profiles_created_at ON public.student_profiles(created_at DESC);

-- ============================================
-- Grant necessary permissions
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.student_profiles TO authenticated;
GRANT SELECT ON public.student_profiles TO anon;

-- ============================================
-- Verification Query
-- ============================================
-- Run this after the script completes to verify:
-- SELECT table_name, column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'student_profiles' 
-- ORDER BY ordinal_position;

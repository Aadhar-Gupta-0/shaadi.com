-- Create student_profiles table to store onboarding data
CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
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
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see and manage their own profile
CREATE POLICY "Users can view their own profile"
  ON public.student_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.student_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.student_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
  ON public.student_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
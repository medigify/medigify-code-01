# Medigify Supabase Schema & SQL History

This document contains all the SQL commands that have been run on the Supabase project so far. It serves as a source of truth for the database schema, RLS policies, and triggers.

## 1. Profiles Table & Auth Trigger

This creates the `profiles` table and automatically inserts a new row whenever a user signs up via Supabase Auth.

```sql
-- Create the profiles table
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name text,
  last_name text,
  username text UNIQUE,
  examining_body_id text,
  college_id text,
  academic_year integer,
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies so users can read/update their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create a trigger function to copy data from auth.users to public.profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, username, examining_body_id, college_id, academic_year)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'examining_body_id',
    new.raw_user_meta_data->>'college_id',
    CAST(new.raw_user_meta_data->>'academic_year' AS INTEGER)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Map the trigger to execute after an insert on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 2. Adding Subscription Plans

This adds the `plan` column to track Free vs Pro users, and updates the trigger function to set 'free' as the default plan during signup.

```sql
-- 1. Add the plan columns to profiles
ALTER TABLE public.profiles
ADD COLUMN plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
ADD COLUMN plan_expires_at timestamp with time zone DEFAULT NULL;

-- 2. Update the trigger to include the 'free' plan by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, username, examining_body_id, college_id, academic_year, plan)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'examining_body_id',
    new.raw_user_meta_data->>'college_id',
    CAST(new.raw_user_meta_data->>'academic_year' AS INTEGER),
    'free'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 3. Question Attempts Table (Stats & Progress)

This creates the table to track user performance, streak, and subject mastery.

```sql
-- Create the question attempts table
CREATE TABLE public.question_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id text NOT NULL,
  selected_option text NOT NULL,
  is_correct boolean NOT NULL,
  time_spent_seconds int,
  mode text DEFAULT 'practice',
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;

-- Set up RLS Policies for question attempts
CREATE POLICY "Users can insert own attempts"
  ON public.question_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own attempts"
  ON public.question_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add indexes for fast querying of user stats (crucial for dashboard load times)
CREATE INDEX idx_attempts_user_id ON public.question_attempts(user_id);
CREATE INDEX idx_attempts_created_at ON public.question_attempts(user_id, created_at DESC);
```

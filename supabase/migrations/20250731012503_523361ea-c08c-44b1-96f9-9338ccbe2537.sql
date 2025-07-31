-- Create user role enum
CREATE TYPE user_role AS ENUM ('child', 'parent');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role user_role NOT NULL,
  name TEXT NOT NULL,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create parent_child_relationships table
CREATE TABLE public.parent_child_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_child_relationships ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for parent_child_relationships
CREATE POLICY "Children can view their relationships" 
ON public.parent_child_relationships 
FOR SELECT 
USING (auth.uid() = child_user_id);

CREATE POLICY "Children can create relationships" 
ON public.parent_child_relationships 
FOR INSERT 
WITH CHECK (auth.uid() = child_user_id);

CREATE POLICY "Parents can view relationships where they are linked" 
ON public.parent_child_relationships 
FOR SELECT 
USING (auth.uid() = parent_user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parent_child_relationships_updated_at
  BEFORE UPDATE ON public.parent_child_relationships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
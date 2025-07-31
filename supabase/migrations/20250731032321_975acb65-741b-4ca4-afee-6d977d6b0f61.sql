-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_user_id UUID NOT NULL,
  parent_user_id UUID,
  question_text TEXT NOT NULL,
  answer_text TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  answered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Create policies for questions
CREATE POLICY "Children can view their questions" 
ON public.questions 
FOR SELECT 
USING (auth.uid() = child_user_id);

CREATE POLICY "Parents can view questions sent to them" 
ON public.questions 
FOR SELECT 
USING (auth.uid() = parent_user_id);

CREATE POLICY "Children can create questions" 
ON public.questions 
FOR INSERT 
WITH CHECK (auth.uid() = child_user_id);

CREATE POLICY "Parents can update answers" 
ON public.questions 
FOR UPDATE 
USING (auth.uid() = parent_user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_questions_updated_at
BEFORE UPDATE ON public.questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
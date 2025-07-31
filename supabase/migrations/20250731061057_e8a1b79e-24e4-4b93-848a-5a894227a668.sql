-- Add follow-up response column to questions table
ALTER TABLE public.questions 
ADD COLUMN child_followup_text TEXT,
ADD COLUMN child_followup_sent_at TIMESTAMP WITH TIME ZONE;
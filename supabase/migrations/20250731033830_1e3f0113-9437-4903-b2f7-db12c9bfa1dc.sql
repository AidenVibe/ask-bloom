-- Create question templates table
CREATE TABLE public.question_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text text NOT NULL,
  category text NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for question templates
ALTER TABLE public.question_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for reading question templates (anyone can read templates)
CREATE POLICY "Question templates are viewable by everyone" 
ON public.question_templates 
FOR SELECT 
USING (is_active = true);

-- Insert initial question templates with categories
INSERT INTO public.question_templates (question_text, category, sort_order) VALUES
('어머니/아버지가 어릴 때 가장 좋아했던 장난감이나 놀이가 뭐였어요?', '어린 시절', 1),
('첫사랑은 언제 했고, 어떤 사람이었나요?', '청춘', 2),
('학창 시절 별명이 있었나요? 왜 그렇게 불렸어요?', '어린 시절', 3),
('젊었을 때 가장 열정적으로 했던 취미나 활동이 뭐였어요?', '청춘', 4),
('첫 직장 첫 출근 날은 어땠나요?', '일과 사회생활', 5),
('첫아이(나)를 안았을 때 어떤 기분이었나요?', '가족', 6),
('요즘 가장 재미있게 보는 TV 프로그램이나 유튜브가 뭐예요?', '취미와 관심사', 7),
('가장 행복했던 순간이 언제였어요?', '인생', 8),
('어린 시절과 지금, 가장 달라진 게 뭐라고 생각하세요?', '인생', 9),
('우리 가족이 더 가까워지려면 어떻게 하면 좋을까요?', '가족', 10);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_question_templates_updated_at
BEFORE UPDATE ON public.question_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
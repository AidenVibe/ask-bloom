-- 부모가 access token으로 질문을 업데이트할 수 있도록 RLS 정책 추가
CREATE POLICY "Anyone can update questions with valid access token" 
ON public.questions 
FOR UPDATE 
USING (parent_access_token IS NOT NULL);

-- 부모가 access token으로 질문을 조회할 수 있도록 RLS 정책 추가  
CREATE POLICY "Anyone can view questions with valid access token"
ON public.questions
FOR SELECT
USING (parent_access_token IS NOT NULL);
-- 부모-자녀 관계 테이블에 관계 컬럼 추가
ALTER TABLE public.parent_child_relationships 
ADD COLUMN relationship TEXT NOT NULL DEFAULT 'parent';

-- profiles 테이블에 발송 시간 설정 추가
ALTER TABLE public.profiles 
ADD COLUMN preferred_time TEXT;

-- 기존 데이터의 preferred_time 업데이트 (onboarding_data에서 추출)
UPDATE public.profiles 
SET preferred_time = onboarding_data->>'preferredTime'
WHERE onboarding_data->>'preferredTime' IS NOT NULL;
-- questions 테이블에 parent_access_token 컬럼 추가
ALTER TABLE questions 
ADD COLUMN parent_access_token VARCHAR(32) DEFAULT encode(gen_random_bytes(16), 'hex');

-- 기존 데이터에 대해서도 토큰 생성
UPDATE questions 
SET parent_access_token = encode(gen_random_bytes(16), 'hex') 
WHERE parent_access_token IS NULL;
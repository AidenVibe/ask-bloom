-- 개발 환경용 데이터 클리어 함수 생성
CREATE OR REPLACE FUNCTION clear_user_data(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 해당 유저의 모든 데이터 삭제
  DELETE FROM questions WHERE child_user_id = target_user_id OR parent_user_id = target_user_id;
  DELETE FROM parent_child_relationships WHERE child_user_id = target_user_id OR parent_user_id = target_user_id;
  DELETE FROM profiles WHERE user_id = target_user_id;
END;
$$;

-- 개발 환경용 전체 데이터 클리어 함수
CREATE OR REPLACE FUNCTION clear_all_development_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 모든 테이블의 데이터 삭제 (테스트/개발 환경용)
  DELETE FROM questions;
  DELETE FROM parent_child_relationships;
  DELETE FROM profiles;
END;
$$;
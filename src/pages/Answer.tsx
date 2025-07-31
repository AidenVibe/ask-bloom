import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnswerForm } from "@/components/AnswerForm";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, AlertCircle } from "lucide-react";

const Answer = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [parentName, setParentName] = useState("");
  const [error, setError] = useState("");

  const questionId = searchParams.get('q');
  const accessToken = searchParams.get('t');

  useEffect(() => {
    const loadQuestionData = async () => {
      if (!questionId || !accessToken) {
        setError("링크가 올바르지 않습니다.");
        setLoading(false);
        return;
      }

      try {
        // 질문 정보 조회
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .select('*')
          .eq('id', questionId)
          .eq('parent_access_token', accessToken)
          .single();

        if (questionError || !questionData) {
          setError("링크가 만료되었거나 유효하지 않습니다.");
          setLoading(false);
          return;
        }

        // 부모 정보 조회
        const { data: parentData, error: parentError } = await supabase
          .from('parent_child_relationships')
          .select('parent_name')
          .eq('child_user_id', questionData.child_user_id)
          .single();

        if (parentError || !parentData) {
          setError("부모 정보를 찾을 수 없습니다.");
          setLoading(false);
          return;
        }

        setQuestion(questionData.question_text);
        setParentName(parentData.parent_name);
      } catch (error) {
        console.error('질문 로드 실패:', error);
        setError("질문을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadQuestionData();
  }, [questionId, accessToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-coral mx-auto mb-4"></div>
          <p className="text-warm-gray">잠시만 기다려주세요...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <AlertCircle className="w-12 h-12 text-warm-coral mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-foreground">문제가 발생했습니다</h2>
            <p className="text-warm-gray mb-4">{error}</p>
            <p className="text-sm text-warm-gray/70">
              자녀에게 새로운 링크를 요청해주세요.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AnswerForm 
      question={question}
      parentName={parentName}
    />
  );
};

export default Answer;
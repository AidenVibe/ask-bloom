import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, Heart, ArrowLeft, Calendar, Reply, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const ViewAnswer = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState("");
  const [followupText, setFollowupText] = useState("");
  const [isSubmittingFollowup, setIsSubmittingFollowup] = useState(false);
  const [showFollowupForm, setShowFollowupForm] = useState(false);

  const questionId = searchParams.get('id') || searchParams.get('q');
  const accessToken = searchParams.get('token');

  useEffect(() => {
    const loadQuestion = async () => {
      if (!questionId) {
        setError("잘못된 링크입니다.");
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('questions')
          .select('*, child_followup_text, child_followup_sent_at')
          .eq('id', questionId);

        if (accessToken) {
          query = query.eq('parent_access_token', accessToken);
        }

        const { data: questionData, error: questionError } = await query.single();

        if (questionError) throw questionError;

        if (!questionData.answer_text) {
          setError("아직 답변이 오지 않았습니다.");
          setLoading(false);
          return;
        }

        setQuestion(questionData);
      } catch (error) {
        console.error('질문 로드 실패:', error);
        setError("질문을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [questionId, accessToken]);

  const handleFollowupSubmit = async () => {
    if (!followupText.trim() || !user || !questionId) return;

    setIsSubmittingFollowup(true);
    try {
      const { error } = await supabase
        .from('questions')
        .update({
          child_followup_text: followupText.trim(),
          child_followup_sent_at: new Date().toISOString()
        })
        .eq('id', questionId)
        .eq('child_user_id', user.id);

      if (error) throw error;

      toast({
        title: "꼬리 답변이 전송되었습니다",
        description: "부모님께서 확인하실 수 있어요."
      });

      // 질문 데이터 새로고침
      setQuestion({
        ...question,
        child_followup_text: followupText.trim(),
        child_followup_sent_at: new Date().toISOString()
      });
      
      setFollowupText("");
      setShowFollowupForm(false);
    } catch (error) {
      console.error('Error submitting followup:', error);
      toast({
        title: "전송 실패",
        description: "꼬리 답변 전송에 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingFollowup(false);
    }
  };

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
            <MessageCircle className="w-12 h-12 text-warm-coral mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-foreground">{error}</h2>
            <Button 
              variant="soft" 
              onClick={() => navigate('/dashboard')}
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-peach via-cream to-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-warm-coral/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-warm-coral" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              부모님의 답변이 도착했어요! 💌
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm text-warm-gray">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(question.answered_at), "M월 d일 HH:mm", { locale: ko })}
              </span>
            </div>
          </div>

          {/* Question & Answer */}
          <div className="space-y-6">
            {/* Question */}
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                  <MessageCircle className="w-4 h-4" />
                  내가 보낸 질문
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground text-lg leading-relaxed">
                  {question.question_text}
                </p>
              </CardContent>
            </Card>

            {/* Answer */}
            <Card className="border-warm-coral/20 shadow-lg bg-warm-coral/5">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-sm text-warm-coral font-medium">
                  <Heart className="w-4 h-4" />
                  부모님의 답변
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground text-lg leading-relaxed">
                  {question.answer_text}
                </p>

                {/* Follow-up Response Section */}
                {user && question.child_user_id === user.id && (
                  <div className="mt-8 border-t pt-6">
                    {question.child_followup_text ? (
                      <div className="flex items-start gap-4 bg-blue-50 p-4 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Reply className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-blue-600 font-medium mb-2">
                            💬 나의 꼬리 답변
                          </div>
                          <p className="text-foreground leading-relaxed">
                            {question.child_followup_text}
                          </p>
                          {question.child_followup_sent_at && (
                            <div className="text-xs text-warm-gray mt-2">
                              {format(new Date(question.child_followup_sent_at), "M월 d일 HH:mm", { locale: ko })}에 전송함
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {!showFollowupForm ? (
                          <div className="text-center">
                            <p className="text-warm-gray mb-4">
                              부모님의 답변에 대해 더 궁금한 점이나 감사 인사를 전해보세요
                            </p>
                            <Button
                              variant="outline"
                              onClick={() => setShowFollowupForm(true)}
                            >
                              <Reply className="w-4 h-4 mr-2" />
                              꼬리 답변 남기기
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                꼬리 답변
                              </label>
                              <Textarea
                                value={followupText}
                                onChange={(e) => setFollowupText(e.target.value)}
                                placeholder="부모님께 더 궁금한 점이나 감사 인사를 남겨보세요..."
                                className="min-h-[100px]"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={handleFollowupSubmit}
                                disabled={!followupText.trim() || isSubmittingFollowup}
                                className="flex-1"
                              >
                                {isSubmittingFollowup ? (
                                  "전송 중..."
                                ) : (
                                  <>
                                    <Send className="w-4 h-4 mr-2" />
                                    꼬리 답변 전송
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setShowFollowupForm(false);
                                  setFollowupText("");
                                }}
                              >
                                취소
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Back Button */}
          <div className="text-center mt-8">
            <Button 
              variant="soft" 
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              대시보드로 돌아가기
            </Button>
          </div>

          {/* Footer Message */}
          <div className="text-center mt-8">
            <p className="text-sm text-warm-gray">
              새로운 질문을 보내고 싶다면 대시보드에서 질문을 선택해보세요 💕
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAnswer;
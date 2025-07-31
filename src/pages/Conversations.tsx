import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, AlertCircle, Heart, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const Conversations = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [childName, setChildName] = useState("");
  const [error, setError] = useState("");

  const accessToken = searchParams.get('t');

  useEffect(() => {
    const loadConversations = async () => {
      if (!accessToken) {
        setError("링크가 올바르지 않습니다.");
        setLoading(false);
        return;
      }

      try {
        // 해당 access token과 연관된 질문들 조회
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('parent_access_token', accessToken)
          .order('created_at', { ascending: false });

        if (questionsError) throw questionsError;

        if (!questionsData || questionsData.length === 0) {
          setError("질문을 찾을 수 없습니다.");
          setLoading(false);
          return;
        }

        // 자녀 정보 조회
        const childUserId = questionsData[0].child_user_id;
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', childUserId)
          .single();

        if (profileError) {
          console.warn('자녀 정보 조회 실패:', profileError);
        }

        setConversations(questionsData);
        setChildName(profileData?.name || "자녀");
      } catch (error) {
        console.error('대화 내역 로드 실패:', error);
        setError("대화 내역을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [accessToken]);

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
    <div className="min-h-screen bg-gradient-to-br from-soft-peach via-cream to-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-warm-coral/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-warm-coral" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {childName}님과의 대화
            </h1>
            <p className="text-warm-gray">
              지금까지 나눈 소중한 이야기들을 확인해보세요
            </p>
          </div>

          {/* Conversations List */}
          <div className="space-y-6">
            {conversations.map((conversation) => (
              <Card key={conversation.id} className="border-warm-coral/20 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-warm-gray">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(conversation.sent_at), "yyyy년 M월 d일", { locale: ko })}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      conversation.answer_text 
                        ? "bg-green-100 text-green-700" 
                        : "bg-warm-coral/20 text-warm-coral"
                    }`}>
                      {conversation.answer_text ? "답변 완료" : "답변 대기"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Question */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-blue-600 font-medium mb-2">
                        💬 {childName}님의 질문
                      </div>
                      <p className="text-foreground text-lg leading-relaxed">
                        {conversation.question_text}
                      </p>
                    </div>
                  </div>

                  {/* Answer */}
                  {conversation.answer_text && (
                    <div className="flex items-start gap-4 bg-warm-coral/5 p-4 rounded-lg">
                      <div className="w-10 h-10 bg-warm-coral/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="w-5 h-5 text-warm-coral" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-warm-coral font-medium mb-2">
                          💕 부모님의 답변
                        </div>
                        <p className="text-foreground leading-relaxed">
                          {conversation.answer_text}
                        </p>
                        {conversation.answered_at && (
                          <div className="text-xs text-warm-gray mt-2">
                            {format(new Date(conversation.answered_at), "M월 d일 HH:mm", { locale: ko })}에 답변함
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Back Link */}
          <div className="text-center mt-12">
            <p className="text-sm text-warm-gray mb-4">
              모든 대화를 확인하셨나요?
            </p>
            <p className="text-xs text-warm-gray/70">
              새로운 질문이 오면 자녀분이 다시 연락드릴 거예요 💕
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversations;
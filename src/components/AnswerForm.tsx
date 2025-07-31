import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Heart, Mic, Send, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnswerFormProps {
  question: string;
  parentName?: string;
}

export const AnswerForm = ({ 
  question, 
  parentName = "부모님" 
}: AnswerFormProps) => {
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const questionId = searchParams.get('q');
  const accessToken = searchParams.get('t');

  const exampleAnswers = [
    "김치찌개를 제일 좋아해요. 특히 묵은 김치로 끓인 것을 좋아하시죠.",
    "어머니는 비빔밥을 즐겨 드세요. 나물 하나하나 다 직접 만드시거든요.",
    "된장찌개를 가장 좋아하세요. 집에서 직접 담근 된장으로 끓여주시면 최고예요."
  ];

  const handleExampleClick = (example: string) => {
    setAnswer(example);
  };

  const handleSubmit = async () => {
    if (answer.trim().length < 10) {
      toast({
        title: "답변이 너무 짧아요",
        description: "좀 더 자세히 답변해주세요 (최소 10자)",
        variant: "destructive"
      });
      return;
    }

    if (!questionId || !accessToken) {
      toast({
        title: "오류가 발생했습니다",
        description: "유효하지 않은 링크입니다",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 질문에 답변 저장
      const { error } = await supabase
        .from('questions')
        .update({
          answer_text: answer.trim(),
          answered_at: new Date().toISOString(),
          status: 'answered'
        })
        .eq('id', questionId)
        .eq('parent_access_token', accessToken);

      if (error) throw error;

      toast({
        title: "답변이 전송되었습니다! 💌",
        description: "소중한 이야기를 공유해주셔서 감사해요"
      });
      
      // 답변 후 질문&답변 목록 페이지로 이동
      setTimeout(() => {
        navigate(`/conversations?t=${accessToken}`);
      }, 1500);
      
    } catch (error) {
      console.error('답변 저장 실패:', error);
      toast({
        title: "답변 전송에 실패했습니다",
        description: "다시 시도해주세요",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "음성 녹음 시작",
        description: "마이크 버튼을 다시 눌러 녹음을 완료하세요"
      });
    } else {
      toast({
        title: "녹음 완료",
        description: "음성이 텍스트로 변환됩니다"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-peach via-cream to-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-warm-coral/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-warm-coral" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              안녕하세요, {parentName}!
            </h1>
            <p className="text-warm-gray">
              오늘의 질문에 답변해주세요
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-warm-gray">
              <Clock className="w-4 h-4" />
              <span>예상 소요 시간: 2-3분</span>
            </div>
          </div>

          {/* Question Card */}
          <Card className="p-8 mb-8 border-warm-coral/20 shadow-lg">
            <div className="text-center space-y-4">
              <div className="text-sm text-warm-coral font-medium">오늘의 질문</div>
              <h2 className="text-xl lg:text-2xl font-semibold text-foreground leading-relaxed">
                {question}
              </h2>
            </div>
          </Card>

          {/* Example Answers */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              💡 이런 식으로 답변해보세요
            </h3>
            <div className="grid gap-3">
              {exampleAnswers.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="text-left p-4 bg-white rounded-lg border border-warm-coral/20 hover:border-warm-coral/40 transition-all text-warm-gray hover:text-foreground"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>

          {/* Answer Form */}
          <Card className="p-6 border-warm-coral/20 shadow-lg">
            <div className="space-y-6">
              <div>
                <label className="text-lg font-semibold text-foreground mb-4 block">
                  답변을 작성해주세요
                </label>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="자유롭게 답변해주세요. 길게 써주실수록 좋아요!"
                  className="min-h-32 text-lg border-warm-coral/30 focus:border-warm-coral resize-none"
                />
                <div className="text-right text-sm text-warm-gray mt-2">
                  {answer.length} / 500자
                </div>
              </div>

              {/* Voice Recording */}
              <div className="border-t pt-6">
                <div className="text-center">
                  <p className="text-warm-gray mb-4">
                    타이핑이 어려우시면 음성으로 답변하세요
                  </p>
                  <Button
                    variant={isRecording ? "destructive" : "soft"}
                    size="lg"
                    onClick={toggleRecording}
                    className="w-full sm:w-auto"
                  >
                    <Mic className={`w-5 h-5 mr-2 ${isRecording ? "animate-pulse" : ""}`} />
                    {isRecording ? "녹음 중... (누르면 완료)" : "음성으로 답변하기"}
                  </Button>
                </div>
              </div>

              {/* Submit */}
              <div className="border-t pt-6">
                <Button
                  variant="warm"
                  size="xl"
                  onClick={handleSubmit}
                  disabled={isSubmitting || answer.trim().length < 10}
                  className="w-full"
                >
                  {isSubmitting ? (
                    "전송 중..."
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      답변 전송하기
                    </>
                  )}
                </Button>
                
                {answer.trim().length < 10 && answer.length > 0 && (
                  <p className="text-sm text-warm-coral mt-2 text-center">
                    좀 더 자세히 답변해주세요 (최소 10자)
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Help */}
          <div className="text-center mt-8">
            <p className="text-sm text-warm-gray">
              궁금한 점이 있으시면 자녀분께 문의하세요 💕
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
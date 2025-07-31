import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Clock, Eye, Copy, Check, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { QuestionCarousel } from "./QuestionCarousel";

interface Question {
  id: string;
  question_text: string;
  answer_text?: string;
  sent_at: string;
  answered_at?: string;
  parent_access_token?: string;
}

interface QuestionListProps {
  questions: Question[];
  enableCarousel?: boolean;
}

export const QuestionList = ({ questions, enableCarousel }: QuestionListProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyAnswerLink = async (question: Question) => {
    if (!question.parent_access_token) return;
    
    const link = `${window.location.origin}/view-answer?id=${question.id}&token=${question.parent_access_token}`;
    
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(question.id);
      toast({
        title: "링크가 복사되었습니다",
        description: "부모님께 이 링크를 공유해주세요.",
      });
      
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-warm-gray mx-auto mb-4" />
        <p className="text-warm-gray">아직 질문이 없습니다.</p>
      </div>
    );
  }

  if (enableCarousel) {
    return <QuestionCarousel questions={questions} />;
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id} className="border-warm-coral/20 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-warm-gray">
                <Clock className="w-4 h-4" />
                <span>
                  {format(new Date(question.sent_at), "M월 d일", { locale: ko })}
                </span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                question.answer_text 
                  ? "bg-green-100 text-green-700" 
                  : "bg-warm-coral/20 text-warm-coral"
              }`}>
                {question.answer_text ? "답변 완료" : "답변 대기"}
              </div>
            </div>

            <div className="space-y-6">
              {/* Question */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-blue-600 font-medium mb-2">
                    💬 질문
                  </div>
                  <p className="text-foreground text-lg leading-relaxed">
                    {question.question_text}
                  </p>
                </div>
              </div>

              {/* Answer */}
              {question.answer_text && (
                <div className="flex items-start gap-4 bg-warm-coral/5 p-4 rounded-lg">
                  <div className="w-10 h-10 bg-warm-coral/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-warm-coral" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-warm-coral font-medium mb-2">
                      💕 부모님의 답변
                    </div>
                    <p className="text-foreground leading-relaxed">
                      {question.answer_text}
                    </p>
                    {question.answered_at && (
                      <div className="text-xs text-warm-gray mt-2">
                        {format(new Date(question.answered_at), "M월 d일 HH:mm", { locale: ko })}에 답변함
                      </div>
                    )}
                  </div>
                </div>
              )}

              {question.answer_text && question.parent_access_token && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyAnswerLink(question)}
                    disabled={copiedId === question.id}
                  >
                    {copiedId === question.id ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        링크 복사
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/view-answer?id=${question.id}&token=${question.parent_access_token}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    새 탭에서 보기
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
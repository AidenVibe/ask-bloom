import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Heart, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface QuestionCardProps {
  question: string;
  date: string;
  isAnswered: boolean;
  answerText?: string;
  questionId?: string;
  parentAccessToken?: string;
  onAnswer?: () => void;
  onViewAnswer?: () => void;
}

export const QuestionCard = ({ 
  question, 
  date, 
  isAnswered, 
  answerText,
  questionId,
  parentAccessToken,
  onAnswer, 
  onViewAnswer 
}: QuestionCardProps) => {
  const formattedDate = format(new Date(date), "yyyy년 M월 d일", { locale: ko });

  return (
    <Card className="p-6 border-warm-coral/20 hover:shadow-lg transition-all duration-300">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-warm-gray">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isAnswered 
              ? "bg-green-100 text-green-700" 
              : "bg-warm-coral/20 text-warm-coral"
          }`}>
            {isAnswered ? "답변 완료" : "답변 대기"}
          </div>
        </div>

        {/* Question */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-warm-coral/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-warm-coral" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground leading-relaxed">
                {question}
              </h3>
              {isAnswered && answerText && (
                <div className="mt-4 p-4 bg-warm-coral/5 rounded-lg border-l-4 border-warm-coral/30">
                  <p className="text-sm text-warm-gray mb-2">💕 부모님의 답변</p>
                  <p className="text-foreground leading-relaxed">{answerText}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="pt-2 space-y-2">
          {isAnswered ? (
            <Button 
              variant="soft" 
              size="lg" 
              onClick={onViewAnswer}
              className="w-full"
            >
              상세 보기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              variant="warm" 
              size="lg" 
              onClick={onAnswer}
              className="w-full"
            >
              답변 확인하기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          
          {/* 개발 환경용 부모 답변 링크 */}
          {questionId && parentAccessToken && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open(`/answer?q=${questionId}&t=${parentAccessToken}`, '_blank')}
              className="w-full"
            >
              🔧 부모 답변 링크 (개발용)
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// Dynamic QuestionList component that receives questions as props
interface QuestionListProps {
  questions: Array<{
    id: string;
    question_text: string;
    sent_at: string;
    answer_text?: string;
    answered_at?: string;
    status: string;
    parent_access_token?: string;
  }>;
}

export const QuestionList = ({ questions }: QuestionListProps) => {
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-warm-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-10 h-10 text-warm-coral/60" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">아직 보낸 질문이 없어요</h3>
        <p className="text-warm-gray">첫 번째 질문을 보내서 부모님과의 대화를 시작해보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          question={q.question_text}
          date={q.sent_at}
          isAnswered={!!q.answer_text}
          answerText={q.answer_text}
          questionId={q.id}
          parentAccessToken={q.parent_access_token}
          onAnswer={() => console.log(`답변 확인: ${q.id}`)}
          onViewAnswer={() => console.log(`상세 보기: ${q.id}`)}
        />
      ))}
    </div>
  );
};
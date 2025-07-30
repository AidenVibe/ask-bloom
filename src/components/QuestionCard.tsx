import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Heart, ArrowRight } from "lucide-react";

interface QuestionCardProps {
  question: string;
  date: string;
  isAnswered: boolean;
  onAnswer?: () => void;
  onViewAnswer?: () => void;
}

export const QuestionCard = ({ 
  question, 
  date, 
  isAnswered, 
  onAnswer, 
  onViewAnswer 
}: QuestionCardProps) => {
  return (
    <Card className="p-6 border-warm-coral/20 hover:shadow-lg transition-all duration-300">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-warm-gray">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
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
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="pt-2">
          {isAnswered ? (
            <Button 
              variant="soft" 
              size="lg" 
              onClick={onViewAnswer}
              className="w-full"
            >
              답변 보기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              variant="warm" 
              size="lg" 
              onClick={onAnswer}
              className="w-full"
            >
              답변하기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// 질문 목록 컴포넌트
export const QuestionList = () => {
  const questions = [
    {
      id: 1,
      question: "어머니가 가장 좋아하시는 음식은 무엇인가요?",
      date: "2024년 1월 30일",
      isAnswered: false
    },
    {
      id: 2,
      question: "아버지가 젊었을 때 가장 즐겨 들었던 음악은?",
      date: "2024년 1월 29일",
      isAnswered: true
    },
    {
      id: 3,
      question: "부모님이 처음 만났을 때의 첫인상은 어땠나요?",
      date: "2024년 1월 28일",
      isAnswered: true
    }
  ];

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          question={q.question}
          date={q.date}
          isAnswered={q.isAnswered}
          onAnswer={() => console.log("답변하기", q.id)}
          onViewAnswer={() => console.log("답변 보기", q.id)}
        />
      ))}
    </div>
  );
};
import { useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MessageCircle, Heart, Clock, Reply, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useKakaoShare } from "@/hooks/useKakaoShare";

interface QuestionCarouselProps {
  questions: any[];
}

export const QuestionCarousel = ({ questions }: QuestionCarouselProps) => {
  const navigate = useNavigate();
  const { shareToKakao } = useKakaoShare();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    align: "start",
    containScroll: "trimSnaps"
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleKakaoShare = (question: any) => {
    if (!question.parent_access_token) return;
    
    const answerUrl = `${window.location.origin}/view-answer?id=${question.id}&token=${question.parent_access_token}`;
    
    shareToKakao(question.question_text, answerUrl, "부모님");
    
    toast({
      title: "카카오톡 공유",
      description: "부모님께 카카오톡으로 공유했습니다.",
    });
  };

  const handleViewDetails = (question: any) => {
    navigate(`/view-answer?id=${question.id}&token=${question.parent_access_token}`);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-warm-gray mx-auto mb-4" />
        <p className="text-warm-gray">아직 질문이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Mobile Carousel */}
      <div className="md:hidden">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {questions.map((question) => (
              <div key={question.id} className="flex-[0_0_100%] min-w-0 pr-4">
                <Card className="border-warm-coral/20 shadow-sm">
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

                    <div className="space-y-4">
                      {/* Question */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-blue-600 font-medium mb-1">
                            질문
                          </div>
                          <p className="text-foreground leading-relaxed text-sm">
                            {question.question_text}
                          </p>
                        </div>
                      </div>

                      {/* Answer */}
                      {question.answer_text && (
                        <div className="flex items-start gap-3 bg-warm-coral/5 p-3 rounded-lg">
                          <div className="w-8 h-8 bg-warm-coral/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Heart className="w-4 h-4 text-warm-coral" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-warm-coral font-medium mb-1">
                              답변
                            </div>
                            <p className="text-foreground leading-relaxed text-sm">
                              {question.answer_text.length > 100 
                                ? `${question.answer_text.substring(0, 100)}...` 
                                : question.answer_text}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 text-xs"
                                onClick={() => handleViewDetails(question)}
                              >
                                <Reply className="w-3 h-3 mr-1" />
                                꼬리 답변하기
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Kakao Share Button - Always show if token exists */}
                      {question.parent_access_token && (
                        <div className="flex justify-center pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs"
                            onClick={() => handleKakaoShare(question)}
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            카카오톡 공유
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {questions.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={scrollPrev}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={scrollNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Desktop List */}
      <div className="hidden md:block space-y-4">
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

              <div className="space-y-4">
                {/* Question */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-blue-600 font-medium mb-2">
                      질문
                    </div>
                    <p className="text-foreground leading-relaxed">
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
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-warm-coral font-medium">
                          답변
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(question)}
                          >
                            <Reply className="w-4 h-4 mr-2" />
                            꼬리 답변하기
                          </Button>
                        </div>
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
                
                {/* Kakao Share Button - Always show if token exists */}
                {question.parent_access_token && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleKakaoShare(question)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      카카오톡 공유
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
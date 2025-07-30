import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, BookOpen } from "lucide-react";
import heroImage from "@/assets/family-hero.jpg";

export const Hero = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-peach via-cream to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm">
                <Heart className="w-5 h-5 text-warm-coral" />
                <span className="text-sm text-warm-gray font-medium">가족의 이야기를 발견하세요</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                부모님의
                <span className="text-warm-coral block">숨겨진 이야기</span>
                를 만나보세요
              </h1>
              
              <p className="text-lg text-warm-gray leading-relaxed max-w-lg">
                매일 하나의 따뜻한 질문으로 부모님과 더 깊은 대화를 나누고, 
                몰랐던 소중한 추억들을 발견해보세요.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="warm" size="xl" className="flex-1 sm:flex-none" onClick={() => window.location.href = '/onboarding'}>
                <MessageCircle className="w-5 h-5" />
                시작하기
              </Button>
              <Button variant="soft" size="xl" className="flex-1 sm:flex-none" onClick={() => window.location.href = '/dashboard'}>
                <BookOpen className="w-5 h-5" />
                데모 보기
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-warm-coral/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-warm-coral">1,200+</div>
                <div className="text-sm text-warm-gray">발견된 이야기</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warm-coral">98%</div>
                <div className="text-sm text-warm-gray">만족도</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warm-coral">500+</div>
                <div className="text-sm text-warm-gray">가족들</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="가족 이야기"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-warm-coral/20 to-transparent"></div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg max-w-xs">
              <div className="text-sm text-warm-gray mb-2">오늘의 질문</div>
              <div className="text-base font-medium text-foreground mb-3">
                "아버지가 젊었을 때 가장 좋아했던 음식은 무엇인가요?"
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-soft-peach rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-warm-coral" />
                </div>
                <span className="text-sm text-warm-gray">답변 대기 중</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
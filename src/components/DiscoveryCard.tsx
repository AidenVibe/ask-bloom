import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, Share2, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DiscoveryCardProps {
  question: string;
  answer: string;
  discovery: string;
  date: string;
  keywords: string[];
}

export const DiscoveryCard = ({
  question,
  answer,
  discovery,
  date,
  keywords
}: DiscoveryCardProps) => {
  const handleDownload = () => {
    // 실제로는 Canvas API로 이미지 생성 후 다운로드
    toast({
      title: "이미지 저장 완료",
      description: "발견 카드가 갤러리에 저장되었습니다"
    });
  };

  const handleShare = () => {
    // 실제로는 카카오톡 공유 API 호출
    toast({
      title: "공유 링크 복사됨",
      description: "카카오톡에서 가족들과 공유해보세요"
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="overflow-hidden border-warm-coral/20 shadow-xl bg-gradient-to-br from-white to-soft-peach/30">
        {/* Header */}
        <div className="bg-warm-coral text-white p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6" />
            <span className="font-bold text-lg">새로운 발견</span>
          </div>
          <div className="text-warm-coral/20 text-sm">{date}</div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Question */}
          <div>
            <div className="text-xs text-warm-gray uppercase tracking-wide mb-2">질문</div>
            <div className="text-sm text-foreground font-medium">
              {question}
            </div>
          </div>

          {/* Answer Highlight */}
          <div>
            <div className="text-xs text-warm-gray uppercase tracking-wide mb-2">답변</div>
            <div className="text-sm text-foreground leading-relaxed">
              {answer.split(' ').map((word, index) => (
                <span
                  key={index}
                  className={keywords.some(k => word.includes(k)) 
                    ? "bg-warm-coral/20 text-warm-coral font-semibold px-1 rounded" 
                    : ""
                  }
                >
                  {word}{' '}
                </span>
              ))}
            </div>
          </div>

          {/* Discovery */}
          <div className="bg-gradient-to-r from-warm-coral/10 to-accent/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-warm-coral" />
              <span className="text-xs text-warm-coral uppercase tracking-wide font-bold">
                오늘의 발견
              </span>
            </div>
            <div className="text-sm text-foreground font-medium">
              {discovery}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <div className="text-xs text-warm-gray uppercase tracking-wide mb-2">핵심 키워드</div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-warm-coral/10 text-warm-coral text-xs rounded-full font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex gap-3">
          <Button
            variant="soft"
            size="sm"
            onClick={handleDownload}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            저장
          </Button>
          <Button
            variant="warm"
            size="sm"
            onClick={handleShare}
            className="flex-1"
          >
            <Share2 className="w-4 h-4 mr-2" />
            공유
          </Button>
        </div>
      </Card>
    </div>
  );
};

// 발견 목록 컴포넌트
export const DiscoveryGallery = () => {
  const discoveries = [
    {
      id: 1,
      question: "아버지가 젊었을 때 가장 즐겨 들었던 음악은?",
      answer: "젊었을 때는 록 음악을 정말 좋아했어. 특히 신중현의 노래를 자주 들었지. 친구들과 밴드도 했었는데, 베이스를 쳤단다.",
      discovery: "아버지가 젊은 시절 밴드 활동을 하셨고, 베이스를 연주하셨다는 놀라운 사실을 발견했어요!",
      date: "2024년 1월 29일",
      keywords: ["록 음악", "신중현", "밴드", "베이스"]
    },
    {
      id: 2,
      question: "어머니가 가장 좋아하시는 음식은 무엇인가요?",
      answer: "김치찌개를 제일 좋아해. 하지만 어렸을 때는 양식을 먹고 싶어했는데, 그때는 비싸서 못 먹었지. 처음 먹은 스파게티 맛을 아직도 기억해.",
      discovery: "어머니가 어릴 때 양식을 꿈꿨고, 첫 스파게티의 맛을 지금도 기억하고 계신답니다.",
      date: "2024년 1월 28일",
      keywords: ["김치찌개", "양식", "스파게티", "어린 시절"]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">발견한 이야기들</h2>
        <p className="text-warm-gray">부모님의 소중한 이야기들을 모아봤어요</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {discoveries.map((discovery) => (
          <DiscoveryCard
            key={discovery.id}
            question={discovery.question}
            answer={discovery.answer}
            discovery={discovery.discovery}
            date={discovery.date}
            keywords={discovery.keywords}
          />
        ))}
      </div>
    </div>
  );
};
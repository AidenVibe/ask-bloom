import { Card } from "@/components/ui/card";
import { MessageSquare, Sparkles, BookHeart, Clock } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "매일 하나의 질문",
      description: "AI가 분석한 맞춤형 질문으로 자연스러운 대화를 시작하세요",
      color: "text-warm-coral"
    },
    {
      icon: Sparkles,
      title: "놀라운 발견",
      description: "부모님의 답변에서 몰랐던 소중한 이야기들을 자동으로 찾아드려요",
      color: "text-blue-500"
    },
    {
      icon: BookHeart,
      title: "추억 아카이빙",
      description: "모든 대화를 아름다운 패밀리북으로 만들어 영원히 보관하세요",
      color: "text-green-500"
    },
    {
      icon: Clock,
      title: "간편한 사용",
      description: "카카오톡으로 질문을 받고, 웹에서 바로 답변할 수 있어요",
      color: "text-purple-500"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            어떻게 작동하나요?
          </h2>
          <p className="text-lg text-warm-gray max-w-2xl mx-auto">
            간단한 4단계로 부모님과의 특별한 대화를 시작해보세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="p-6 border-warm-coral/20 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
                <div className={`w-12 h-12 rounded-lg bg-soft-peach flex items-center justify-center mb-4`}>
                  <IconComponent className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-warm-gray leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Process Flow */}
        <div className="mt-20">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-16 h-16 bg-warm-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">질문 전송</h4>
              <p className="text-warm-gray">매일 아침 부모님께 카카오톡으로 따뜻한 질문을 전송해요</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:block absolute top-8 left-1/3 w-1/3 h-0.5 bg-warm-coral/30 transform translate-y-1/2"></div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-16 h-16 bg-warm-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">쉬운 답변</h4>
              <p className="text-warm-gray">부모님은 링크를 클릭해서 간단히 답변하실 수 있어요</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:block absolute top-8 right-1/3 w-1/3 h-0.5 bg-warm-coral/30 transform translate-y-1/2"></div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-warm-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">발견과 저장</h4>
              <p className="text-warm-gray">AI가 답변을 분석해서 새로운 발견을 알려드려요</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
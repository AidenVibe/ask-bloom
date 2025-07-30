import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "김민지",
      age: "35세, 서울",
      content: "아버지가 젊은 시절 밴드 활동을 하셨다는 걸 처음 알았어요. 30년 넘게 모르고 살았던 이야기가 이렇게 많다니!",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "박준호",
      age: "42세, 부산",
      content: "어머니와의 대화가 '밥 먹었니?' 수준에서 벗어났어요. 매일 새로운 이야기를 듣는 재미가 쏠쏠합니다.",
      rating: 5,
      avatar: "👨‍💻"
    },
    {
      name: "이수진",
      age: "38세, 대구",
      content: "해외 거주 중이라 자주 못 뵙는데, 이 서비스로 부모님과 더 가까워진 느낌이에요. 패밀리북도 정말 감동적이었어요.",
      rating: 5,
      avatar: "👩‍🎓"
    }
  ];

  return (
    <section className="py-20 bg-soft-peach/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            이미 많은 가족들이 경험하고 있어요
          </h2>
          <p className="text-lg text-warm-gray">
            실제 사용자들의 생생한 후기를 들어보세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 bg-white border-warm-coral/20 hover:shadow-lg transition-all duration-300">
              <div className="mb-4">
                <Quote className="w-8 h-8 text-warm-coral/40 mb-4" />
                <p className="text-foreground leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-warm-gray">{testimonial.age}</div>
                  </div>
                </div>

                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warm-coral text-warm-coral" />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              지금 바로 시작해보세요
            </h3>
            <p className="text-warm-gray mb-6">
              첫 번째 질문은 무료로 체험할 수 있어요
            </p>
            <div className="bg-gradient-to-r from-warm-coral to-orange-400 text-white text-center py-3 px-6 rounded-lg font-semibold">
              ✨ 7일 무료 체험 가능
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
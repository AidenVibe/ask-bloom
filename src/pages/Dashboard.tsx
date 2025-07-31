import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionList } from "@/components/QuestionCard";
import { DiscoveryGallery } from "@/components/DiscoveryCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Sparkles, Settings, Calendar, Heart, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!profile) {
        navigate('/onboarding');
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-peach via-cream to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">안녕하세요, {profile.name}님!</h1>
            <p className="text-warm-gray">오늘도 부모님과 따뜻한 대화를 나눠보세요</p>
          </div>
          <Button variant="soft" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            설정
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-warm-coral/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warm-coral/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-warm-coral" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">15</div>
                <div className="text-sm text-warm-gray">총 질문</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-warm-coral/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">12</div>
                <div className="text-sm text-warm-gray">답변 완료</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-warm-coral/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">8</div>
                <div className="text-sm text-warm-gray">새로운 발견</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-warm-coral/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">7일</div>
                <div className="text-sm text-warm-gray">연속 대화</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-warm-coral/20">
            <TabsTrigger value="questions" className="data-[state=active]:bg-warm-coral data-[state=active]:text-white">
              <MessageCircle className="w-4 h-4 mr-2" />
              질문 & 답변
            </TabsTrigger>
            <TabsTrigger value="discoveries" className="data-[state=active]:bg-warm-coral data-[state=active]:text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              발견한 이야기
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground">최근 질문들</h2>
              <Button variant="warm" size="sm">
                새 질문 보내기
              </Button>
            </div>
            <QuestionList />
          </TabsContent>

          <TabsContent value="discoveries" className="space-y-6">
            <DiscoveryGallery />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-foreground mb-6">빠른 실행</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-warm-coral/20 hover:shadow-lg transition-all cursor-pointer">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-warm-coral/20 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-warm-coral" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">즉시 질문하기</h4>
                  <p className="text-sm text-warm-gray">지금 바로 새로운 질문을 보내세요</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-warm-coral/20 hover:shadow-lg transition-all cursor-pointer">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">월간 리포트</h4>
                  <p className="text-sm text-warm-gray">이번 달 대화 요약을 확인하세요</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-warm-coral/20 hover:shadow-lg transition-all cursor-pointer">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">패밀리북 생성</h4>
                  <p className="text-sm text-warm-gray">지금까지의 이야기를 책으로 만들어요</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionList } from "@/components/QuestionCard";
import { DiscoveryGallery } from "@/components/DiscoveryCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Sparkles, Settings, Calendar, Heart, TrendingUp, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    newDiscoveries: 0,
    consecutiveDays: 0
  });
  const [questions, setQuestions] = useState([]);
  const [hasQuestions, setHasQuestions] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!profile) {
        navigate('/onboarding');
      }
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (user && profile) {
      fetchQuestions();
    }
  }, [user, profile]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('child_user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setQuestions(data || []);
      setHasQuestions(data && data.length > 0);
      
      // 통계 계산
      const totalQuestions = data?.length || 0;
      const answeredQuestions = data?.filter(q => q.answer_text).length || 0;
      
      setStats({
        totalQuestions,
        answeredQuestions,
        newDiscoveries: answeredQuestions, // 간단히 답변된 질문 수로 설정
        consecutiveDays: totalQuestions > 0 ? Math.min(totalQuestions, 7) : 0
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "질문을 불러오는 중 오류가 발생했습니다",
        variant: "destructive"
      });
    }
  };

  const handleSendFirstQuestion = async () => {
    try {
      // 첫 번째 질문 생성
      const { error } = await supabase
        .from('questions')
        .insert({
          child_user_id: user?.id,
          question_text: `${profile.name}님의 첫 번째 질문: 어머니가 가장 좋아하시는 음식은 무엇인가요?`,
          status: 'sent'
        });

      if (error) throw error;

      toast({
        title: "첫 번째 질문을 전송했습니다! 📱",
        description: "부모님께 곧 질문이 전달됩니다"
      });

      fetchQuestions(); // 목록 새로고침
    } catch (error) {
      console.error('Error sending question:', error);
      toast({
        title: "질문 전송 중 오류가 발생했습니다",
        variant: "destructive"
      });
    }
  };

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

        {/* First Question CTA */}
        {!hasQuestions && (
          <Card className="p-8 mb-8 border-warm-coral/30 bg-gradient-to-r from-warm-coral/10 to-soft-peach/20">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-warm-coral/20 rounded-full flex items-center justify-center mx-auto">
                <Send className="w-10 h-10 text-warm-coral" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">첫 번째 질문을 보내보세요!</h3>
                <p className="text-warm-gray mb-6">
                  부모님과의 첫 대화를 시작해보세요. 따뜻한 질문으로 새로운 이야기를 발견할 수 있어요.
                </p>
                <Button 
                  variant="warm" 
                  size="lg"
                  onClick={handleSendFirstQuestion}
                  className="text-lg px-8 py-3"
                >
                  <Send className="w-5 h-5 mr-2" />
                  첫 질문 보내기
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-warm-coral/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warm-coral/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-warm-coral" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.totalQuestions}</div>
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
                <div className="text-2xl font-bold text-foreground">{stats.answeredQuestions}</div>
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
                <div className="text-2xl font-bold text-foreground">{stats.newDiscoveries}</div>
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
                <div className="text-2xl font-bold text-foreground">{stats.consecutiveDays}일</div>
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
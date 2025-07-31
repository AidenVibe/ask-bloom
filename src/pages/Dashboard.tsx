import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionList } from "@/components/QuestionCard";
import { QuestionSelector } from "@/components/QuestionSelector";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Settings, Calendar, Heart, TrendingUp, Send, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DevSettings } from "@/components/DevSettings";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

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
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);

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
        .select('*, parent_access_token')
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

  const handleQuestionSent = () => {
    setShowQuestionSelector(false);
    fetchQuestions(); // 목록 새로고침
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
          <Button variant="soft" size="sm" onClick={() => navigate('/settings')}>
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
                <Dialog open={showQuestionSelector} onOpenChange={setShowQuestionSelector}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="warm" 
                      size="lg"
                      className="text-lg px-8 py-3"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      첫 질문 보내기
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <QuestionSelector onQuestionSent={handleQuestionSent} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
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
        </div>

        {/* Quick Question Action */}
        <Card className="p-8 mb-8 border-warm-coral/30 bg-gradient-to-r from-warm-coral/10 to-soft-peach/20">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-warm-coral/20 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10 text-warm-coral" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">새로운 질문 보내기</h3>
              <p className="text-warm-gray mb-6">
                부모님과 따뜻한 대화를 시작해보세요. 새로운 이야기를 발견할 수 있어요.
              </p>
              <Dialog open={showQuestionSelector} onOpenChange={setShowQuestionSelector}>
                <DialogTrigger asChild>
                  <Button 
                    variant="warm" 
                    size="lg"
                    className="text-lg px-8 py-3"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    질문 보내기
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <QuestionSelector onQuestionSent={handleQuestionSent} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="space-y-6">
          {hasQuestions && (
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground">최근 질문들</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/all-conversations')}>
                전체 보기
              </Button>
            </div>
          )}
          <QuestionList questions={questions.slice(0, 5)} enableCarousel />
        </div>


        {/* 개발자 설정 */}
        <div className="mt-12">
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">🔧 디버깅 테스트</h3>
            <div className="space-y-2">
              <div>
                <Link 
                  to="/answer?q=test&t=test" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  답변 페이지 테스트 (q=test&t=test)
                </Link>
              </div>
              <div className="text-sm text-gray-600">
                ↑ 이 링크를 클릭해서 Answer 페이지가 정상적으로 로드되는지 확인해주세요
              </div>
            </div>
          </div>
          <DevSettings />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
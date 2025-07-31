import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuestionList } from "@/components/QuestionCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AllConversations = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      fetchAllQuestions();
    }
  }, [user, profile]);

  const fetchAllQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('child_user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "질문을 불러오는 중 오류가 발생했습니다",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
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
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            대시보드로 돌아가기
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">모든 대화</h1>
          <p className="text-warm-gray">지금까지 부모님과 나눈 모든 대화를 확인해보세요</p>
        </div>

        {/* Content */}
        <Card className="p-6">
          <QuestionList questions={questions} />
        </Card>
      </div>
    </div>
  );
};

export default AllConversations;
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Send, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface QuestionTemplate {
  id: string;
  question_text: string;
  category: string;
}

interface QuestionSelectorProps {
  onQuestionSent: () => void;
}

export const QuestionSelector = ({ onQuestionSent }: QuestionSelectorProps) => {
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionTemplate[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchRandomQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('question_templates')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;

      // 무작위로 3개 선택
      const shuffled = data?.sort(() => 0.5 - Math.random()) || [];
      const selected = shuffled.slice(0, 3);
      
      setSelectedQuestions(selected);
      setSelectedQuestion(""); // 새로고침 시 선택 초기화
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "질문을 불러오는 중 오류가 발생했습니다",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuestion = async () => {
    if (!selectedQuestion) {
      toast({
        title: "질문을 선택해주세요",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다");

      const { error } = await supabase
        .from('questions')
        .insert({
          child_user_id: user.id,
          question_text: selectedQuestion,
          status: 'sent'
        });

      if (error) throw error;

      toast({
        title: "질문을 전송했습니다! 📱",
        description: "부모님께 곧 질문이 전달됩니다"
      });

      onQuestionSent();
    } catch (error) {
      console.error('Error sending question:', error);
      toast({
        title: "질문 전송 중 오류가 발생했습니다",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchRandomQuestions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">
          어떤 질문을 보내드릴까요?
        </h3>
        <p className="text-warm-gray">
          부모님께 보낼 질문을 선택해보세요
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-warm-coral mx-auto mb-2" />
            <p className="text-warm-gray">질문을 불러오는 중...</p>
          </div>
        ) : (
          selectedQuestions.map((question) => (
            <Card 
              key={question.id}
              className={`p-4 cursor-pointer transition-all border-2 ${
                selectedQuestion === question.question_text
                  ? "border-warm-coral bg-warm-coral/5"
                  : "border-warm-coral/20 hover:border-warm-coral/40"
              }`}
              onClick={() => setSelectedQuestion(question.question_text)}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-warm-coral/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart className="w-4 h-4 text-warm-coral" />
                </div>
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {question.category}
                  </Badge>
                  <p className="text-foreground font-medium leading-relaxed">
                    {question.question_text}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="flex gap-3">
        <Button 
          variant="soft" 
          onClick={fetchRandomQuestions}
          disabled={loading}
          className="flex-1"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          다른 질문 보기
        </Button>
        
        <Button 
          variant="warm" 
          onClick={handleSendQuestion}
          disabled={!selectedQuestion || sending}
          className="flex-1"
        >
          <Send className="w-4 h-4 mr-2" />
          {sending ? "전송 중..." : "질문 보내기"}
        </Button>
      </div>
    </div>
  );
};
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Database, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const DevSettings = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClearMyData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.rpc('clear_user_data', {
        target_user_id: user.id
      });

      if (error) throw error;

      toast({
        title: "내 데이터가 삭제되었습니다",
        description: "다시 온보딩을 진행해주세요"
      });

      // 로그아웃 후 홈으로 이동
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error clearing user data:', error);
      toast({
        title: "데이터 삭제 실패",
        description: "오류가 발생했습니다",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllData = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('clear_all_development_data');

      if (error) throw error;

      toast({
        title: "모든 개발 데이터가 삭제되었습니다",
        description: "새로 시작할 수 있습니다"
      });

      // 로그아웃 후 홈으로 이동
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error clearing all data:', error);
      toast({
        title: "데이터 삭제 실패",
        description: "오류가 발생했습니다",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "로그아웃되었습니다"
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "로그아웃 실패",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-yellow-800 flex items-center gap-2">
          <Database className="w-5 h-5" />
          개발자 설정
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-yellow-700 mb-4">
          ⚠️ 개발 환경에서만 사용하는 기능입니다
        </div>

        <div className="grid gap-3">
          {/* 로그아웃 */}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </Button>

          {/* 내 데이터만 삭제 */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                disabled={loading}
              >
                <User className="w-4 h-4 mr-2" />
                내 데이터만 삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>내 데이터를 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  현재 계정과 관련된 모든 데이터(프로필, 질문, 답변 등)가 삭제됩니다. 
                  이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleClearMyData}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  삭제하기
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* 전체 데이터 삭제 */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full border-red-300 text-red-700 hover:bg-red-50"
                disabled={loading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                전체 데이터 삭제 (위험)
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>모든 개발 데이터를 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p className="text-red-600 font-medium">⚠️ 위험: 모든 사용자의 데이터가 삭제됩니다!</p>
                  <p>
                    데이터베이스의 모든 프로필, 질문, 답변, 관계 데이터가 완전히 삭제됩니다. 
                    이 작업은 되돌릴 수 없습니다.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleClearAllData}
                  className="bg-red-600 hover:bg-red-700"
                >
                  모든 데이터 삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
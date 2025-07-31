import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    name: "",
    role: "child" as "child" | "parent",
    phoneNumber: "",
    parentName: "",
    parentPhone: ""
  });
  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: signUpData.name,
            role: signUpData.role,
            phone_number: signUpData.phoneNumber
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            role: signUpData.role,
            name: signUpData.name,
            phone_number: signUpData.phoneNumber
          });

        if (profileError) throw profileError;

        // If child, create parent relationship
        if (signUpData.role === 'child' && signUpData.parentName && signUpData.parentPhone) {
          const { error: relationshipError } = await supabase
            .from('parent_child_relationships')
            .insert({
              child_user_id: data.user.id,
              parent_name: signUpData.parentName,
              parent_phone: signUpData.parentPhone
            });

          if (relationshipError) throw relationshipError;
        }

        toast({
          title: "계정이 생성되었습니다!",
          description: "이메일을 확인하여 계정을 활성화해주세요."
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "회원가입 오류",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password
      });

      if (error) throw error;

      toast({
        title: "로그인 성공!",
        description: "환영합니다."
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "로그인 오류",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "카카오 로그인 오류",
        description: error.message
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">엄빠뭐해</CardTitle>
          <CardDescription>
            가족과의 소중한 대화를 시작해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">로그인</TabsTrigger>
              <TabsTrigger value="signup">회원가입</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <Button 
                onClick={handleKakaoLogin} 
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                disabled={loading}
              >
                {loading ? "로그인 중..." : "카카오로 로그인"}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">또는</span>
                </div>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">이메일</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">비밀번호</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInData.password}
                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "로그인 중..." : "로그인"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">계정 유형</Label>
                  <RadioGroup
                    value={signUpData.role}
                    onValueChange={(value: "child" | "parent") => 
                      setSignUpData(prev => ({ ...prev, role: value }))
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="child" id="child" />
                      <Label htmlFor="child">자녀</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="parent" id="parent" />
                      <Label htmlFor="parent">부모</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    placeholder="홍길동"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">휴대폰 번호</Label>
                  <Input
                    id="phone"
                    placeholder="010-1234-5678"
                    value={signUpData.phoneNumber}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">이메일</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">비밀번호</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>

                {signUpData.role === 'child' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="parent-name">부모님 이름</Label>
                      <Input
                        id="parent-name"
                        placeholder="홍아빠"
                        value={signUpData.parentName}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, parentName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parent-phone">부모님 휴대폰 번호</Label>
                      <Input
                        id="parent-phone"
                        placeholder="010-9876-5432"
                        value={signUpData.parentPhone}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, parentPhone: e.target.value }))}
                        required
                      />
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "가입 중..." : "회원가입"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
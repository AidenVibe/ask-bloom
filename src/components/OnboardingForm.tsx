import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, ArrowRight, Users, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const OnboardingForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    childName: "",
    parentNickname: "",
    parentContact: "",
    interests: [] as string[],
    preferredTime: ""
  });

  const interestOptions = [
    "요리", "여행", "음악", "영화", "독서", "운동", 
    "정원 가꾸기", "낚시", "바둑/장기", "드라마", 
    "사진", "춤", "그림", "종교 활동", "봉사활동", "골프"
  ];

  const timeOptions = [
    { value: "morning", label: "오전 (9:00)" },
    { value: "afternoon", label: "오후 (14:00)" },
    { value: "evening", label: "저녁 (19:00)" }
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest].slice(0, 3) // 최대 3개
    }));
  };

  const handleNext = async () => {
    if (step === 1 && !formData.childName) {
      toast({
        title: "이름을 입력해주세요",
        variant: "destructive"
      });
      return;
    }
    if (step === 2 && (!formData.parentNickname || !formData.parentContact)) {
      toast({
        title: "부모님 정보를 입력해주세요",
        variant: "destructive"
      });
      return;
    }
    if (step === 3 && formData.interests.length === 0) {
      toast({
        title: "관심사를 최소 1개 선택해주세요",
        variant: "destructive"
      });
      return;
    }
    if (step === 4 && !formData.preferredTime) {
      toast({
        title: "선호 시간을 선택해주세요",
        variant: "destructive"
      });
      return;
    }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      // 프로필 생성
      try {
        const { error } = await supabase
          .from('profiles')
          .insert({
            user_id: user?.id,
            name: formData.childName,
            role: 'child',
            onboarding_data: {
              parentNickname: formData.parentNickname,
              parentContact: formData.parentContact,
              interests: formData.interests,
              preferredTime: formData.preferredTime
            }
          });

        if (error) throw error;

        toast({
          title: "설정이 완료되었습니다!",
          description: "내일 아침 첫 번째 질문을 전송드릴게요 💌"
        });

        // 대시보드로 이동
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (error) {
        console.error('Profile creation error:', error);
        toast({
          title: "오류가 발생했습니다",
          description: "다시 시도해주세요",
          variant: "destructive"
        });
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="w-16 h-16 text-warm-coral mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">안녕하세요!</h2>
              <p className="text-warm-gray">먼저 어떻게 불러드릴까요?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="childName" className="text-base font-medium">이름</Label>
                <Input
                  id="childName"
                  value={formData.childName}
                  onChange={(e) => setFormData(prev => ({ ...prev, childName: e.target.value }))}
                  placeholder="예: 김민지"
                  className="h-12 text-lg border-warm-coral/30 focus:border-warm-coral"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heart className="w-16 h-16 text-warm-coral mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">부모님 정보</h2>
              <p className="text-warm-gray">질문을 전송할 부모님의 정보를 입력해주세요</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="parentNickname" className="text-base font-medium">부모님 호칭</Label>
                <Input
                  id="parentNickname"
                  value={formData.parentNickname}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentNickname: e.target.value }))}
                  placeholder="예: 엄마, 아빠, 어머니, 아버지"
                  className="h-12 text-lg border-warm-coral/30 focus:border-warm-coral"
                />
              </div>
              
              <div>
                <Label htmlFor="parentContact" className="text-base font-medium">연락처</Label>
                <Input
                  id="parentContact"
                  value={formData.parentContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentContact: e.target.value }))}
                  placeholder="예: 010-1234-5678"
                  className="h-12 text-lg border-warm-coral/30 focus:border-warm-coral"
                />
                <p className="text-sm text-warm-gray mt-1">
                  카카오톡 또는 문자로 질문을 전송해드려요
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-warm-coral mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">관심사 선택</h2>
              <p className="text-warm-gray">부모님의 관심사를 선택해주세요 (최대 3개)</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    formData.interests.includes(interest)
                      ? "border-warm-coral bg-warm-coral text-white"
                      : "border-warm-coral/30 text-warm-gray hover:border-warm-coral/60"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            
            <div className="text-center text-sm text-warm-gray">
              선택됨: {formData.interests.length}/3
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-warm-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                ⏰
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">질문 시간</h2>
              <p className="text-warm-gray">언제 질문을 받고 싶으신가요?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">선호 시간</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, preferredTime: value }))}>
                  <SelectTrigger className="h-12 text-lg border-warm-coral/30">
                    <SelectValue placeholder="시간을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 요약 */}
            <div className="bg-soft-peach/50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-foreground">설정 요약</h3>
              <div className="text-sm text-warm-gray space-y-1">
                <p>• 이름: {formData.childName}</p>
                <p>• 부모님: {formData.parentNickname}</p>
                <p>• 연락처: {formData.parentContact}</p>
                <p>• 관심사: {formData.interests.join(", ")}</p>
                <p>• 질문 시간: {timeOptions.find(t => t.value === formData.preferredTime)?.label}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-peach via-cream to-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-warm-gray mb-2">
              <span>단계 {step} / 4</span>
              <span>{Math.round((step / 4) * 100)}% 완료</span>
            </div>
            <div className="w-full bg-warm-coral/20 rounded-full h-2">
              <div 
                className="bg-warm-coral h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Card */}
          <Card className="p-8 border-warm-coral/20 shadow-lg">
            {renderStep()}
            
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button
                  variant="soft"
                  size="lg"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  이전
                </Button>
              )}
              <Button
                variant="warm"
                size="lg"
                onClick={handleNext}
                className="flex-1"
              >
                {step === 4 ? "완료" : "다음"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
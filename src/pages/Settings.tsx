import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Settings as SettingsIcon, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ParentInfo {
  name: string;
  phone: string;
  relationship: string;
}

const Settings = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    childName: "",
    preferredTime: "",
    parentInfo: null as ParentInfo | null
  });

  const timeOptions = [
    { value: "morning", label: "오전 (9:00)" },
    { value: "afternoon", label: "오후 (14:00)" },
    { value: "evening", label: "저녁 (19:00)" }
  ];

  const relationshipOptions = [
    { value: "mother", label: "어머니" },
    { value: "father", label: "아버지" },
    { value: "grandmother", label: "할머니" },
    { value: "grandfather", label: "할아버지" },
    { value: "other", label: "기타" }
  ];

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!profile) {
        navigate('/onboarding');
      } else {
        loadSettings();
      }
    }
  }, [user, profile, loading, navigate]);

  const loadSettings = async () => {
    try {
      // 프로필 정보 로드
      setFormData(prev => ({
        ...prev,
        childName: profile?.name || "",
        preferredTime: (profile as any)?.preferred_time || ""
      }));

      // 부모 정보 로드
      const { data: parentRelation, error } = await supabase
        .from('parent_child_relationships')
        .select('parent_name, parent_phone, relationship')
        .eq('child_user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (parentRelation) {
        setFormData(prev => ({
          ...prev,
          parentInfo: {
            name: parentRelation.parent_name,
            phone: parentRelation.parent_phone,
            relationship: parentRelation.relationship
          }
        }));
      }
    } catch (error) {
      console.error('Settings load error:', error);
      toast({
        title: "설정을 불러오는 중 오류가 발생했습니다",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 프로필 업데이트
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.childName,
          preferred_time: formData.preferredTime
        })
        .eq('user_id', user?.id);

      if (profileError) throw profileError;

      // 부모 정보 업데이트 (있으면 업데이트, 없으면 생성)
      if (formData.parentInfo) {
        const { error: relationError } = await supabase
          .from('parent_child_relationships')
          .upsert({
            child_user_id: user?.id,
            parent_name: formData.parentInfo.name,
            parent_phone: formData.parentInfo.phone,
            relationship: formData.parentInfo.relationship
          }, {
            onConflict: 'child_user_id'
          });

        if (relationError) throw relationError;
      }

      toast({
        title: "설정이 저장되었습니다",
        description: "변경사항이 성공적으로 적용되었습니다"
      });

      // 1초 후 대시보드로 이동
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      console.error('Settings save error:', error);
      toast({
        title: "설정 저장 중 오류가 발생했습니다",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
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
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="soft"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-warm-coral" />
              설정
            </h1>
            <p className="text-warm-gray">개인 정보와 알림 설정을 관리하세요</p>
          </div>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* 자녀 정보 */}
          <Card className="p-6 border-warm-coral/20">
            <h2 className="text-xl font-semibold text-foreground mb-4">자녀 정보</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="childName" className="text-base font-medium">이름</Label>
                <Input
                  id="childName"
                  value={formData.childName}
                  onChange={(e) => setFormData(prev => ({ ...prev, childName: e.target.value }))}
                  placeholder="자녀 이름을 입력하세요"
                  className="h-12 text-lg border-warm-coral/30 focus:border-warm-coral"
                />
              </div>
            </div>
          </Card>

          {/* 부모 정보 */}
          <Card className="p-6 border-warm-coral/20">
            <h2 className="text-xl font-semibold text-foreground mb-4">부모 정보</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="parentName" className="text-base font-medium">이름</Label>
                <Input
                  id="parentName"
                  value={formData.parentInfo?.name || ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parentInfo: {
                      ...prev.parentInfo!,
                      name: e.target.value
                    }
                  }))}
                  placeholder="부모님 이름을 입력하세요"
                  className="h-12 text-lg border-warm-coral/30 focus:border-warm-coral"
                />
              </div>
              
              <div>
                <Label htmlFor="parentPhone" className="text-base font-medium">전화번호</Label>
                <Input
                  id="parentPhone"
                  value={formData.parentInfo?.phone || ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parentInfo: {
                      ...prev.parentInfo!,
                      phone: e.target.value
                    }
                  }))}
                  placeholder="010-1234-5678"
                  className="h-12 text-lg border-warm-coral/30 focus:border-warm-coral"
                />
              </div>

              <div>
                <Label className="text-base font-medium">관계</Label>
                <Select 
                  value={formData.parentInfo?.relationship || ""} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    parentInfo: {
                      ...prev.parentInfo!,
                      relationship: value
                    }
                  }))}
                >
                  <SelectTrigger className="h-12 text-lg border-warm-coral/30">
                    <SelectValue placeholder="관계를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* 발송 시간 설정 */}
          <Card className="p-6 border-warm-coral/20">
            <h2 className="text-xl font-semibold text-foreground mb-4">발송 시간</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">질문 받을 시간</Label>
                <Select 
                  value={formData.preferredTime} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, preferredTime: value }))}
                >
                  <SelectTrigger className="h-12 text-lg border-warm-coral/30">
                    <SelectValue placeholder="시간을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-warm-gray mt-2">
                  매일 설정한 시간에 새로운 질문이 전송됩니다
                </p>
              </div>
            </div>
          </Card>

          {/* 저장 버튼 */}
          <div className="flex justify-end">
            <Button
              variant="warm"
              size="lg"
              onClick={handleSave}
              disabled={saving}
              className="px-8"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "저장 중..." : "설정 저장"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
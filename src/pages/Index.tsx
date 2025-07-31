import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (profile) {
        navigate('/dashboard');
      } else {
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

  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Testimonials />
    </div>
  );
};

export default Index;

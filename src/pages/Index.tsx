
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FoundersSection from "@/components/FoundersSection";
import Dashboard from "@/components/Dashboard";
import CourseCreator from "@/components/CourseCreator";
import TutoringChatbot from "@/components/AI/TutoringChatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Features />
      <StatsSection />
      <TestimonialsSection />
      <FoundersSection />
      <Dashboard />
      <CourseCreator />
      <TutoringChatbot />
    </div>
  );
};

export default Index;

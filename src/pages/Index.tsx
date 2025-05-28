
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Dashboard from "@/components/Dashboard";
import CourseCreator from "@/components/CourseCreator";
import TutoringChatbot from "@/components/AI/TutoringChatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Features />
      <StatsSection />
      <TestimonialsSection />
      <Dashboard />
      <CourseCreator />
      <TutoringChatbot />
    </div>
  );
};

export default Index;

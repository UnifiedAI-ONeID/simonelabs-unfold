
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import MissionSection from "@/components/MissionSection";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FoundersSection from "@/components/FoundersSection";
import Dashboard from "@/components/Dashboard";
import CourseCreator from "@/components/CourseCreator";
import EnhancedTutoringChatbot from "@/components/AI/EnhancedTutoringChatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <Hero />
        <Features />
        <MissionSection />
        <StatsSection />
        <TestimonialsSection />
        <FoundersSection />
        <section className="py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4 space-y-12 lg:space-y-20">
            <Dashboard />
            <CourseCreator />
            <EnhancedTutoringChatbot />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;


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
import { lazy, Suspense } from "react";

// Lazy load non-critical components for better performance
const LazyDashboard = lazy(() => import("@/components/Dashboard"));
const LazyCourseCreator = lazy(() => import("@/components/CourseCreator"));
const LazyEnhancedTutoringChatbot = lazy(() => import("@/components/AI/EnhancedTutoringChatbot"));

// Loading component for lazy-loaded sections
const SectionLoader = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background optimized-scroll">
      {/* SEO and accessibility improvements */}
      <title>SimoneLabs - Education for Everyone, Everywhere</title>
      
      <Navigation />
      
      <main className="pt-16" role="main">
        {/* Critical above-the-fold content */}
        <Hero />
        
        {/* Progressive loading of sections */}
        <Features />
        <MissionSection />
        <StatsSection />
        <TestimonialsSection />
        <FoundersSection />
        
        {/* Lazy-loaded interactive components */}
        <section className="py-8 sm:py-12 lg:py-16" aria-label="Interactive Tools">
          <div className="container mx-auto px-4 space-y-12 lg:space-y-20">
            <Suspense fallback={<SectionLoader />}>
              <LazyDashboard />
            </Suspense>
            
            <Suspense fallback={<SectionLoader />}>
              <LazyCourseCreator />
            </Suspense>
            
            <Suspense fallback={<SectionLoader />}>
              <LazyEnhancedTutoringChatbot />
            </Suspense>
          </div>
        </section>
      </main>
      
      {/* Footer for better SEO */}
      <footer className="bg-card border-t mt-20" role="contentinfo">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 SimoneLabs. Making education accessible worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

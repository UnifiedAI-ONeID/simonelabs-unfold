
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseView from "./pages/CourseView";
import LearnCourse from "./pages/LearnCourse";
import CreateCourse from "./pages/CreateCourse";
import CourseBuilder from "./pages/CourseBuilder";
import StudyTools from "./pages/StudyTools";
import LearningAnalyticsPage from "./pages/LearningAnalytics";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import AIGenerator from "./pages/AIGenerator";
import Analytics from "./pages/Analytics";
import Pricing from "./pages/Pricing";
import Achievements from "./pages/Achievements";
import { Suspense, lazy } from "react";

// Optimized query client for web applications
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error) => {
        if (failureCount < 3) return true;
        return false;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Loading component for better UX
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <AuthProvider>
          <TooltipProvider>
            {/* Skip link for accessibility */}
            <a 
              href="#main-content" 
              className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
            >
              Skip to main content
            </a>
            
            <Toaster />
            <Sonner />
            
            <main id="main-content" className="min-h-screen">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/course/:courseId" element={<CourseView />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/learn/:courseId" element={
                    <ProtectedRoute>
                      <LearnCourse />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/create-course" element={
                    <ProtectedRoute>
                      <CreateCourse />
                    </ProtectedRoute>
                  } />
                  <Route path="/ai-generator" element={
                    <ProtectedRoute>
                      <AIGenerator />
                    </ProtectedRoute>
                  } />
                  <Route path="/analytics" element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  } />
                  <Route path="/achievements" element={
                    <ProtectedRoute>
                      <Achievements />
                    </ProtectedRoute>
                  } />
                  <Route path="/study-tools" element={
                    <ProtectedRoute>
                      <StudyTools />
                    </ProtectedRoute>
                  } />
                  <Route path="/learning-analytics" element={
                    <ProtectedRoute>
                      <LearningAnalyticsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/course-builder/:courseId" element={
                    <ProtectedRoute>
                      <CourseBuilder />
                    </ProtectedRoute>
                  } />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

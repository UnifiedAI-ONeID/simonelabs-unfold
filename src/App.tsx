
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
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
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

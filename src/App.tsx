import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SecurityProvider } from "@/components/Security/SecurityProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseView from "./pages/CourseView";
import CreateCourse from "./pages/CreateCourse";
import StudyTools from "./pages/StudyTools";
import Analytics from "./pages/Analytics";
import Achievements from "./pages/Achievements";
import VirtualLabs from "./pages/VirtualLabs";
import AIGenerator from "./pages/AIGenerator";
import CourseBuilder from "./pages/CourseBuilder";
import LearnCourse from "./pages/LearnCourse";
import LearningAnalytics from "./pages/LearningAnalytics";
import Collaboration from "./pages/Collaboration";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import CaptchaTest from "./pages/CaptchaTest";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import "./i18n";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <SecurityProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/captcha-test" element={<CaptchaTest />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute>
                      <Courses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:courseId"
                  element={
                    <ProtectedRoute>
                      <CourseView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-course"
                  element={
                    <ProtectedRoute>
                      <CreateCourse />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/study-tools"
                  element={
                    <ProtectedRoute>
                      <StudyTools />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/achievements"
                  element={
                    <ProtectedRoute>
                      <Achievements />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/virtual-labs"
                  element={
                    <ProtectedRoute>
                      <VirtualLabs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai-generator"
                  element={
                    <ProtectedRoute>
                      <AIGenerator />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/course-builder"
                  element={
                    <ProtectedRoute>
                      <CourseBuilder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learn/:courseId"
                  element={
                    <ProtectedRoute>
                      <LearnCourse />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learning-analytics/:courseId"
                  element={
                    <ProtectedRoute>
                      <LearningAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/collaboration/:courseId"
                  element={
                    <ProtectedRoute>
                      <Collaboration />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SecurityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

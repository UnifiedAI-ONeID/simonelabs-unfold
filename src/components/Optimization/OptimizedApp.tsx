
import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingFallback } from './LoadingFallback';
import { SecureHeaders } from '@/components/Security/SecureHeaders';
import { PerformanceMonitor } from '@/components/Performance/PerformanceMonitor';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';

// Lazy imports
import {
  LazySignIn,
  LazyCreateAccount,
  LazyDashboard,
  LazyStudentDashboard,
  LazyEducatorDashboard,
  LazyAdministration,
  LazyCourses,
  LazyCourseView,
  LazyAnalytics,
  LazyVirtualLabs,
  LazyStudyTools
} from './LazyComponents';

// Static imports for critical components
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import RoleSelectionPage from '@/pages/RoleSelectionPage';
import NotFound from '@/pages/NotFound';

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});

export const OptimizedApp = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="lovable-ui-theme">
          <Router>
            <SecureHeaders />
            <PerformanceMonitor />
            <div className="min-h-screen bg-background">
              <Navigation />
              <Suspense fallback={<LoadingFallback type="page" />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/signin" element={<LazySignIn />} />
                  <Route path="/create-account" element={<LazyCreateAccount />} />
                  
                  {/* Protected routes */}
                  <Route path="/role-selection" element={
                    <ProtectedRoute>
                      <RoleSelectionPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <LazyDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/student" element={
                    <ProtectedRoute requiredRole="student">
                      <LazyStudentDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/educator" element={
                    <ProtectedRoute requiredRole="educator">
                      <LazyEducatorDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/administration" element={
                    <ProtectedRoute requiredRole={["admin", "superuser"]}>
                      <LazyAdministration />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/courses" element={
                    <ProtectedRoute>
                      <LazyCourses />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/course/:id" element={
                    <ProtectedRoute>
                      <LazyCourseView />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/analytics" element={
                    <ProtectedRoute>
                      <LazyAnalytics />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/virtual-labs" element={
                    <ProtectedRoute>
                      <LazyVirtualLabs />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/study-tools" element={
                    <ProtectedRoute>
                      <LazyStudyTools />
                    </ProtectedRoute>
                  } />
                  
                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
            <Toaster />
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

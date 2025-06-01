
import { lazy } from 'react';

// Lazy load major page components
export const LazySignIn = lazy(() => import('@/pages/SignIn'));
export const LazyCreateAccount = lazy(() => import('@/pages/CreateAccount'));
export const LazyDashboard = lazy(() => import('@/pages/Dashboard'));
export const LazyStudentDashboard = lazy(() => import('@/pages/StudentDashboard'));
export const LazyEducatorDashboard = lazy(() => import('@/pages/EducatorDashboard'));
export const LazyAdministration = lazy(() => import('@/pages/Administration'));
export const LazyCourses = lazy(() => import('@/pages/Courses'));
export const LazyCourseView = lazy(() => import('@/pages/CourseView'));
export const LazyAnalytics = lazy(() => import('@/pages/Analytics'));
export const LazyVirtualLabs = lazy(() => import('@/pages/VirtualLabs'));
export const LazyStudyTools = lazy(() => import('@/pages/StudyTools'));

// Lazy load feature components
export const LazyAITutor = lazy(() => import('@/components/AI/AITutor'));
export const LazyFlashcardCreator = lazy(() => import('@/components/Flashcards/FlashcardCreator'));
export const LazyQuizGenerator = lazy(() => import('@/components/QuizGenerator/QuizGenerator'));
export const LazyDiscussionForum = lazy(() => import('@/components/Discussions/DiscussionForum'));
export const LazyVirtualLab = lazy(() => import('@/components/VirtualLabs/VirtualLab'));

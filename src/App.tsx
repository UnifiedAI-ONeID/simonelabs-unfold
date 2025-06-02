
import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import SignIn from '@/pages/SignIn';
import CreateAccount from '@/pages/CreateAccount';
import EmailVerification from '@/pages/EmailVerification';
import RoleSelectionPage from '@/pages/RoleSelectionPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import StudentDashboard from '@/pages/StudentDashboard';
import EducatorDashboard from '@/pages/EducatorDashboard';
import AdministrationDashboard from '@/pages/AdministrationDashboard';
import { useSimplifiedAuth } from '@/hooks/useSimplifiedAuth';
import { WelcomeAssistant } from '@/components/AI/WelcomeAssistant';
import { AuthDebugPanel } from '@/components/Auth/AuthDebugPanel';

const App: React.FC = () => {
  const { isAuthenticated, user } = useSimplifiedAuth();
  const [showWelcome, setShowWelcome] = React.useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !localStorage.getItem('welcomeShown')) {
      setShowWelcome(true);
      localStorage.setItem('welcomeShown', 'true');
    }
  }, [isAuthenticated, user]);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
    {
      path: "/create-account",
      element: <CreateAccount />,
    },
    {
      path: "/email-verification",
      element: <EmailVerification />,
    },
    {
      path: "/role-selection",
      element: (
        <ProtectedRoute>
          <RoleSelectionPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/student",
      element: (
        <ProtectedRoute>
          <StudentDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/educator",
      element: (
        <ProtectedRoute>
          <EducatorDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/administration",
      element: (
        <ProtectedRoute>
          <AdministrationDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <div>Dashboard</div>
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      {showWelcome && <WelcomeAssistant onClose={handleCloseWelcome} />}
      <AuthDebugPanel />
    </>
  );
};

export default App;

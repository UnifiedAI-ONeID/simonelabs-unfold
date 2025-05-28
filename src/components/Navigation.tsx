import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold gradient-text cursor-pointer" onClick={() => navigate('/')}>
              SimoneLabs
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
              <button 
                onClick={() => navigate('/courses')}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Courses
              </button>
              <button 
                onClick={() => navigate('/ai-generator')}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                AI Generator
              </button>
              <button 
                onClick={() => navigate('/analytics')}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Analytics
              </button>
              <button 
                onClick={() => navigate('/pricing')}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Pricing
              </button>
              <a href="#about" className="text-gray-600 hover:text-primary transition-colors">About</a>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-20 h-10 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.email}
                </span>
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="ghost"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={() => navigate('/create-course')}
                  variant="ghost"
                >
                  Create Course
                </Button>
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => navigate('/auth')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
            </div>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
              <button 
                onClick={() => navigate('/courses')}
                className="text-gray-600 hover:text-primary transition-colors text-left"
              >
                Courses
              </button>
              <button 
                onClick={() => navigate('/ai-generator')}
                className="text-gray-600 hover:text-primary transition-colors text-left"
              >
                AI Generator
              </button>
              <button 
                onClick={() => navigate('/analytics')}
                className="text-gray-600 hover:text-primary transition-colors text-left"
              >
                Analytics
              </button>
              <button 
                onClick={() => navigate('/pricing')}
                className="text-gray-600 hover:text-primary transition-colors text-left"
              >
                Pricing
              </button>
              <a href="#about" className="text-gray-600 hover:text-primary transition-colors">About</a>
              <div className="flex flex-col space-y-2 pt-4">
                {user ? (
                  <>
                    <Button
                      onClick={() => navigate('/dashboard')}
                      variant="ghost"
                    >
                      Dashboard
                    </Button>
                    <Button
                      onClick={() => navigate('/create-course')}
                      variant="ghost"
                    >
                      Create Course
                    </Button>
                    <Button onClick={handleSignOut} variant="outline">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost"
                      onClick={() => navigate('/auth')}
                    >
                      Sign In
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={() => navigate('/auth')}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

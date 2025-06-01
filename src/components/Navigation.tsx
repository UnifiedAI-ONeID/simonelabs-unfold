import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, signOut, user } = useEnhancedAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleDashboardClick = () => {
    if (user?.user_metadata?.role) {
      switch (user.user_metadata.role) {
        case 'student':
          navigate('/student');
          break;
        case 'educator':
          navigate('/educator');
          break;
        case 'admin':
        case 'superuser':
          navigate('/administration');
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">SimoneLabs</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/captcha-debug" className="text-sm font-medium hover:text-primary transition-colors text-orange-600">
              CAPTCHA Debug
            </Link>
            {isAuthenticated ? (
              <>
                <Button
                  onClick={handleDashboardClick}
                  variant="ghost"
                  className="text-sm font-medium"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link
                to="/pricing"
                className="text-sm font-medium hover:text-primary transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/captcha-debug"
                className="text-sm font-medium hover:text-primary transition-colors px-2 py-1 text-orange-600"
                onClick={() => setIsMenuOpen(false)}
              >
                CAPTCHA Debug
              </Link>
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={() => {
                      handleDashboardClick();
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    className="text-sm font-medium justify-start px-2"
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    className="text-sm font-medium justify-start px-2"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="default" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, Brain, BarChart3, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/60 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 gentle-hover">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-xl simonelabs-gradient-text heading">SimoneLabs</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/courses" 
              className="text-foreground/80 hover:text-foreground transition-colors font-medium gentle-hover px-3 py-2 rounded-lg hover:bg-muted/50"
            >
              Courses
            </Link>
            <Link 
              to="/pricing" 
              className="text-foreground/80 hover:text-foreground transition-colors font-medium gentle-hover px-3 py-2 rounded-lg hover:bg-muted/50"
            >
              Pricing
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="text-foreground/80 hover:text-foreground transition-colors font-medium gentle-hover px-3 py-2 rounded-lg hover:bg-muted/50"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/ai-generator" 
                  className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors font-medium gentle-hover px-3 py-2 rounded-lg hover:bg-muted/50"
                >
                  <Brain className="h-4 w-4" />
                  <span>AI Generator</span>
                </Link>
                <Link 
                  to="/analytics" 
                  className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors font-medium gentle-hover px-3 py-2 rounded-lg hover:bg-muted/50"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </Link>
                <Link 
                  to="/achievements" 
                  className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors font-medium gentle-hover px-3 py-2 rounded-lg hover:bg-muted/50"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Achievements</span>
                </Link>
                <ThemeToggle />
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="gentle-hover border-border/60 hover:bg-muted/50"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Link to="/auth">
                  <Button 
                    variant="outline" 
                    className="gentle-hover border-border/60 hover:bg-muted/50 cta-text"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="simonelabs-primary-button gentle-hover cta-text">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary gentle-hover p-2 rounded-lg hover:bg-muted/50"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border/60 rounded-b-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/courses"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Courses
              </Link>
              <Link
                to="/pricing"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/ai-generator"
                    className="flex items-center space-x-2 px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <Brain className="h-4 w-4" />
                    <span>AI Generator</span>
                  </Link>
                  <Link
                    to="/analytics"
                    className="flex items-center space-x-2 px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                  <Link
                    to="/achievements"
                    className="flex items-center space-x-2 px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <Trophy className="h-4 w-4" />
                    <span>Achievements</span>
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full mt-2 border-border hover:bg-muted cta-text"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-border hover:bg-muted cta-text">
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full simonelabs-primary-button cta-text">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

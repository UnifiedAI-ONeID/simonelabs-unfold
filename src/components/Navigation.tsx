
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, Brain, BarChart3, Trophy, Sparkles } from "lucide-react";
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
    <nav className="fixed w-full z-50 simonelabs-glass-card border-b border-border/40 shadow-lg">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 gentle-hover group">
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl simonelabs-gradient-text heading">SimoneLabs</span>
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/courses" 
              className="text-foreground/80 hover:text-primary transition-colors font-medium gentle-hover px-4 py-2 rounded-lg hover:bg-primary/10 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </Link>
            <Link 
              to="/pricing" 
              className="text-foreground/80 hover:text-primary transition-colors font-medium gentle-hover px-4 py-2 rounded-lg hover:bg-primary/10"
            >
              Pricing
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-6">
                <Link 
                  to="/dashboard" 
                  className="text-foreground/80 hover:text-primary transition-colors font-medium gentle-hover px-4 py-2 rounded-lg hover:bg-primary/10"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/ai-generator" 
                  className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors font-medium gentle-hover px-4 py-2 rounded-lg hover:bg-primary/10"
                >
                  <Brain className="h-4 w-4" />
                  <span>AI Generator</span>
                </Link>
                <Link 
                  to="/analytics" 
                  className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors font-medium gentle-hover px-4 py-2 rounded-lg hover:bg-primary/10"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </Link>
                <Link 
                  to="/achievements" 
                  className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors font-medium gentle-hover px-4 py-2 rounded-lg hover:bg-primary/10"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Achievements</span>
                </Link>
                
                <div className="flex items-center space-x-3">
                  <ThemeToggle />
                  <Button 
                    onClick={handleLogout} 
                    variant="outline" 
                    className="gentle-hover border-border/60 hover:bg-muted/50 rounded-lg"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Link to="/auth">
                  <Button 
                    variant="outline" 
                    className="gentle-hover border-border/60 hover:bg-muted/50 cta-text rounded-lg"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="simonelabs-primary-button cta-text rounded-lg">
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
              className="text-foreground hover:text-primary gentle-hover p-2 rounded-lg hover:bg-primary/10"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden simonelabs-glass-card mt-2 rounded-2xl border border-border/40 shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-3">
              <Link
                to="/courses"
                className="flex items-center gap-3 px-4 py-3 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-primary/10"
                onClick={() => setIsOpen(false)}
              >
                <BookOpen className="h-5 w-5" />
                <span>Courses</span>
              </Link>
              <Link
                to="/pricing"
                className="block px-4 py-3 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-primary/10"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-3 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-primary/10"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/ai-generator"
                    className="flex items-center space-x-3 px-4 py-3 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-primary/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <Brain className="h-5 w-5" />
                    <span>AI Generator</span>
                  </Link>
                  <Link
                    to="/analytics"
                    className="flex items-center space-x-3 px-4 py-3 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-primary/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>Analytics</span>
                  </Link>
                  <Link
                    to="/achievements"
                    className="flex items-center space-x-3 px-4 py-3 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-primary/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <Trophy className="h-5 w-5" />
                    <span>Achievements</span>
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full mt-4 border-border hover:bg-muted cta-text rounded-lg"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <div className="space-y-3 pt-4 border-t border-border/40">
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-border hover:bg-muted cta-text rounded-lg">
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full simonelabs-primary-button cta-text rounded-lg">
                      Sign Up
                    </Button>
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

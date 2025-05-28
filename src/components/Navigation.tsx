
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, Brain, BarChart3, Trophy, Sparkles, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'simonelabs-glass-card border-b border-border/60 shadow-xl backdrop-blur-xl' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between h-16 sm:h-18">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 gentle-hover group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-primary/20">
                <BookOpen className="h-7 w-7 text-primary group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-2xl simonelabs-gradient-text heading">SimoneLabs</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-5 h-5 text-accent animate-pulse-slow" />
                  <span className="text-xs bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text font-bold">AI</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu - Enhanced */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link 
              to="/courses" 
              className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-all duration-300 font-medium gentle-hover px-4 py-2 rounded-xl hover:bg-primary/10 group"
            >
              <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Courses</span>
            </Link>
            <Link 
              to="/pricing" 
              className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium gentle-hover px-4 py-2 rounded-xl hover:bg-primary/10"
            >
              Pricing
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-all duration-300 font-medium gentle-hover px-4 py-2 rounded-xl hover:bg-primary/10 group"
                >
                  <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/ai-generator" 
                  className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-all duration-300 font-medium gentle-hover px-4 py-2 rounded-xl hover:bg-primary/10 group"
                >
                  <Brain className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>AI Generator</span>
                </Link>
                <Link 
                  to="/analytics" 
                  className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-all duration-300 font-medium gentle-hover px-4 py-2 rounded-xl hover:bg-primary/10 group"
                >
                  <BarChart3 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Analytics</span>
                </Link>
                <Link 
                  to="/achievements" 
                  className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-all duration-300 font-medium gentle-hover px-4 py-2 rounded-xl hover:bg-primary/10 group"
                >
                  <Trophy className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Achievements</span>
                </Link>
                
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-border/40">
                  <ThemeToggle />
                  <Button 
                    onClick={handleLogout} 
                    variant="outline" 
                    className="gentle-hover border-border/60 hover:bg-muted/50 rounded-xl group flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                <ThemeToggle />
                <Link to="/auth">
                  <Button 
                    variant="outline" 
                    className="gentle-hover border-border/60 hover:bg-muted/50 cta-text rounded-xl"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="simonelabs-primary-button cta-text rounded-xl shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Enhanced */}
          <div className="lg:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary gentle-hover p-3 rounded-xl hover:bg-primary/10 transition-all duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Enhanced */}
        {isOpen && (
          <div className="lg:hidden simonelabs-glass-card mt-4 rounded-3xl border border-border/60 shadow-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-8 space-y-2">
              <Link
                to="/courses"
                className="flex items-center gap-4 px-4 py-4 text-foreground hover:text-primary transition-all duration-300 font-medium rounded-2xl hover:bg-primary/10 group"
                onClick={() => setIsOpen(false)}
              >
                <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Courses</span>
              </Link>
              <Link
                to="/pricing"
                className="block px-4 py-4 text-foreground hover:text-primary transition-all duration-300 font-medium rounded-2xl hover:bg-primary/10"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              
              {user ? (
                <>
                  <div className="border-t border-border/40 my-4"></div>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-4 px-4 py-4 text-foreground hover:text-primary transition-all duration-300 font-medium rounded-2xl hover:bg-primary/10 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/ai-generator"
                    className="flex items-center gap-4 px-4 py-4 text-foreground hover:text-primary transition-all duration-300 font-medium rounded-2xl hover:bg-primary/10 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <Brain className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span>AI Generator</span>
                  </Link>
                  <Link
                    to="/analytics"
                    className="flex items-center gap-4 px-4 py-4 text-foreground hover:text-primary transition-all duration-300 font-medium rounded-2xl hover:bg-primary/10 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <BarChart3 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span>Analytics</span>
                  </Link>
                  <Link
                    to="/achievements"
                    className="flex items-center gap-4 px-4 py-4 text-foreground hover:text-primary transition-all duration-300 font-medium rounded-2xl hover:bg-primary/10 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <Trophy className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span>Achievements</span>
                  </Link>
                  <div className="border-t border-border/40 my-4"></div>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full mt-4 border-border hover:bg-muted cta-text rounded-xl flex items-center gap-3 justify-center py-4"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <div className="space-y-3 pt-6 border-t border-border/40">
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-border hover:bg-muted cta-text rounded-xl py-4">
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full simonelabs-primary-button cta-text rounded-xl py-4 shadow-lg">
                      Get Started
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

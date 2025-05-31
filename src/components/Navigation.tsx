import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, Brain, BarChart3, Trophy, Sparkles, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SecurityNotifications } from "@/components/Security/SecurityNotifications";
import { useTranslation } from "react-i18next";
import { useUserRoles } from "@/hooks/useUserRoles";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { isSuperuser } = useUserRoles();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'simonelabs-glass-card border-b border-border/60 shadow-xl backdrop-blur-xl' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-18">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 gentle-hover group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-primary/20">
                <BookOpen className="h-4 w-4 sm:h-5 sm:h-5 lg:h-7 lg:w-7 text-primary group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="font-bold text-lg sm:text-xl lg:text-2xl simonelabs-gradient-text heading">SimoneLabs</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-accent animate-pulse-slow" />
                  <span className="text-xs bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text font-bold">AI</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link 
              to="/courses" 
              className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-all duration-300 font-medium gentle-hover px-3 py-2 rounded-xl hover:bg-primary/10 group"
            >
              <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm">{t('navigation.courses')}</span>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-all duration-300 font-medium gentle-hover px-3 py-2 rounded-xl hover:bg-primary/10 group"
                >
                  <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">{t('navigation.dashboard')}</span>
                </Link>
                
                {isSuperuser && (
                  <Link 
                    to="/administration" 
                    className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-all duration-300 font-medium gentle-hover px-3 py-2 rounded-xl hover:bg-primary/10 group"
                  >
                    <Settings className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Administration</span>
                  </Link>
                )}
                
                <div className="flex items-center space-x-2 ml-3 pl-3 border-l border-border/40">
                  <SecurityNotifications />
                  <LanguageSwitcher />
                  <ThemeToggle />
                  <Button 
                    onClick={handleLogout} 
                    variant="outline" 
                    size="sm"
                    className="gentle-hover border-border/60 hover:bg-muted/50 rounded-xl group flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">{t('navigation.logout')}</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <LanguageSwitcher />
                <ThemeToggle />
                <Link to="/auth">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gentle-hover border-border/60 hover:bg-muted/50 rounded-xl text-sm"
                  >
                    {t('navigation.login')}
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button 
                    size="sm"
                    className="simonelabs-primary-button rounded-xl shadow-lg text-sm"
                  >
                    {t('navigation.signup')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-2">
              {user && <SecurityNotifications />}
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary gentle-hover p-2 rounded-xl hover:bg-primary/10 transition-all duration-300"
            >
              {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden simonelabs-glass-card mt-4 rounded-2xl sm:rounded-3xl border border-border/60 shadow-2xl overflow-hidden">
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-6 sm:pb-8 space-y-2">
              <Link
                to="/courses"
                className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 text-foreground hover:text-primary transition-all duration-300 font-medium rounded-xl sm:rounded-2xl hover:bg-primary/10 group"
                onClick={() => setIsOpen(false)}
              >
                <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>{t('navigation.courses')}</span>
              </Link>
              
              {user ? (
                <>
                  <div className="border-t border-border/40 my-3 sm:my-4"></div>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 text-foreground hover:text-primary transition-all duration-300 font-medium rounded-xl sm:rounded-2xl hover:bg-primary/10 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span>{t('navigation.dashboard')}</span>
                  </Link>
                  <Link
                    to="/security"
                    className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 text-foreground hover:text-primary transition-all duration-300 font-medium rounded-xl sm:rounded-2xl hover:bg-primary/10 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span>Security Dashboard</span>
                  </Link>
                  {isSuperuser && (
                    <Link
                      to="/administration"
                      className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 text-foreground hover:text-primary transition-all duration-300 font-medium rounded-xl sm:rounded-2xl hover:bg-primary/10 group"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span>Administration</span>
                    </Link>
                  )}
                  <div className="border-t border-border/40 my-3 sm:my-4"></div>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full mt-2 sm:mt-4 border-border hover:bg-muted rounded-xl flex items-center gap-3 justify-center py-3 sm:py-4 h-auto"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('navigation.logout')}</span>
                  </Button>
                </>
              ) : (
                <div className="space-y-3 pt-4 sm:pt-6 border-t border-border/40">
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full border-border hover:bg-muted rounded-xl py-3 sm:py-4 h-auto"
                    >
                      {t('navigation.login')}
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button 
                      className="w-full simonelabs-primary-button rounded-xl py-3 sm:py-4 shadow-lg h-auto"
                    >
                      {t('navigation.signup')}
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

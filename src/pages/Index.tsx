import Navigation from "@/components/Navigation";
import RoleSelection from "@/components/RoleSelection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { WelcomeAssistant } from "@/components/AI/WelcomeAssistant";
import { useState, useEffect } from "react";

const Index = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useEnhancedAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show welcome assistant for new users
    if (isAuthenticated && user) {
      const hasSeenWelcome = localStorage.getItem(`welcome_shown_${user.id}`);
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, [isAuthenticated, user]);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    if (user) {
      localStorage.setItem(`welcome_shown_${user.id}`, 'true');
    }
  };

  const founders = [
    {
      name: "Fiona Wong",
      role: "Co-Founder & CEO",
      bio: "Former EdTech executive with 15 years of experience in educational innovation. Fiona's vision for accessible education drives SimoneLabs' mission to democratize learning globally.",
      image: "https://i.pinimg.com/originals/77/71/68/7771683223d86b237a3304d6f32828b9.jpg",
      fallback: "FW"
    },
    {
      name: "Simon Luke",
      role: "Co-Founder & CTO",
      bio: "AI and machine learning expert with a PhD in Educational Technology. Simon's innovative approach to adaptive learning systems forms the technological foundation of SimoneLabs.",
      image: "https://images.unsplash.com/photo-1487309078313-fad80c3ec1e5?w=150&h=150&fit=crop&crop=face",
      fallback: "SL"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {showWelcome && <WelcomeAssistant onClose={handleCloseWelcome} />}
      
      <main className="relative pt-14 sm:pt-16 lg:pt-18">
        {/* Hero Section */}
        <section className="min-h-[80vh] sm:min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-primary/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-accent/20 rounded-full blur-3xl animate-gentle-bounce"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10 space-y-8 sm:space-y-12">
            <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-foreground">{t('hero.title')}</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('hero.subtitle')}
              </p>

              <div className="flex justify-center gap-4 pt-4">
                {isAuthenticated ? (
                  <Link to={user?.user_metadata?.role ? "/dashboard" : "/role-selection"}>
                    <Button className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto rounded-xl group">
                      <span>Go to Dashboard</span>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Link to="/create-account">
                      <Button className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto rounded-xl group">
                        <span>Create Account</span>
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link to="/signin">
                      <Button variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto rounded-xl">
                        <span>Sign In</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              <div className="text-center space-y-3 sm:space-y-4 p-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-primary/20">
                  <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">{t('features.adaptiveLearning.title')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t('features.adaptiveLearning.description')}
                </p>
              </div>
              
              <div className="text-center space-y-3 sm:space-y-4 p-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-accent/20">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">{t('features.expertCommunity.title')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t('features.expertCommunity.description')}
                </p>
              </div>
              
              <div className="text-center space-y-3 sm:space-y-4 p-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-border">
                  <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">{t('features.globalAccess.title')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t('features.globalAccess.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {!isAuthenticated && <RoleSelection />}

        {/* Founders Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Meet Our Founders
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto">
              {founders.map((founder, index) => (
                <div key={index} className="text-center space-y-4 sm:space-y-6 p-4">
                  <div className="flex justify-center">
                    <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                      <AvatarImage 
                        src={founder.image} 
                        alt={founder.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-lg sm:text-2xl font-bold bg-primary text-primary-foreground">
                        {founder.fallback}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">{founder.name}</h3>
                    <p className="text-base sm:text-lg font-medium text-primary">{founder.role}</p>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
                      {founder.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t py-6 sm:py-8" role="contentinfo">
          <div className="container mx-auto px-4">
            <div className="text-center text-muted-foreground">
              <p className="text-sm sm:text-base">&copy; 2024 SimoneLabs. Making education accessible worldwide.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;

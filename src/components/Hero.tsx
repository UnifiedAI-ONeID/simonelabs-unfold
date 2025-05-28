
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, BookOpen, Sparkles, Users, Award, Star, CheckCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced background with sophisticated gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/15 via-transparent to-transparent"></div>
      </div>
      
      {/* Enhanced floating elements with staggered animations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/40 to-accent/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-accent/40 to-secondary/30 rounded-full blur-3xl animate-gentle-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-secondary/50 to-primary/30 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-gradient-to-br from-primary/35 to-accent/25 rounded-full blur-2xl animate-gentle-bounce" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-accent/40 to-secondary/30 rounded-full blur-xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto container-padding text-center relative z-10">
        <div className="max-w-6xl mx-auto space-y-10 fade-in-up">
          {/* Enhanced floating badge with premium styling */}
          <div className="inline-flex items-center gap-4 simonelabs-glass-card rounded-full px-8 py-4 text-sm font-medium gentle-hover group border border-primary/20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
              <Star className="w-4 h-4 text-primary" />
            </div>
            <span className="text-foreground/90 font-semibold">AI-Powered Learning Platform</span>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-accent animate-pulse-slow" />
              <span className="text-xs text-accent font-bold">NEW</span>
            </div>
          </div>

          {/* Enhanced main heading with sophisticated typography */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight">
              <span className="block simonelabs-gradient-text">Transform Your</span>
              <span className="block text-foreground mt-2">Learning Journey</span>
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-muted-foreground mt-4 font-medium">
                with AI Intelligence
              </span>
            </h1>
            
            <div className="flex justify-center items-center gap-4 mt-8">
              <div className="flex items-center gap-2 simonelabs-glass-card px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="text-sm text-foreground/80">Trusted by 10,000+ learners</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-warning fill-warning" />
                ))}
                <span className="text-sm text-foreground/80 ml-2">4.9/5 rating</span>
              </div>
            </div>
          </div>

          {/* Enhanced description with better formatting */}
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground leading-relaxed font-light">
              Experience the future of education with our revolutionary AI-powered platform. 
              Create personalized courses, track your progress with precision, and achieve your learning goals 
              faster than ever before.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="flex items-center justify-center gap-3 simonelabs-glass-card p-4 rounded-xl gentle-hover">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium">Instant AI Generation</span>
              </div>
              <div className="flex items-center justify-center gap-3 simonelabs-glass-card p-4 rounded-xl gentle-hover">
                <BookOpen className="w-5 h-5 text-secondary" />
                <span className="text-foreground font-medium">Interactive Learning</span>
              </div>
              <div className="flex items-center justify-center gap-3 simonelabs-glass-card p-4 rounded-xl gentle-hover">
                <Award className="w-5 h-5 text-accent" />
                <span className="text-foreground font-medium">Achievement System</span>
              </div>
            </div>
          </div>

          {/* Enhanced CTA section with multiple options */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Link to="/auth">
              <Button size="lg" className="simonelabs-primary-button text-lg px-10 py-6 h-auto rounded-2xl group shadow-2xl">
                <span className="font-bold">Start Learning Today</span>
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="gentle-hover text-lg px-10 py-6 h-auto rounded-2xl border-2 border-border/60 simonelabs-glass-card group hover:border-primary/30"
            >
              <Play className="mr-3 h-6 w-6 group-hover:scale-125 transition-transform duration-300" />
              <span className="font-semibold">Watch Demo</span>
            </Button>

            <div className="text-sm text-muted-foreground">
              <span>No credit card required • </span>
              <span className="text-primary font-medium">Free trial available</span>
            </div>
          </div>

          {/* Enhanced trust indicators with sophisticated layout */}
          <div className="pt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-4 simonelabs-glass-card p-8 rounded-2xl gentle-hover group border border-primary/10">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground heading mb-1">10K+</div>
                <div className="text-muted-foreground font-medium">Active Learners</div>
                <div className="text-xs text-primary mt-1">Growing daily</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4 simonelabs-glass-card p-8 rounded-2xl gentle-hover group border border-secondary/10">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8 text-secondary" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground heading mb-1">4.9/5</div>
                <div className="text-muted-foreground font-medium">User Rating</div>
                <div className="text-xs text-secondary mt-1">Highly rated</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4 simonelabs-glass-card p-8 rounded-2xl gentle-hover group border border-accent/10">
              <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground heading mb-1">500+</div>
                <div className="text-muted-foreground font-medium">Courses Available</div>
                <div className="text-xs text-accent mt-1">Always expanding</div>
              </div>
            </div>
          </div>

          {/* New testimonial preview section */}
          <div className="pt-16 max-w-3xl mx-auto">
            <div className="simonelabs-glass-card p-8 rounded-3xl border border-primary/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">Data Scientist at Google</div>
                </div>
                <div className="flex items-center gap-1 ml-auto">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning fill-warning" />
                  ))}
                </div>
              </div>
              <p className="text-foreground/90 italic leading-relaxed">
                "SimoneLabs transformed my learning experience. The AI-powered recommendations 
                helped me master machine learning concepts faster than I ever thought possible."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

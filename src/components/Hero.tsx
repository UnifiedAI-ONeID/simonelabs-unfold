
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, BookOpen, Sparkles, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10"></div>
      
      {/* Floating elements with improved animations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/30 rounded-full blur-3xl animate-gentle-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary/40 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-primary/25 rounded-full blur-2xl animate-gentle-bounce" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="container mx-auto container-padding text-center relative z-10">
        <div className="max-w-5xl mx-auto space-y-8 fade-in-up">
          {/* Enhanced badge */}
          <div className="inline-flex items-center gap-3 simonelabs-glass-card rounded-full px-6 py-3 text-sm font-medium gentle-hover">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-foreground/80">AI-Powered Learning Platform</span>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>

          {/* Main heading with enhanced typography */}
          <h1 className="responsive-heading simonelabs-gradient-text leading-tight tracking-tight">
            Transform Your Learning
            <br />
            <span className="text-foreground">Journey with AI</span>
          </h1>

          {/* Enhanced subheading */}
          <p className="responsive-body text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the future of education with our AI-powered platform. 
            Create personalized courses, track your progress, and achieve your learning goals 
            faster than ever before with intelligent recommendations.
          </p>

          {/* Enhanced CTA section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link to="/auth">
              <Button size="lg" className="simonelabs-primary-button text-base px-8 py-4 h-auto rounded-xl group">
                <span>Start Learning Today</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="gentle-hover text-base px-8 py-4 h-auto rounded-xl border-border/60 simonelabs-glass-card group"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Watch Demo</span>
            </Button>
          </div>

          {/* Enhanced trust indicators */}
          <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-3 simonelabs-glass-card p-6 rounded-xl gentle-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground heading">10K+</div>
                <div className="text-sm text-muted-foreground">Active Learners</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-3 simonelabs-glass-card p-6 rounded-xl gentle-hover">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground heading">4.9/5</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-3 simonelabs-glass-card p-6 rounded-xl gentle-hover">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground heading">500+</div>
                <div className="text-sm text-muted-foreground">Courses</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

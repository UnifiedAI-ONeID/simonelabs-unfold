
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
      {/* Soft background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl animate-gentle-bounce"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary rounded-full blur-2xl animate-gentle-bounce" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-muted/50 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>AI-Powered Learning Platform</span>
          </div>

          {/* Main heading */}
          <h1 className="responsive-heading simonelabs-gradient-text leading-tight">
            Transform Your Learning Journey with AI
          </h1>

          {/* Subheading */}
          <p className="responsive-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience personalized education powered by artificial intelligence. 
            Create courses, track progress, and achieve your learning goals faster than ever before.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/auth">
              <Button size="lg" className="simonelabs-primary-button gentle-hover w-full sm:w-auto text-base px-8 py-3">
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="gentle-hover w-full sm:w-auto text-base px-8 py-3 border-border/60 bg-background/50 backdrop-blur-sm hover:bg-muted/50"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>10,000+ Active Learners</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>4.9/5 Average Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>500+ Courses Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

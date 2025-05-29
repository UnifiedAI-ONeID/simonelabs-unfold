
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
      {/* Subtle background decoration using your colors */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-gentle-bounce"></div>
      </div>
      
      <div className="container mx-auto container-padding text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-12 fade-in-up">
          
          {/* Main heading */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="block text-foreground">Education for Everyone,</span>
              <span className="block simonelabs-gradient-text mt-2">Everywhere</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              SimoneLabs is revolutionizing learning by making quality education accessible, adaptive, and engaging for learners of all ages and backgrounds.
            </p>
          </div>

          {/* CTA Button using accent color */}
          <div className="flex justify-center">
            <Link to="/auth">
              <Button className="simonelabs-accent-button text-lg px-8 py-4 h-auto rounded-xl group shadow-lg">
                <span className="font-semibold">Start Learning Now</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>

          {/* Three feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Adaptive Learning</h3>
              <p className="text-muted-foreground">
                Content that adjusts to your learning style, pace, and comprehension level for a personalized learning experience.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-secondary/20">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Collaborative Community</h3>
              <p className="text-muted-foreground">
                Join study groups, share knowledge, and learn together with peers from around the world.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent/20">
                <Globe className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Global Access</h3>
              <p className="text-muted-foreground">
                Quality education available to everyone, regardless of location or background.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

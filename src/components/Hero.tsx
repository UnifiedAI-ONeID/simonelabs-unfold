
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/20"></div>
      
      <div className="container mx-auto container-padding text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-12 fade-in-up">
          
          {/* Main heading - matching reference design */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="block text-foreground">Education for Everyone,</span>
              <span className="block simonelabs-gradient-text mt-2">Everywhere</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              SimoneLabs is revolutionizing learning by making quality education accessible, adaptive, and engaging for learners of all ages and backgrounds.
            </p>
          </div>

          {/* CTA Button - matching reference style */}
          <div className="flex justify-center">
            <Link to="/auth">
              <Button size="lg" className="simonelabs-primary-button text-lg px-8 py-4 h-auto rounded-xl group shadow-lg">
                <span className="font-semibold">Start Learning Now</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>

          {/* Three feature highlights - matching reference layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Adaptive Learning</h3>
              <p className="text-muted-foreground">
                Content that adjusts to your learning style, pace, and comprehension level for a personalized learning experience.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Collaborative Community</h3>
              <p className="text-muted-foreground">
                Join study groups, share knowledge, and learn together with peers from around the world.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
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

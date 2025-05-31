import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-gentle-bounce"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10 space-y-12">
            <div className="space-y-6 max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                <span className="block text-foreground">Education for Everyone,</span>
                <span className="block gradient-text mt-2">Everywhere</span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Transform your learning experience with AI-powered education that adapts to your needs
              </p>

              <div className="flex justify-center gap-4">
                <Link to="/auth">
                  <Button className="btn-primary text-lg px-8 py-4 h-auto rounded-xl group">
                    <span>Start Learning Now</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Adaptive Learning</h3>
                <p className="text-muted-foreground">
                  AI-powered content that adapts to your learning style and pace
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent/20">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Expert Community</h3>
                <p className="text-muted-foreground">
                  Learn together with peers and expert instructors
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
                  <Globe className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Global Access</h3>
                <p className="text-muted-foreground">
                  Quality education available anytime, anywhere
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t py-8" role="contentinfo">
          <div className="container mx-auto px-4">
            <div className="text-center text-muted-foreground">
              <p>&copy; 2024 SimoneLabs. Making education accessible worldwide.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
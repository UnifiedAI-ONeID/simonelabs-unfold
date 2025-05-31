import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Index = () => {
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

        {/* Founders Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                Meet Our Founders
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {founders.map((founder, index) => (
                <div key={index} className="text-center space-y-6">
                  <div className="flex justify-center">
                    <Avatar className="w-32 h-32">
                      <AvatarImage 
                        src={founder.image} 
                        alt={founder.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                        {founder.fallback}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">{founder.name}</h3>
                    <p className="text-lg font-medium text-primary">{founder.role}</p>
                    <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                      {founder.bio}
                    </p>
                  </div>
                </div>
              ))}
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
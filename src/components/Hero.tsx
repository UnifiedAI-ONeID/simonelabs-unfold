
import { Button } from "@/components/ui/button";
import { ArrowDown, Star, Users, Video } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full opacity-20 animate-float"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-accent/20 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-40 left-20 w-16 h-16 bg-secondary/20 rounded-full opacity-20 animate-float" style={{animationDelay: '4s'}}></div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-8">
            <Star className="w-4 h-4 mr-2" />
            #1 AI-Powered Learning Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-foreground">
            The Future of
            <span className="gradient-text block">AI-Enhanced Learning</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            Create, personalize, and deliver world-class courses with cutting-edge AI tools, 
            immersive XR experiences, and comprehensive analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4 h-auto"
            >
              Start Creating Courses
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 h-auto"
            >
              <Video className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">10M+</div>
                <div className="text-muted-foreground">Active Learners</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">50K+</div>
                <div className="text-muted-foreground">Courses Created</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">4.9/5</div>
                <div className="text-muted-foreground">User Rating</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

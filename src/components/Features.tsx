
import { Brain, Target, Users, Zap, BookOpen, BarChart3, Sparkles, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalized learning paths adapted to your unique pace, style, and goals with advanced machine learning.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Target,
      title: "Smart Goal Tracking",
      description: "Set and achieve learning objectives with intelligent progress monitoring and adaptive milestones.",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Connect with peers, join study groups, and learn together in our vibrant community platform.",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: Zap,
      title: "Quick Creation",
      description: "Generate comprehensive courses and interactive quizzes instantly with our advanced AI assistance.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: BookOpen,
      title: "Rich Interactive Content",
      description: "Engage with multimedia lessons, real-world examples, and hands-on exercises for deeper learning.",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get detailed insights into your learning progress, performance patterns, and improvement areas.",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: Sparkles,
      title: "AI Recommendations",
      description: "Receive personalized course suggestions and learning resources based on your interests and progress.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your learning data is protected with enterprise-grade security and complete privacy controls.",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    }
  ];

  return (
    <section className="section-padding bg-muted/20">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-16 lg:mb-20 space-y-6 fade-in-up">
          <div className="inline-flex items-center gap-2 simonelabs-glass-card rounded-full px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Powerful Features</span>
          </div>
          
          <h2 className="responsive-heading text-foreground max-w-4xl mx-auto">
            Everything You Need to 
            <span className="simonelabs-gradient-text"> Excel in Learning</span>
          </h2>
          
          <p className="responsive-body text-muted-foreground max-w-3xl mx-auto">
            Discover powerful features designed to enhance your learning experience
            and help you achieve your educational goals with cutting-edge AI technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="simonelabs-glass-card gentle-hover border-border/40 rounded-2xl group overflow-hidden"
              style={{animationDelay: `${index * 100}ms`}}
            >
              <CardHeader className="pb-4">
                <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground heading group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced call-to-action section */}
        <div className="mt-20 text-center">
          <div className="simonelabs-glass-card p-8 lg:p-12 rounded-3xl max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 heading">
              Ready to Transform Your Learning?
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Join thousands of learners who are already achieving their goals with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="simonelabs-primary-button px-8 py-4 rounded-xl text-base font-semibold">
                Start Free Trial
              </button>
              <button className="simonelabs-glass-card border border-border/60 px-8 py-4 rounded-xl text-base font-semibold text-foreground hover:bg-muted/50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

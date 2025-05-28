
import { Brain, Target, Users, Zap, BookOpen, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalized learning paths adapted to your pace and style",
      color: "text-primary"
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set and achieve learning objectives with smart progress monitoring",
      color: "text-secondary"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Connect with peers and learn together in study groups",
      color: "text-accent"
    },
    {
      icon: Zap,
      title: "Quick Creation",
      description: "Generate courses and quizzes instantly with AI assistance",
      color: "text-blue-primary-500"
    },
    {
      icon: BookOpen,
      title: "Rich Content",
      description: "Interactive lessons with multimedia and real-world examples",
      color: "text-purple-accent-500"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Detailed insights into your learning progress and performance",
      color: "text-indigo-secondary-500"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16 space-y-4">
          <h2 className="responsive-heading text-foreground">
            Everything You Need to Learn
          </h2>
          <p className="responsive-body text-muted-foreground max-w-2xl mx-auto">
            Discover powerful features designed to enhance your learning experience
            and help you achieve your educational goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="simonelabs-glass-card gentle-hover border-border/40 rounded-xl"
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 bg-muted/60 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg font-semibold text-foreground heading">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

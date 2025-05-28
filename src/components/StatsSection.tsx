
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Star, Trophy, TrendingUp, Award } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "15K+",
      label: "Active Students",
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Learning daily"
    },
    {
      icon: BookOpen,
      value: "750+",
      label: "Courses",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      description: "Available now"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Rating",
      color: "text-accent",
      bgColor: "bg-accent/10",
      description: "From students"
    },
    {
      icon: Trophy,
      value: "98%",
      label: "Success Rate",
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Course completion"
    },
    {
      icon: TrendingUp,
      value: "2.5M+",
      label: "Study Hours",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      description: "This month"
    },
    {
      icon: Award,
      value: "45K+",
      label: "Certificates",
      color: "text-accent",
      bgColor: "bg-accent/10",
      description: "Awarded"
    }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-16 lg:mb-20 space-y-6 fade-in-up">
          <div className="inline-flex items-center gap-2 simonelabs-glass-card rounded-full px-4 py-2 text-sm font-medium">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Growing Community</span>
          </div>
          
          <h2 className="responsive-heading text-foreground max-w-4xl mx-auto">
            Trusted by
            <span className="simonelabs-gradient-text"> Thousands Worldwide</span>
          </h2>
          
          <p className="responsive-body text-muted-foreground max-w-2xl mx-auto">
            Join a thriving community of learners advancing their skills and achieving 
            their goals every single day with our platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="simonelabs-glass-card gentle-hover text-center border-border/40 rounded-2xl group overflow-hidden"
              style={{animationDelay: `${index * 150}ms`}}
            >
              <CardContent className="p-6 lg:p-8 space-y-4">
                <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="space-y-2">
                  <div className={`text-3xl lg:text-4xl font-bold ${stat.color} heading group-hover:scale-105 transition-transform`}>
                    {stat.value}
                  </div>
                  <div className="text-base lg:text-lg font-semibold text-foreground">
                    {stat.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced testimonial preview */}
        <div className="mt-20">
          <div className="simonelabs-glass-card p-8 lg:p-12 rounded-3xl max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-primary fill-current" />
              ))}
            </div>
            <blockquote className="text-xl lg:text-2xl font-medium text-foreground mb-6 italic">
              "This platform has completely transformed how I approach learning. The AI recommendations 
              are spot-on and the community support is incredible."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face" 
                alt="Alex Thompson"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-border/40"
              />
              <div className="text-left">
                <div className="font-semibold text-foreground heading">Alex Thompson</div>
                <div className="text-sm text-muted-foreground">Software Engineer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

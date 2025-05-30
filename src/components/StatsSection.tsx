
import { TrendingUp, Users, BookOpen, Award, Globe, Clock, Star, Zap } from "lucide-react";

const StatsSection = () => {
  const mainStats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Active Learners",
      description: "Students worldwide",
      color: "text-primary",
      bgColor: "bg-primary/10 border-primary/20",
      growth: "+25% this month"
    },
    {
      icon: BookOpen,
      value: "500+",
      label: "Courses Available",
      description: "Across all subjects",
      color: "text-primary",
      bgColor: "bg-primary/10 border-primary/20",
      growth: "+50 new courses"
    },
    {
      icon: Award,
      value: "94%",
      label: "Completion Rate",
      description: "Industry leading",
      color: "text-accent",
      bgColor: "bg-accent/10 border-accent/20",
      growth: "+12% improvement"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "User Rating",
      description: "Highly satisfied",
      color: "text-accent",
      bgColor: "bg-accent/10 border-accent/20",
      growth: "98% recommend"
    }
  ];

  const achievements = [
    {
      icon: TrendingUp,
      title: "Fastest Growing",
      description: "AI Learning Platform 2024"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Available in 50+ countries"
    },
    {
      icon: Clock,
      title: "Time Efficient",
      description: "3x faster learning outcomes"
    },
    {
      icon: Zap,
      title: "AI Powered",
      description: "Advanced machine learning"
    }
  ];

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-accent/30 rounded-full blur-3xl animate-gentle-bounce"></div>
      </div>

      <div className="container mx-auto container-padding relative z-10">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-3 glass-card rounded-full px-6 py-3 text-sm font-medium border">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground font-semibold">Platform Statistics</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
            Trusted by Learners
            <span className="block gradient-text mt-2">Worldwide</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join a thriving community of learners who are achieving their goals 
            with our cutting-edge AI-powered education platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {mainStats.map((stat, index) => (
            <div 
              key={index}
              className="text-center modern-card group border"
              style={{animationDelay: `${index * 150}ms`}}
            >
              <div className={`w-20 h-20 ${stat.bgColor} border rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </div>
              
              <div className="space-y-3">
                <div className="text-4xl sm:text-5xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-foreground">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
                <div className={`text-xs font-medium ${stat.color} bg-current/10 px-3 py-1 rounded-full inline-block`}>
                  {stat.growth}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center modern-card group border"
              style={{animationDelay: `${(index + 4) * 100}ms`}}
            >
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <achievement.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {achievement.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="modern-card border max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Ready to Join Our Community?
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Become part of the fastest-growing AI learning platform and accelerate your educational journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary px-8 py-4 rounded-xl text-base font-semibold shadow-lg">
                Get Started Free
              </button>
              <button className="modern-card border px-8 py-4 rounded-xl text-base font-semibold text-foreground hover:bg-card/50 transition-colors">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

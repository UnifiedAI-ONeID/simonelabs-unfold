
import { Brain, Target, Users, Zap, BookOpen, BarChart3, Sparkles, Shield, Rocket, Globe, Clock, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Features = () => {
  const mainFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Advanced machine learning algorithms adapt to your unique learning style, pace, and preferences for maximum efficiency.",
      color: "text-primary",
      bgColor: "bg-gradient-to-br from-primary/20 to-primary/10",
      borderColor: "border-primary/20"
    },
    {
      icon: Target,
      title: "Smart Goal Tracking",
      description: "Set ambitious learning objectives and watch as our intelligent system helps you achieve them with personalized milestones.",
      color: "text-secondary",
      bgColor: "bg-gradient-to-br from-secondary/20 to-secondary/10",
      borderColor: "border-secondary/20"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Join a vibrant community of learners, participate in study groups, and accelerate your growth through peer interaction.",
      color: "text-accent",
      bgColor: "bg-gradient-to-br from-accent/20 to-accent/10",
      borderColor: "border-accent/20"
    }
  ];

  const additionalFeatures = [
    {
      icon: Zap,
      title: "Instant Course Creation",
      description: "Generate comprehensive courses and interactive content in minutes with our advanced AI assistance.",
      color: "text-primary",
      bgColor: "bg-gradient-to-br from-primary/15 to-primary/5"
    },
    {
      icon: BookOpen,
      title: "Interactive Content",
      description: "Engage with multimedia lessons, real-world examples, and hands-on exercises designed for deep learning.",
      color: "text-secondary",
      bgColor: "bg-gradient-to-br from-secondary/15 to-secondary/5"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get detailed insights into your learning progress, performance patterns, and areas for improvement.",
      color: "text-accent",
      bgColor: "bg-gradient-to-br from-accent/15 to-accent/5"
    },
    {
      icon: Rocket,
      title: "Accelerated Learning",
      description: "Learn 3x faster with our scientifically-proven spaced repetition and active recall techniques.",
      color: "text-primary",
      bgColor: "bg-gradient-to-br from-primary/15 to-primary/5"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with learners worldwide, share knowledge, and participate in international study challenges.",
      color: "text-secondary",
      bgColor: "bg-gradient-to-br from-secondary/15 to-secondary/5"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Your learning data is protected with bank-grade security, complete privacy controls, and GDPR compliance.",
      color: "text-accent",
      bgColor: "bg-gradient-to-br from-accent/15 to-accent/5"
    }
  ];

  const stats = [
    { label: "Course Completion Rate", value: "94%", icon: Trophy },
    { label: "Average Learning Speed", value: "3x Faster", icon: Clock },
    { label: "User Satisfaction", value: "4.9/5", icon: Sparkles }
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto container-padding">
        {/* Enhanced header section */}
        <div className="text-center mb-20 space-y-8 fade-in-up">
          <div className="inline-flex items-center gap-3 simonelabs-glass-card rounded-full px-6 py-3 text-sm font-medium border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary animate-pulse-slow" />
            <span className="text-muted-foreground font-semibold">Powerful Features</span>
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground max-w-5xl mx-auto leading-tight">
              Everything You Need to 
              <span className="block simonelabs-gradient-text mt-2">Excel in Learning</span>
            </h2>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Discover powerful features designed to enhance your learning experience
              and help you achieve your educational goals with cutting-edge AI technology.
            </p>
          </div>

          {/* Stats preview */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3 simonelabs-glass-card px-6 py-4 rounded-xl border border-primary/10">
                <stat.icon className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main features - larger cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className={`simonelabs-glass-card gentle-hover ${feature.borderColor} border-2 rounded-3xl group overflow-hidden h-full`}
              style={{animationDelay: `${index * 150}ms`}}
            >
              <CardHeader className="pb-6 text-center">
                <div className={`w-20 h-20 ${feature.bgColor} rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-10 h-10 ${feature.color}`} />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground heading group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-center">
                <CardDescription className="text-muted-foreground leading-relaxed text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional features - compact grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {additionalFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="simonelabs-glass-card gentle-hover border-border/40 rounded-2xl group overflow-hidden"
              style={{animationDelay: `${(index + 3) * 100}ms`}}
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
        <div className="text-center">
          <div className="simonelabs-glass-card p-12 lg:p-16 rounded-4xl max-w-5xl mx-auto border border-primary/20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground heading">
                  Ready to Transform Your Learning?
                </h3>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Join thousands of learners who are already achieving their goals with our AI-powered platform. 
                  Start your journey today and experience the future of education.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button className="simonelabs-primary-button px-10 py-6 rounded-2xl text-lg font-bold shadow-2xl group">
                  Start Free Trial
                  <Rocket className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </Button>
                <Button variant="outline" className="simonelabs-glass-card border-2 border-border/60 px-10 py-6 rounded-2xl text-lg font-semibold text-foreground hover:bg-muted/50 transition-colors">
                  Learn More
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <span>✨ No credit card required • </span>
                <span className="text-primary font-medium">7-day free trial • </span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;


import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Star, Trophy } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "10K+",
      label: "Active Students",
      color: "text-primary"
    },
    {
      icon: BookOpen,
      value: "500+",
      label: "Courses",
      color: "text-secondary"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Rating",
      color: "text-accent"
    },
    {
      icon: Trophy,
      value: "95%",
      label: "Success Rate",
      color: "text-blue-primary-500"
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16 space-y-4">
          <h2 className="responsive-heading text-foreground">
            Trusted by Thousands
          </h2>
          <p className="responsive-body text-muted-foreground max-w-2xl mx-auto">
            Join a growing community of learners advancing their skills every day
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="simonelabs-glass-card gentle-hover text-center border-border/40 rounded-xl">
              <CardContent className="p-6 lg:p-8 space-y-4">
                <div className="w-14 h-14 bg-muted/60 rounded-xl flex items-center justify-center mx-auto">
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div className="space-y-2">
                  <div className={`text-2xl lg:text-3xl font-bold ${stat.color} heading`}>
                    {stat.value}
                  </div>
                  <div className="text-sm lg:text-base text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

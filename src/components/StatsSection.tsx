
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Star, Trophy } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "10K+",
      label: "Active Students",
      color: "text-simonelabs-primary"
    },
    {
      icon: BookOpen,
      value: "500+",
      label: "Courses",
      color: "text-simonelabs-secondary"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Rating",
      color: "text-simonelabs-warning"
    },
    {
      icon: Trophy,
      value: "95%",
      label: "Success Rate",
      color: "text-simonelabs-success"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground heading">
            Trusted by Thousands
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Join a community of learners advancing their skills every day
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="simonelabs-glass-card hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4 sm:p-6 lg:p-8 text-center space-y-3 sm:space-y-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${stat.color}`} />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${stat.color} heading`}>
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm lg:text-base text-muted-foreground">
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

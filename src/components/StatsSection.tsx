
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Star, Trophy } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Active Students",
      color: "text-blue-600"
    },
    {
      icon: BookOpen,
      value: "500+",
      label: "Courses Available",
      color: "text-green-600"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Average Rating",
      color: "text-yellow-600"
    },
    {
      icon: Trophy,
      value: "95%",
      label: "Completion Rate",
      color: "text-purple-600"
    }
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join a community of learners who are advancing their skills every day
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

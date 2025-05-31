
import { Card, CardContent } from "@/components/ui/card";
import { Video, Calendar, Settings } from "lucide-react";

interface QuickActionsProps {
  onAIGenerator: () => void;
  onScheduleSession: () => void;
  onAnalytics: () => void;
}

const QuickActions = ({ onAIGenerator, onScheduleSession, onAnalytics }: QuickActionsProps) => {
  const actions = [
    {
      title: "AI Course Generator",
      description: "Create a complete course outline with AI assistance",
      icon: Video,
      color: "simonelabs-primary",
      bgColor: "bg-simonelabs-primary/10",
      onClick: onAIGenerator
    },
    {
      title: "Schedule Live Session",
      description: "Set up live classes and virtual events",
      icon: Calendar,
      color: "simonelabs-secondary",
      bgColor: "bg-simonelabs-secondary/10",
      onClick: onScheduleSession
    },
    {
      title: "Analytics Dashboard",
      description: "View detailed performance insights",
      icon: Settings,
      color: "simonelabs-success",
      bgColor: "bg-simonelabs-success/10",
      onClick: onAnalytics
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
      {actions.map((action, index) => (
        <Card 
          key={index} 
          className="simonelabs-glass-card hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={action.onClick}
        >
          <CardContent className="p-4 sm:p-6 text-center">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 ${action.bgColor} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
              <action.icon className={`w-6 h-6 sm:w-8 sm:h-8 text-${action.color}`} />
            </div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base heading">{action.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{action.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickActions;

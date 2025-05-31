
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

interface StatsGridProps {
  stats: Stat[];
}

const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
      {stats.map((stat, index) => (
        <Card key={index} className="simonelabs-glass-card">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-lg sm:text-2xl font-bold ${stat.color} heading`}>{stat.value}</p>
              </div>
              <div className="self-end sm:self-auto">
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;


import { Card } from "@/components/ui/card";
import { Star, Trophy, Clock, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DashboardStatsProps {
  mockLevel: number;
  mockXP: number;
  completedCourses: number;
  inProgressCourses: number;
}

const DashboardStats = ({ mockLevel, mockXP, completedCourses, inProgressCourses }: DashboardStatsProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t('stats.level')}</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{mockLevel}</p>
          </div>
          <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t('stats.xp')}</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{mockXP}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">{t('stats.completed')}</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{completedCourses}</p>
          </div>
          <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{t('stats.inProgress')}</p>
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{inProgressCourses}</p>
          </div>
          <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;

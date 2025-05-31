
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Achievement {
  id: string;
  title: string;
  earned_at: string;
  xp_reward: number;
}

interface AchievementsCardProps {
  achievements: Achievement[];
}

const AchievementsCard = ({ achievements }: AchievementsCardProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          {t('achievements.title')}
        </h2>
        <Link to="/achievements">
          <Button variant="outline" size="sm">{t('achievements.viewAll')}</Button>
        </Link>
      </div>
      
      <div className="space-y-3">
        {achievements.length > 0 ? (
          achievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{achievement.title}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {new Date(achievement.earned_at).toLocaleDateString()}
                  </p>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    +{achievement.xp_reward} XP
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{t('achievements.noAchievements.title')}</p>
            <p className="text-sm text-muted-foreground">
              {t('achievements.noAchievements.description')}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AchievementsCard;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';
import { LearningData } from './types';

interface RecentAchievementsCardProps {
  achievements: LearningData['achievements'];
}

const RecentAchievementsCard = ({ achievements }: RecentAchievementsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {achievements.slice(0, 5).map((achievement, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{achievement.name}</p>
                <p className="text-xs text-gray-500">{achievement.date}</p>
              </div>
              <Badge variant="secondary">{achievement.type}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAchievementsCard;

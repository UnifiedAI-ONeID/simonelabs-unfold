
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';
import { LearningData } from './types';

interface WeeklyGoalsCardProps {
  weeklyGoals: LearningData['weeklyGoals'];
}

const WeeklyGoalsCard = ({ weeklyGoals }: WeeklyGoalsCardProps) => {
  const progressPercentage = Math.round((weeklyGoals.achieved / weeklyGoals.target) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Weekly Study Goal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{weeklyGoals.achieved} minutes</span>
            <span>{weeklyGoals.target} minutes goal</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-xs text-gray-500">{progressPercentage}% complete</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyGoalsCard;

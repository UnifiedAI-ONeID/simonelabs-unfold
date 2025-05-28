
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Target, Award } from 'lucide-react';
import { useLearningAnalytics } from '@/hooks/useLearningAnalytics';
import AnalyticsCard from './AnalyticsCard';
import WeeklyGoalsCard from './WeeklyGoalsCard';
import StudyTimeChart from './StudyTimeChart';
import QuizPerformanceChart from './QuizPerformanceChart';
import CourseProgressCard from './CourseProgressCard';
import RecentAchievementsCard from './RecentAchievementsCard';

const LearningAnalytics = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const { analytics, loading } = useLearningAnalytics(timeRange);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analytics data available yet. Start learning to see your progress!</p>
      </div>
    );
  }

  const avgQuizScore = analytics.quizScores.length > 0 
    ? Math.round(analytics.quizScores.reduce((acc, q) => acc + q.score, 0) / analytics.quizScores.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Study Streak"
          value={`${analytics.learningStreak} days`}
          icon={Calendar}
          color="text-orange-600"
        />
        <AnalyticsCard
          title="This Week"
          value={`${analytics.weeklyGoals.achieved}m`}
          icon={Clock}
          color="text-blue-600"
          subtitle={`Goal: ${analytics.weeklyGoals.target}m`}
        />
        <AnalyticsCard
          title="Avg Quiz Score"
          value={`${avgQuizScore}%`}
          icon={Target}
          color="text-green-600"
        />
        <AnalyticsCard
          title="Achievements"
          value={analytics.achievements.length.toString()}
          icon={Award}
          color="text-purple-600"
        />
      </div>

      {/* Weekly Goals Progress */}
      <WeeklyGoalsCard weeklyGoals={analytics.weeklyGoals} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudyTimeChart studyTime={analytics.studyTime} />
        <QuizPerformanceChart quizScores={analytics.quizScores} />
        <CourseProgressCard courseProgress={analytics.courseProgress} />
        <RecentAchievementsCard achievements={analytics.achievements} />
      </div>
    </div>
  );
};

export default LearningAnalytics;

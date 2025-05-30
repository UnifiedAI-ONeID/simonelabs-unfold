
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LearningData } from '@/components/Analytics/types';

// Since analytics tables were removed, this hook now uses only mock data
export const useLearningAnalytics = (timeRange: 'week' | 'month' | 'year' = 'month') => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<LearningData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Since quiz_attempts and user_achievements tables were removed, use mock data
      const studyTime = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        minutes: Math.round(Math.random() * 120) + 30
      }));

      const quizScores = [
        { quiz: 'Sample Quiz 1', score: 85, date: new Date().toLocaleDateString() },
        { quiz: 'Sample Quiz 2', score: 92, date: new Date(Date.now() - 86400000).toLocaleDateString() }
      ];

      const courseProgress = [
        { course: 'Introduction to React', progress: 75, timeSpent: 120 },
        { course: 'Advanced JavaScript', progress: 45, timeSpent: 90 }
      ];

      const userAchievements = [
        { name: 'First Course Completed', date: new Date().toLocaleDateString(), type: 'trophy' },
        { name: 'Study Streak', date: new Date(Date.now() - 86400000).toLocaleDateString(), type: 'star' }
      ];

      setAnalytics({
        studyTime,
        quizScores,
        courseProgress,
        achievements: userAchievements,
        weeklyGoals: { target: 300, achieved: studyTime.reduce((acc, day) => acc + day.minutes, 0) },
        learningStreak: 7
      });
    } catch (error) {
      console.error('Error generating mock analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return { analytics, loading };
};

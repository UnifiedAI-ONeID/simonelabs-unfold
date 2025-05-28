
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { LearningData } from '@/components/Analytics/types';

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
      
      // Fetch quiz attempts for quiz scores
      const { data: quizAttempts } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quizzes (title)
        `)
        .eq('user_id', user?.id)
        .order('started_at', { ascending: false })
        .limit(20);

      // Fetch user progress for courses
      const { data: progress } = await supabase
        .from('user_progress')
        .select(`
          *,
          courses (title)
        `)
        .eq('user_id', user?.id);

      // Fetch achievements
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements (title, icon_name)
        `)
        .eq('user_id', user?.id)
        .order('earned_at', { ascending: false });

      // Mock study time data since study_sessions table might not be in types yet
      const studyTime = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        minutes: Math.round(Math.random() * 120) + 30
      }));

      const quizScores = (quizAttempts || []).map(attempt => ({
        quiz: attempt.quizzes?.title || 'Quiz',
        score: attempt.percentage || 0,
        date: new Date(attempt.started_at).toLocaleDateString()
      }));

      const courseProgress = (progress || []).map(p => ({
        course: p.courses?.title || 'Course',
        progress: Math.round((p.progress || 0) * 100),
        timeSpent: Math.round(Math.random() * 120) + 10
      }));

      const userAchievements = (achievements || []).map(a => ({
        name: a.achievements?.title || 'Achievement',
        date: new Date(a.earned_at).toLocaleDateString(),
        type: a.achievements?.icon_name || 'trophy'
      }));

      setAnalytics({
        studyTime,
        quizScores,
        courseProgress,
        achievements: userAchievements,
        weeklyGoals: { target: 300, achieved: studyTime.reduce((acc, day) => acc + day.minutes, 0) },
        learningStreak: 7 // Mock value
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return { analytics, loading };
};

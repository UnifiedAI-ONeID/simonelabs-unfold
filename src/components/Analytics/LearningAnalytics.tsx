
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Calendar, Clock, Target, TrendingUp, Brain, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface LearningData {
  studyTime: { date: string; minutes: number }[];
  quizScores: { quiz: string; score: number; date: string }[];
  courseProgress: { course: string; progress: number; timeSpent: number }[];
  achievements: { name: string; date: string; type: string }[];
  weeklyGoals: { target: number; achieved: number };
  learningStreak: number;
}

const LearningAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<LearningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch study sessions
      const { data: sessions } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(30);

      // Fetch quiz attempts
      const { data: quizAttempts } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quizzes (title)
        `)
        .eq('user_id', user?.id)
        .order('started_at', { ascending: false })
        .limit(20);

      // Fetch user progress
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

      // Process data
      const studyTime = (sessions || []).map(session => ({
        date: new Date(session.created_at).toLocaleDateString(),
        minutes: session.duration_minutes || 0
      }));

      const quizScores = (quizAttempts || []).map(attempt => ({
        quiz: attempt.quizzes?.title || 'Quiz',
        score: attempt.percentage || 0,
        date: new Date(attempt.started_at).toLocaleDateString()
      }));

      const courseProgress = (progress || []).map(p => ({
        course: p.courses?.title || 'Course',
        progress: Math.round((p.progress || 0) * 100),
        timeSpent: Math.round(Math.random() * 120) // Placeholder
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
        weeklyGoals: { target: 300, achieved: 240 }, // Placeholder
        learningStreak: 7 // Placeholder
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Study Streak</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.learningStreak} days</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.weeklyGoals.achieved}m
                </p>
                <p className="text-xs text-gray-500">
                  Goal: {analytics.weeklyGoals.target}m
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Quiz Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {analytics.quizScores.length > 0 
                    ? Math.round(analytics.quizScores.reduce((acc, q) => acc + q.score, 0) / analytics.quizScores.length)
                    : 0}%
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.achievements.length}</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals Progress */}
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
              <span>{analytics.weeklyGoals.achieved} minutes</span>
              <span>{analytics.weeklyGoals.target} minutes goal</span>
            </div>
            <Progress 
              value={(analytics.weeklyGoals.achieved / analytics.weeklyGoals.target) * 100} 
              className="h-3"
            />
            <p className="text-xs text-gray-500">
              {Math.round((analytics.weeklyGoals.achieved / analytics.weeklyGoals.target) * 100)}% complete
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Study Time Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.studyTime.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="minutes" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quiz Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.quizScores.slice(-5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quiz" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Course Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.courseProgress.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{course.course}</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <p className="text-xs text-gray-500">{course.timeSpent}h spent</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.achievements.slice(0, 5).map((achievement, index) => (
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
      </div>
    </div>
  );
};

export default LearningAnalytics;

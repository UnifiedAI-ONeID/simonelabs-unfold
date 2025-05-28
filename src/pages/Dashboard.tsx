
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Trophy, Clock, Star } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: userProgress } = useQuery({
    queryKey: ['user-progress', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          *,
          courses (
            title,
            description,
            difficulty_level
          )
        `)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: achievements } = useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements (
            title,
            description,
            icon_name
          )
        `)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const completedCourses = userProgress?.filter(p => p.completed).length || 0;
  const inProgressCourses = userProgress?.filter(p => !p.completed).length || 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.display_name || user?.email}!
          </h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Level</p>
                <p className="text-2xl font-bold text-purple-600">{profile?.level || 1}</p>
              </div>
              <Star className="h-8 w-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">XP Points</p>
                <p className="text-2xl font-bold text-blue-600">{profile?.xp || 0}</p>
              </div>
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Courses Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedCourses}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">{inProgressCourses}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
            <div className="space-y-4">
              {userProgress?.filter(p => !p.completed).map((progress) => (
                <div key={progress.id} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{progress.courses?.title}</h3>
                  <Progress value={progress.progress * 100} className="mb-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {Math.round(progress.progress * 100)}% complete
                    </span>
                    <Button size="sm">Continue</Button>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500">No courses in progress yet. Start learning!</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
            <div className="space-y-3">
              {achievements?.slice(0, 5).map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">{achievement.achievements?.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500">No achievements yet. Keep learning!</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

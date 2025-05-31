
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import RecentCourses from '@/components/Dashboard/RecentCourses';
import AchievementsCard from '@/components/Dashboard/AchievementsCard';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation('dashboard');

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('users_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Profile fetch error:', error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: userProgress, isLoading: progressLoading } = useQuery({
    queryKey: ['user-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          *,
          courses (
            id,
            title,
            description,
            difficulty_level,
            status
          )
        `)
        .eq('user_id', user.id)
        .order('last_accessed', { ascending: false });
      
      if (error) {
        console.error('Progress fetch error:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Mock achievements data since the table was removed
  const mockAchievements = [
    {
      id: '1',
      title: 'First Course Completed',
      earned_at: new Date().toISOString(),
      xp_reward: 100
    },
    {
      id: '2', 
      title: 'Learning Streak',
      earned_at: new Date(Date.now() - 86400000).toISOString(),
      xp_reward: 50
    }
  ];

  const completedCourses = userProgress?.filter(p => p.completed).length || 0;
  const inProgressCourses = userProgress?.filter(p => !p.completed && p.progress > 0).length || 0;
  const totalCourses = userProgress?.length || 0;

  // Mock level and XP since these columns were removed
  const mockLevel = Math.floor(completedCourses / 2) + 1;
  const mockXP = completedCourses * 100 + inProgressCourses * 25;

  if (profileLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <Navigation />
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-64"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navigation />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl flex items-center justify-center border border-primary/20">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground heading">
                  {t('welcome', { name: profile?.display_name || user?.email?.split('@')[0] })}
                </h1>
                <p className="text-muted-foreground">{t('subtitle')}</p>
              </div>
            </div>
          </div>

          <DashboardStats 
            mockLevel={mockLevel}
            mockXP={mockXP}
            completedCourses={completedCourses}
            inProgressCourses={inProgressCourses}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentCourses 
              inProgressCourses={inProgressCourses}
              userProgress={userProgress}
            />

            <AchievementsCard achievements={mockAchievements} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

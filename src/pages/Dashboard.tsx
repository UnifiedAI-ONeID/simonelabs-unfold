import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Trophy, Clock, Star, User, Plus, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';

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

          {/* Stats Cards */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Continue Learning */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {t('continueLearning.title')}
                </h2>
                <Link to="/courses">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {t('continueLearning.browseButton')}
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {inProgressCourses > 0 ? (
                  userProgress?.filter(p => !p.completed && p.progress > 0).slice(0, 3).map((progress) => (
                    <div key={progress.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium mb-1">{progress.courses?.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {progress.courses?.description}
                          </p>
                        </div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {progress.courses?.difficulty_level}
                        </span>
                      </div>
                      <Progress value={(progress.progress || 0) * 100} className="mb-3" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {Math.round((progress.progress || 0) * 100)}% {t('continueLearning.complete')}
                        </span>
                        <Link to={`/learn/${progress.course_id}`}>
                          <Button size="sm" className="rounded-xl">{t('continueLearning.continueButton')}</Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">{t('continueLearning.noCourses.title')}</p>
                    <Link to="/courses">
                      <Button className="rounded-xl">
                        <Plus className="h-4 w-4 mr-2" />
                        {t('continueLearning.noCourses.button')}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>

            {/* Recent Achievements */}
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
                {mockAchievements.length > 0 ? (
                  mockAchievements.map((achievement) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
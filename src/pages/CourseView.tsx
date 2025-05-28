
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, Star, Users, ChevronLeft, ChevronRight, Play } from 'lucide-react';

const CourseView = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_categories (name),
          users_profiles!courses_instructor_id_fkey (display_name)
        `)
        .eq('id', courseId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  const { data: sections } = useQuery({
    queryKey: ['course-sections', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_sections')
        .select('*')
        .eq('course_id', courseId)
        .order('order');
      
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  const { data: userProgress } = useQuery({
    queryKey: ['user-progress', courseId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!courseId && !!user,
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (!user || !courseId) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress: 0,
          completed: false,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress', courseId, user?.id] });
      toast({
        title: "Enrolled successfully!",
        description: "You can now start learning this course.",
      });
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast({
          title: "Already enrolled",
          description: "You're already enrolled in this course!",
        });
      } else {
        toast({
          title: "Enrollment failed",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const handleEnroll = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to enroll in courses.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    enrollMutation.mutate();
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  const isEnrolled = !!userProgress;
  const progressPercentage = userProgress?.progress || 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/courses')}
          className="mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">
                  {course.course_categories?.name || 'General'}
                </Badge>
                <Badge 
                  variant={course.difficulty_level === 'beginner' ? 'default' : 
                           course.difficulty_level === 'intermediate' ? 'secondary' : 'destructive'}
                >
                  {course.difficulty_level || 'beginner'}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {course.student_count} students
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                  {course.rating?.toFixed(1) || '0.0'}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.estimated_duration || 'Self-paced'}
                </div>
              </div>

              <p className="text-gray-600 mb-6">{course.description}</p>

              {isEnrolled && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Course Progress</span>
                    <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="w-full" />
                </div>
              )}
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {course.learning_objectives ? (
                      <ul className="space-y-2">
                        {JSON.parse(course.learning_objectives).map((objective: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {objective}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">Learning objectives will be available soon.</p>
                    )}
                  </CardContent>
                </Card>

                {course.prerequisites && course.prerequisites.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Prerequisites</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {course.prerequisites.map((prereq: string, index: number) => (
                          <li key={index} className="text-gray-600">• {prereq}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-4">
                {sections?.map((section, index) => (
                  <Card key={section.id}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium mr-3">
                          {index + 1}
                        </span>
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-3">
                        {(section.content as any)?.text || 'Content coming soon...'}
                      </p>
                      {section.video_url && (
                        <div className="flex items-center text-sm text-blue-600">
                          <Play className="w-4 h-4 mr-1" />
                          Video included
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="instructor">
                <Card>
                  <CardHeader>
                    <CardTitle>Meet your instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold text-lg mb-2">
                      {course.users_profiles?.display_name || 'Anonymous Instructor'}
                    </h3>
                    <p className="text-gray-600">
                      Experienced educator passionate about sharing knowledge and helping students succeed.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {!isEnrolled ? (
                  <Button 
                    className="w-full mb-4"
                    onClick={handleEnroll}
                    disabled={enrollMutation.isPending}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
                  </Button>
                ) : (
                  <Button 
                    className="w-full mb-4"
                    onClick={() => navigate(`/learn/${courseId}`)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Students enrolled</span>
                    <span className="font-medium">{course.student_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty</span>
                    <span className="font-medium capitalize">{course.difficulty_level || 'beginner'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{course.estimated_duration || 'Self-paced'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium">{course.rating?.toFixed(1) || '0.0'} ⭐</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;

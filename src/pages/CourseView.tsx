
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Star, Users, Play, CheckCircle } from 'lucide-react';

interface CourseSection {
  id: string;
  title: string;
  content: any;
  video_url: string | null;
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: string | null;
  student_count: number;
  rating: number | null;
  estimated_duration: any;
  course_categories: {
    name: string;
  } | null;
  users_profiles: {
    display_name: string | null;
  } | null;
}

const CourseView = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_categories (
            name
          ),
          users_profiles!courses_instructor_id_fkey (
            display_name
          )
        `)
        .eq('id', courseId)
        .single();
      
      if (error) throw error;
      return data as Course;
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
      return data as CourseSection[];
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

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to enroll in courses.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          course_id: courseId!,
          progress: 0,
          completed: false,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already enrolled",
            description: "You're already enrolled in this course!",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Enrolled successfully!",
        description: "You can now start learning.",
      });
      
      // Refresh progress data
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Enrollment failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDuration = (duration: any) => {
    if (!duration) return 'Self-paced';
    
    try {
      // Handle different duration formats
      if (typeof duration === 'string') {
        const match = duration.match(/(\d+)/);
        if (match) {
          const hours = parseInt(match[1]);
          return `${Math.floor(hours / 60)}h ${hours % 60}m`;
        }
      }
      return 'Self-paced';
    } catch {
      return 'Self-paced';
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const isEnrolled = !!userProgress;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
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
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
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
                  {formatDuration(course.estimated_duration)}
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {course.description}
              </p>

              <div className="text-sm text-gray-600 mb-6">
                Instructor: {course.users_profiles?.display_name || 'Anonymous'}
              </div>
            </div>

            {/* Course Content */}
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {sections?.length || 0} sections in this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sections?.map((section, index) => (
                    <div key={section.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{section.title}</h3>
                        {section.video_url && (
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Play className="w-3 h-3 mr-1" />
                            Video lesson
                          </p>
                        )}
                      </div>
                      {isEnrolled && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {isEnrolled ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <h3 className="font-semibold text-green-700">You're enrolled!</h3>
                      <p className="text-sm text-gray-600 mb-4">Continue your learning journey</p>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => navigate(`/learn/${courseId}`)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                      <h3 className="font-semibold">Ready to start learning?</h3>
                      <p className="text-sm text-gray-600 mb-4">Enroll now to access all course content</p>
                    </div>
                    
                    <Button className="w-full" onClick={handleEnroll}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Enroll Now
                    </Button>
                  </div>
                )}

                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-2">What you'll learn</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Core concepts and fundamentals</li>
                    <li>• Practical hands-on exercises</li>
                    <li>• Real-world applications</li>
                    <li>• Best practices and tips</li>
                  </ul>
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

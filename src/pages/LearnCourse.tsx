
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const LearnCourse = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
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
      
      if (error) throw error;
      return data;
    },
    enabled: !!courseId && !!user,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (newProgress: number) => {
      if (!user || !courseId) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_progress')
        .update({ 
          progress: newProgress,
          completed: newProgress >= 100,
          last_accessed: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress', courseId, user?.id] });
    },
  });

  const handleNext = () => {
    if (!sections) return;
    
    const nextIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
    setCurrentSectionIndex(nextIndex);
    
    // Update progress
    const newProgress = ((nextIndex + 1) / sections.length) * 100;
    updateProgressMutation.mutate(newProgress);
    
    if (nextIndex === sections.length - 1) {
      toast({
        title: "Congratulations!",
        description: "You've completed the course!",
      });
    }
  };

  const handlePrevious = () => {
    setCurrentSectionIndex(Math.max(currentSectionIndex - 1, 0));
  };

  const handleSectionClick = (index: number) => {
    setCurrentSectionIndex(index);
    const newProgress = ((index + 1) / (sections?.length || 1)) * 100;
    updateProgressMutation.mutate(newProgress);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </div>
      </div>
    );
  }

  if (!sections || !course) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentSection = sections[currentSectionIndex];
  const progressPercentage = userProgress?.progress || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/course/${courseId}`)}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{course.title}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Section {currentSectionIndex + 1} of {sections.length}</span>
                <Badge variant="outline">
                  {Math.round(progressPercentage)}% Complete
                </Badge>
              </div>
            </div>
          </div>
          <div className="w-64">
            <Progress value={progressPercentage} className="w-full" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(index)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        index === currentSectionIndex ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index <= currentSectionIndex ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {index < currentSectionIndex ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span className="text-sm font-medium">{section.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{currentSection.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentSection.video_url && (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-500 mb-2">Video Content</div>
                      <div className="text-sm text-gray-400">{currentSection.video_url}</div>
                    </div>
                  </div>
                )}

                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed">
                    {(currentSection.content as any)?.text || 'Content coming soon...'}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentSectionIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <span className="text-sm text-gray-600">
                    {currentSectionIndex + 1} of {sections.length}
                  </span>

                  <Button
                    onClick={handleNext}
                    disabled={currentSectionIndex === sections.length - 1}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnCourse;

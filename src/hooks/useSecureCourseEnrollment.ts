
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const useSecureCourseEnrollment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      // Validate courseId format (UUID)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(courseId)) {
        throw new Error('Invalid course ID format');
      }

      // Check if already enrolled first
      const { data: existingProgress, error: checkError } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking enrollment:', checkError);
        throw new Error('Failed to check enrollment status');
      }

      if (existingProgress) {
        throw new Error('Already enrolled in this course');
      }

      // Verify course exists and is published
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('id, status, title')
        .eq('id', courseId)
        .eq('status', 'published')
        .maybeSingle();

      if (courseError) {
        console.error('Error fetching course:', courseError);
        throw new Error('Failed to verify course availability');
      }

      if (!course) {
        throw new Error('Course not found or not available');
      }

      // Create enrollment record with error handling
      const { error: enrollError } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress: 0,
          completed: false,
        });

      if (enrollError) {
        console.error('Enrollment error:', enrollError);
        throw new Error('Failed to enroll in course');
      }

      return { courseId, courseTitle: course.title };
    },
    onSuccess: ({ courseId, courseTitle }) => {
      // Invalidate relevant queries for fresh data
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['courses-optimized'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      
      toast({
        title: "Enrolled successfully!",
        description: `You can now access "${courseTitle}" from your dashboard.`,
      });
    },
    onError: (error: any) => {
      console.error('Enrollment mutation error:', error);
      
      if (error.message === 'Authentication required') {
        navigate('/auth');
        toast({
          title: "Please sign in",
          description: "You need to be signed in to enroll in courses.",
          variant: "destructive",
        });
      } else if (error.message === 'Already enrolled in this course') {
        toast({
          title: "Already enrolled",
          description: "You're already enrolled in this course!",
        });
      } else if (error.message === 'Invalid course ID format') {
        toast({
          title: "Invalid course",
          description: "The course ID is not valid.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Enrollment failed",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    },
  });

  return {
    enroll: enrollMutation.mutate,
    isEnrolling: enrollMutation.isPending,
    error: enrollMutation.error,
  };
};

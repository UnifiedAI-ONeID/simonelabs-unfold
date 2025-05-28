
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

      // Check if already enrolled first
      const { data: existingProgress, error: checkError } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingProgress) {
        throw new Error('Already enrolled in this course');
      }

      // Verify course exists and is published
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('id, status')
        .eq('id', courseId)
        .eq('status', 'published')
        .single();

      if (courseError || !course) {
        throw new Error('Course not found or not available');
      }

      // Create enrollment record
      const { error: enrollError } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress: 0,
          completed: false,
        });

      if (enrollError) {
        throw enrollError;
      }

      return courseId;
    },
    onSuccess: (courseId) => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['courses-optimized'] });
      
      toast({
        title: "Enrolled successfully!",
        description: "You can now access this course from your dashboard.",
      });
    },
    onError: (error: any) => {
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
      } else {
        console.error('Enrollment error:', error);
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
  };
};

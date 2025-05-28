
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const useCourseEnrollment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEnroll = async (courseId: string) => {
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
          course_id: courseId,
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
        description: "You can now access this course from your dashboard.",
      });
    } catch (error: any) {
      toast({
        title: "Enrollment failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { handleEnroll };
};

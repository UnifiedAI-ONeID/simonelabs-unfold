
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useSecureCourseBuilder = (courseId: string | undefined) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useQuery({
    queryKey: ['secure-course', courseId],
    queryFn: async () => {
      if (!courseId || !user) return null;
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .eq('instructor_id', user.id) // Security: only instructor can access
        .single();
      
      if (error) {
        console.error('Error fetching course:', error);
        throw new Error('Failed to fetch course or access denied');
      }
      return data;
    },
    enabled: !!courseId && !!user,
    retry: 1,
  });

  const { data: sections } = useQuery({
    queryKey: ['secure-course-sections', courseId],
    queryFn: async () => {
      if (!courseId || !course) return [];
      
      const { data, error } = await supabase
        .from('course_sections')
        .select('*')
        .eq('course_id', courseId)
        .order('order');
      
      if (error) {
        console.error('Error fetching sections:', error);
        throw new Error('Failed to fetch course sections');
      }
      return data;
    },
    enabled: !!courseId && !!course,
  });

  const addSectionMutation = useMutation({
    mutationFn: async (sectionData: any) => {
      if (!courseId || !user || !course) {
        throw new Error('Missing required data');
      }

      // Security check: ensure user owns the course
      if (course.instructor_id !== user.id) {
        throw new Error('Access denied');
      }

      const maxOrder = sections?.length ? Math.max(...sections.map(s => s.order)) : 0;
      
      const { data, error } = await supabase
        .from('course_sections')
        .insert({
          ...sectionData,
          course_id: courseId,
          order: maxOrder + 1,
          content: { text: sectionData.content },
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding section:', error);
        throw new Error('Failed to add section');
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secure-course-sections', courseId] });
      toast({
        title: "Section added successfully!",
        description: "Your new section has been added to the course.",
      });
    },
    onError: (error: any) => {
      console.error('Add section error:', error);
      toast({
        title: "Error adding section",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const publishCourseMutation = useMutation({
    mutationFn: async () => {
      if (!courseId || !user || !course) {
        throw new Error('Missing required data');
      }

      // Security check: ensure user owns the course
      if (course.instructor_id !== user.id) {
        throw new Error('Access denied');
      }

      const { error } = await supabase
        .from('courses')
        .update({ status: 'published' })
        .eq('id', courseId)
        .eq('instructor_id', user.id); // Double security check

      if (error) {
        console.error('Error publishing course:', error);
        throw new Error('Failed to publish course');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secure-course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses-optimized'] });
      toast({
        title: "Course published!",
        description: "Your course is now live and visible to students.",
      });
    },
    onError: (error: any) => {
      console.error('Publish course error:', error);
      toast({
        title: "Error publishing course",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    course,
    sections,
    isLoading,
    addSection: addSectionMutation.mutate,
    isAddingSection: addSectionMutation.isPending,
    publishCourse: publishCourseMutation.mutate,
    isPublishing: publishCourseMutation.isPending,
  };
};

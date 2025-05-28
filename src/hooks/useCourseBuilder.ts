
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCourseBuilder = (courseId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useQuery({
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

  const addSectionMutation = useMutation({
    mutationFn: async (sectionData: any) => {
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

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-sections', courseId] });
      toast({
        title: "Section added successfully!",
        description: "Your new section has been added to the course.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding section",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const publishCourseMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('courses')
        .update({ status: 'published' })
        .eq('id', courseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast({
        title: "Course published!",
        description: "Your course is now live and visible to students.",
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

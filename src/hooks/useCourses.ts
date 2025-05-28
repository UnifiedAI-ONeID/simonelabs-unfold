
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: string | null;
  student_count: number;
  rating: number | null;
  estimated_duration: string | null;
  category_id: string | null;
  course_categories: {
    name: string;
  } | null;
  users_profiles: {
    display_name: string | null;
  } | null;
}

export const useCourses = () => {
  return useQuery({
    queryKey: ['published-courses'],
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
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our Course interface
      return data?.map((course: any) => ({
        ...course,
        users_profiles: Array.isArray(course.users_profiles) 
          ? course.users_profiles[0] || { display_name: null }
          : course.users_profiles || { display_name: null }
      })) as Course[];
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['course-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

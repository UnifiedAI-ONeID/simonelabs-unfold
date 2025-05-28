
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface OptimizedCourse {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: string | null;
  student_count: number;
  rating: number | null;
  estimated_duration: string | null;
  category_id: string | null;
  instructor_name: string | null;
  category_name: string | null;
}

// Optimized hook with better caching and error handling
export const useOptimizedCourses = () => {
  return useQuery({
    queryKey: ['courses-optimized'],
    queryFn: async (): Promise<OptimizedCourse[]> => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          difficulty_level,
          student_count,
          rating,
          estimated_duration,
          category_id,
          course_categories!inner (
            name
          ),
          users_profiles!courses_instructor_id_fkey (
            display_name
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(50); // Limit for performance
      
      if (error) {
        console.error('Error fetching courses:', error);
        throw new Error('Failed to fetch courses');
      }
      
      return data?.map((course: any) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        difficulty_level: course.difficulty_level,
        student_count: course.student_count,
        rating: course.rating,
        estimated_duration: course.estimated_duration,
        category_id: course.category_id,
        instructor_name: course.users_profiles?.display_name || 'Unknown Instructor',
        category_name: course.course_categories?.name || 'Uncategorized'
      })) || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

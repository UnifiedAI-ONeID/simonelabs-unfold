
import { memo } from 'react';
import OptimizedCourseCard from './OptimizedCourseCard';

interface Course {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: string | null;
  student_count: number;
  rating: number | null;
  estimated_duration: string | null;
  instructor_name: string | null;
  category_name: string | null;
}

interface OptimizedCoursesGridProps {
  courses: Course[] | undefined;
  onEnroll: (courseId: string) => void;
  isEnrolling?: boolean;
}

// Memoized grid component for better performance
const OptimizedCoursesGrid = memo(({ courses, onEnroll, isEnrolling }: OptimizedCoursesGridProps) => {
  if (!courses?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No courses available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <OptimizedCourseCard
          key={course.id}
          course={course}
          onEnroll={onEnroll}
          isEnrolling={isEnrolling}
        />
      ))}
    </div>
  );
});

OptimizedCoursesGrid.displayName = 'OptimizedCoursesGrid';

export default OptimizedCoursesGrid;

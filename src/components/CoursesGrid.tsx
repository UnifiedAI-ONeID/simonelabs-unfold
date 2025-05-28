
import { BookOpen } from 'lucide-react';
import CourseCard from './CourseCard';

interface Course {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: string | null;
  student_count: number;
  rating: number | null;
  estimated_duration: string | null;
  course_categories: {
    name: string;
  } | null;
  users_profiles: {
    display_name: string | null;
  } | null;
}

interface CoursesGridProps {
  courses: Course[] | undefined;
  onEnroll: (courseId: string) => void;
}

const CoursesGrid = ({ courses, onEnroll }: CoursesGridProps) => {
  if (courses?.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
        <p className="text-gray-600">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses?.map((course) => (
        <CourseCard 
          key={course.id} 
          course={course}
          onEnroll={onEnroll}
        />
      ))}
    </div>
  );
};

export default CoursesGrid;

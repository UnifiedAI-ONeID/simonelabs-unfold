
import { useState } from 'react';
import CourseFilters from '@/components/CourseFilters';
import CoursesGrid from '@/components/CoursesGrid';
import { useCourses, useCategories } from '@/hooks/useCourses';
import { useCourseEnrollment } from '@/hooks/useCourseEnrollment';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: courses, isLoading } = useCourses();
  const { data: categories } = useCategories();
  const { handleEnroll } = useCourseEnrollment();

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty_level === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || course.category_id === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Explore Courses
          </h1>
          <p className="text-gray-600">Discover amazing courses and start learning today</p>
        </div>

        <CourseFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        <CoursesGrid
          courses={filteredCourses}
          onEnroll={handleEnroll}
        />
      </div>
    </div>
  );
};

export default Courses;

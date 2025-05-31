import { useState, useMemo } from 'react';
import CourseFilters from '@/components/CourseFilters';
import OptimizedCoursesGrid from '@/components/OptimizedCoursesGrid';
import { useOptimizedCourses } from '@/hooks/useOptimizedCourses';
import { useSecureCourseEnrollment } from '@/hooks/useSecureCourseEnrollment';
import { useCategories } from '@/hooks/useCourses';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: courses, isLoading, error } = useOptimizedCourses();
  const { data: categories } = useCategories();
  const { enroll, isEnrolling } = useSecureCourseEnrollment();
  const { t } = useTranslation('courses');

  // Memoized filtering for better performance
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    
    return courses.filter(course => {
      const matchesSearch = searchTerm === '' || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDifficulty = selectedDifficulty === 'all' || 
        course.difficulty_level === selectedDifficulty;
      
      const matchesCategory = selectedCategory === 'all' || 
        course.category_id === selectedCategory;
      
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [courses, searchTerm, selectedDifficulty, selectedCategory]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Something went wrong
            </h1>
            <p className="text-muted-foreground">
              Unable to load courses. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('title')}
            </h1>
            <p className="text-muted-foreground">
              {t('subtitle')}
            </p>
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

          <OptimizedCoursesGrid
            courses={filteredCourses}
            onEnroll={enroll}
            isEnrolling={isEnrolling}
          />
        </div>
      </div>
    </div>
  );
};

export default Courses;
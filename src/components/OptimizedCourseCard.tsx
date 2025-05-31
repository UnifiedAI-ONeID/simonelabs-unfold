import { memo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, Users } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface OptimizedCourseCardProps {
  course: {
    id: string;
    title: string;
    description: string | null;
    difficulty_level: string | null;
    student_count: number;
    rating: number | null;
    estimated_duration: string | null;
    instructor_name: string | null;
    category_name: string | null;
  };
  onEnroll: (courseId: string) => void;
  isEnrolling?: boolean;
}

// Memoized component to prevent unnecessary re-renders
const OptimizedCourseCard = memo(({ course, onEnroll, isEnrolling }: OptimizedCourseCardProps) => {
  const { t } = useTranslation('courses');
  
  const handleEnroll = () => {
    onEnroll(course.id);
  };

  const formatDuration = (duration: string | null) => {
    if (!duration) return t('courseCard.selfPaced');
    
    try {
      const match = duration.match(/(\d+)/);
      if (match) {
        const hours = parseInt(match[1]);
        return `${Math.floor(hours / 60)}h ${hours % 60}m`;
      }
      return t('courseCard.selfPaced');
    } catch {
      return t('courseCard.selfPaced');
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {course.title}
          </CardTitle>
          {course.difficulty_level && (
            <Badge variant="secondary" className="ml-2 shrink-0">
              {course.difficulty_level}
            </Badge>
          )}
        </div>
        {course.category_name && (
          <Badge variant="outline" className="w-fit">
            {course.category_name}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {course.description || "No description available"}
        </p>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{course.student_count} {t('courseCard.students')}</span>
          </div>
          
          {course.rating && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
          )}
          
          {course.estimated_duration && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(course.estimated_duration)}</span>
            </div>
          )}
          
          {course.instructor_name && (
            <p className="text-xs">
              {t('courseView.instructor')}: {course.instructor_name}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleEnroll}
          disabled={isEnrolling}
          className="w-full"
        >
          {isEnrolling ? t('courseCard.enrollingButton') : t('courseCard.enrollButton')}
        </Button>
      </CardFooter>
    </Card>
  );
});

OptimizedCourseCard.displayName = 'OptimizedCourseCard';

export default OptimizedCourseCard;
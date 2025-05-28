
import { memo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, Users } from "lucide-react";

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
  const handleEnroll = () => {
    onEnroll(course.id);
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
            <span>{course.student_count} students</span>
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
              <span>{course.estimated_duration}</span>
            </div>
          )}
          
          {course.instructor_name && (
            <p className="text-xs">
              Instructor: {course.instructor_name}
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
          {isEnrolling ? "Enrolling..." : "Enroll Now"}
        </Button>
      </CardFooter>
    </Card>
  );
});

OptimizedCourseCard.displayName = 'OptimizedCourseCard';

export default OptimizedCourseCard;

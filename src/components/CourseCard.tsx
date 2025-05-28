
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  course: {
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
  };
  onEnroll: (courseId: string) => void;
}

const CourseCard = ({ course, onEnroll }: CourseCardProps) => {
  const navigate = useNavigate();

  const formatDuration = (duration: string | null) => {
    if (!duration) return 'Self-paced';
    
    try {
      const match = duration.match(/(\d+)/);
      if (match) {
        const hours = parseInt(match[1]);
        return `${Math.floor(hours / 60)}h ${hours % 60}m`;
      }
      return 'Self-paced';
    } catch {
      return 'Self-paced';
    }
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/course/${course.id}`)}
    >
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary">
            {course.course_categories?.name || 'General'}
          </Badge>
          <Badge 
            variant={course.difficulty_level === 'beginner' ? 'default' : 
                     course.difficulty_level === 'intermediate' ? 'secondary' : 'destructive'}
          >
            {course.difficulty_level || 'beginner'}
          </Badge>
        </div>
        
        <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {course.student_count} students
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
            {course.rating?.toFixed(1) || '0.0'}
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Clock className="w-4 h-4 mr-1" />
          {formatDuration(course.estimated_duration)}
        </div>

        <div className="text-sm text-gray-600 mb-4">
          By {course.users_profiles?.display_name || 'Anonymous'}
        </div>
        
        <Button 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onEnroll(course.id);
          }}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Enroll Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;

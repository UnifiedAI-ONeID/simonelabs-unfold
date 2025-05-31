
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Star } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  students: number;
  rating: number;
  progress: number;
  image: string;
  status: string;
  category: string;
}

interface CourseCardProps {
  course: Course;
  onEdit: (courseId: number) => void;
  onAnalytics: (courseId: number) => void;
}

const CourseCard = ({ course, onEdit, onAnalytics }: CourseCardProps) => {
  return (
    <Card className="simonelabs-glass-card hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-32 sm:h-48 object-cover"
        />
        <Badge 
          className={`absolute top-2 sm:top-4 right-2 sm:right-4 text-xs ${
            course.status === 'Published' 
              ? 'bg-simonelabs-success/20 text-simonelabs-success border-simonelabs-success/30' 
              : 'bg-simonelabs-warning/20 text-simonelabs-warning border-simonelabs-warning/30'
          }`}
        >
          {course.status}
        </Badge>
      </div>
      
      <CardHeader className="p-3 sm:p-4 pb-2">
        <Badge variant="secondary" className="w-fit mb-2 text-xs bg-muted text-muted-foreground">
          {course.category}
        </Badge>
        <CardTitle className="text-sm sm:text-lg leading-tight heading">{course.title}</CardTitle>
        <CardDescription className="text-xs sm:text-sm">{course.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            {course.students.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-simonelabs-warning fill-current" />
            {course.rating}
          </div>
        </div>
        
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-1.5 sm:h-2" />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs sm:text-sm border-border hover:bg-muted"
            onClick={() => onEdit(course.id)}
          >
            Edit Course
          </Button>
          <Button 
            size="sm" 
            className="flex-1 text-xs sm:text-sm simonelabs-primary-button"
            onClick={() => onAnalytics(course.id)}
          >
            View Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;

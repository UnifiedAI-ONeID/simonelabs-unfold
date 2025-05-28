
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  status: string;
}

interface Section {
  id: string;
}

interface CourseHeaderProps {
  course: Course;
  sections: Section[] | undefined;
  onPreview: () => void;
  onPublish: () => void;
  isPublishing: boolean;
}

const CourseHeader = ({ course, sections, onPreview, onPublish, isPublishing }: CourseHeaderProps) => {
  return (
    <div className="mb-8 flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
        <div className="flex items-center gap-2">
          <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
            {course.status}
          </Badge>
          <span className="text-gray-600">
            {sections?.length || 0} sections
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onPreview}>
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        {course.status !== 'published' && sections && sections.length > 0 && (
          <Button 
            onClick={onPublish}
            disabled={isPublishing}
          >
            Publish Course
          </Button>
        )}
      </div>
    </div>
  );
};

export default CourseHeader;

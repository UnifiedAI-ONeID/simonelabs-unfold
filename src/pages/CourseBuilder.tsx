
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCourseBuilder } from '@/hooks/useCourseBuilder';
import CourseHeader from '@/components/CourseBuilder/CourseHeader';
import SectionsList from '@/components/CourseBuilder/SectionsList';
import AddSectionForm from '@/components/CourseBuilder/AddSectionForm';
import CourseSettings from '@/components/CourseBuilder/CourseSettings';

const CourseBuilder = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    course,
    sections,
    isLoading,
    addSection,
    isAddingSection,
    publishCourse,
    isPublishing,
  } = useCourseBuilder(courseId);

  const handleAddSection = (sectionData: any) => {
    if (!sectionData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a section title.",
        variant: "destructive",
      });
      return;
    }

    addSection(sectionData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course || course.instructor_id !== user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <p className="text-gray-600 mb-4">You don't have permission to edit this course.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <CourseHeader
          course={course}
          sections={sections}
          onPreview={() => navigate('/courses')}
          onPublish={() => publishCourse()}
          isPublishing={isPublishing}
        />

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <SectionsList sections={sections} />
            <AddSectionForm 
              onAddSection={handleAddSection}
              isLoading={isAddingSection}
            />
          </TabsContent>

          <TabsContent value="settings">
            <CourseSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseBuilder;

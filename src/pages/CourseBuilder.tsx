
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSecureCourseBuilder } from '@/hooks/useSecureCourseBuilder';
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
  } = useSecureCourseBuilder(courseId);

  const handleAddSection = (sectionData: any) => {
    if (!sectionData.title?.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a section title.",
        variant: "destructive",
      });
      return;
    }

    addSection(sectionData);
  };

  // Security: redirect if not authenticated
  if (!user) {
    navigate('/auth');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Course not found
          </h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to edit this course or it doesn't exist.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
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

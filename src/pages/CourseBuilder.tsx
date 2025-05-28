
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, Eye, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const CourseBuilder = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newSection, setNewSection] = useState({
    title: '',
    content: '',
    video_url: '',
  });

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  const { data: sections } = useQuery({
    queryKey: ['course-sections', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_sections')
        .select('*')
        .eq('course_id', courseId)
        .order('order');
      
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  const addSectionMutation = useMutation({
    mutationFn: async (sectionData: any) => {
      const maxOrder = sections?.length ? Math.max(...sections.map(s => s.order)) : 0;
      
      const { data, error } = await supabase
        .from('course_sections')
        .insert({
          ...sectionData,
          course_id: courseId,
          order: maxOrder + 1,
          content: { text: sectionData.content },
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-sections', courseId] });
      setNewSection({ title: '', content: '', video_url: '' });
      toast({
        title: "Section added successfully!",
        description: "Your new section has been added to the course.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding section",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const publishCourseMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('courses')
        .update({ status: 'published' })
        .eq('id', courseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast({
        title: "Course published!",
        description: "Your course is now live and visible to students.",
      });
    },
  });

  const handleAddSection = () => {
    if (!newSection.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a section title.",
        variant: "destructive",
      });
      return;
    }

    addSectionMutation.mutate(newSection);
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
            <Button variant="outline" onClick={() => navigate('/courses')}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            {course.status !== 'published' && sections && sections.length > 0 && (
              <Button 
                onClick={() => publishCourseMutation.mutate()}
                disabled={publishCourseMutation.isPending}
              >
                Publish Course
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {/* Existing Sections */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Course Sections</h2>
              {sections?.map((section, index) => (
                <Card key={section.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {index + 1}. {section.title}
                        </CardTitle>
                        {section.video_url && (
                          <CardDescription>
                            Video: {section.video_url}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      {(section.content as any)?.text || 'No content added yet'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add New Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Section
                </CardTitle>
                <CardDescription>
                  Create a new section for your course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="section-title">Section Title</Label>
                  <Input
                    id="section-title"
                    value={newSection.title}
                    onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter section title"
                  />
                </div>

                <div>
                  <Label htmlFor="section-content">Content</Label>
                  <Textarea
                    id="section-content"
                    value={newSection.content}
                    onChange={(e) => setNewSection(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter section content"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="video-url">Video URL (optional)</Label>
                  <Input
                    id="video-url"
                    value={newSection.video_url}
                    onChange={(e) => setNewSection(prev => ({ ...prev, video_url: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <Button 
                  onClick={handleAddSection}
                  disabled={addSectionMutation.isPending}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {addSectionMutation.isPending ? 'Adding...' : 'Add Section'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
                <CardDescription>
                  Manage your course settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Course settings will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseBuilder;

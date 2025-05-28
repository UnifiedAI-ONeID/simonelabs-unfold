
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Clock, Star, Users, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: string | null;
  student_count: number;
  rating: number | null;
  estimated_duration: string | null;
  category_id: string | null;
  course_categories: {
    name: string;
  } | null;
  users_profiles: {
    display_name: string | null;
  } | null;
}

const Courses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: courses, isLoading } = useQuery({
    queryKey: ['published-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_categories (
            name
          ),
          users_profiles!courses_instructor_id_fkey (
            display_name
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Course[];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['course-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to enroll in courses.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress: 0,
          completed: false,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already enrolled",
            description: "You're already enrolled in this course!",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Enrolled successfully!",
        description: "You can now access this course from your dashboard.",
      });
    } catch (error: any) {
      toast({
        title: "Enrollment failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty_level === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || course.category_id === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const formatDuration = (duration: string | null) => {
    if (!duration) return 'Self-paced';
    
    try {
      // Extract the number from the duration string (e.g., "2 weeks" -> "2")
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-64 bg-gray-200" />
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

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses?.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
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
                  onClick={() => handleEnroll(course.id)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses?.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;

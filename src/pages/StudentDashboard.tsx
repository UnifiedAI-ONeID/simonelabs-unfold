
import React from 'react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Trophy, Star, Play } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useEnhancedAuth();

  const enrolledCourses = [
    {
      id: 1,
      title: "Introduction to React",
      instructor: "Sarah Wilson",
      progress: 65,
      totalLessons: 12,
      completedLessons: 8,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop&crop=entropy",
      nextLesson: "React Hooks Advanced"
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      instructor: "Mike Johnson",
      progress: 90,
      totalLessons: 15,
      completedLessons: 14,
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=240&fit=crop&crop=entropy",
      nextLesson: "Final Project"
    },
    {
      id: 3,
      title: "UI/UX Design Basics",
      instructor: "Emily Chen",
      progress: 30,
      totalLessons: 10,
      completedLessons: 3,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=240&fit=crop&crop=entropy",
      nextLesson: "Color Theory"
    }
  ];

  const stats = [
    { label: "Courses Enrolled", value: "3", icon: BookOpen, color: "text-blue-600" },
    { label: "Hours Studied", value: "47", icon: Clock, color: "text-green-600" },
    { label: "Certificates", value: "2", icon: Trophy, color: "text-yellow-600" },
    { label: "Current Streak", value: "7 days", icon: Star, color: "text-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navigation />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-muted-foreground">Continue your learning journey</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Current Courses */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-video w-full bg-cover bg-center" 
                       style={{ backgroundImage: `url(${course.image})` }}>
                    <div className="w-full h-full bg-black/20 flex items-center justify-center">
                      <Button size="sm" className="bg-white/90 text-black hover:bg-white">
                        <Play className="h-4 w-4 mr-2" />
                        Continue
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                        <span>Next: {course.nextLesson}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

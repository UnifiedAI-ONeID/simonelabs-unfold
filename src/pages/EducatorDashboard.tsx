
import React from 'react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, DollarSign, TrendingUp, Plus, Edit, BarChart3 } from 'lucide-react';

const EducatorDashboard = () => {
  const { user } = useEnhancedAuth();

  const myCourses = [
    {
      id: 1,
      title: "Advanced React Development",
      description: "Master modern React patterns and best practices",
      students: 1247,
      rating: 4.8,
      revenue: 15680,
      status: "Published",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop&crop=entropy"
    },
    {
      id: 2,
      title: "JavaScript ES6+ Masterclass",
      description: "Complete guide to modern JavaScript features",
      students: 892,
      rating: 4.9,
      revenue: 11240,
      status: "Published",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=240&fit=crop&crop=entropy"
    },
    {
      id: 3,
      title: "Web Development Bootcamp",
      description: "From beginner to full-stack developer",
      students: 45,
      rating: 4.7,
      revenue: 0,
      status: "Draft",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=240&fit=crop&crop=entropy"
    }
  ];

  const stats = [
    { label: "Total Students", value: "2,184", icon: Users, color: "text-blue-600" },
    { label: "Published Courses", value: "12", icon: BookOpen, color: "text-green-600" },
    { label: "Monthly Revenue", value: "$8,450", icon: DollarSign, color: "text-yellow-600" },
    { label: "Avg. Rating", value: "4.8", icon: TrendingUp, color: "text-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navigation />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Educator Dashboard
              </h1>
              <p className="text-muted-foreground">Manage your courses and track your success</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create New Course
            </Button>
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

          {/* My Courses */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {myCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-video w-full bg-cover bg-center" 
                       style={{ backgroundImage: `url(${course.image})` }}>
                    <div className="w-full h-full bg-black/20 flex items-end p-4">
                      <Badge variant={course.status === 'Published' ? 'default' : 'secondary'}>
                        {course.status}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.students} students
                        </span>
                        <span className="flex items-center gap-1">
                          ⭐ {course.rating}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Revenue: ${course.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Button>
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

export default EducatorDashboard;


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Star, 
  Users, 
  Clock, 
  BookOpen,
  Video,
  Calendar,
  Settings
} from "lucide-react";

const Dashboard = () => {
  const courses = [
    {
      id: 1,
      title: "Advanced React Development",
      description: "Master modern React patterns and best practices",
      students: 1247,
      rating: 4.8,
      progress: 85,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=240&fit=crop&crop=entropy",
      status: "Published",
      category: "Development"
    },
    {
      id: 2,
      title: "AI & Machine Learning Fundamentals",
      description: "Introduction to artificial intelligence and ML concepts",
      students: 892,
      rating: 4.9,
      progress: 60,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=240&fit=crop&crop=entropy",
      status: "Draft",
      category: "AI/ML"
    },
    {
      id: 3,
      title: "UX Design Masterclass",
      description: "Complete guide to user experience design",
      students: 2156,
      rating: 4.7,
      progress: 100,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=240&fit=crop&crop=entropy",
      status: "Published",
      category: "Design"
    }
  ];

  const stats = [
    { label: "Students", value: "4.3K", icon: Users, color: "text-simonelabs-primary" },
    { label: "Courses", value: "12", icon: BookOpen, color: "text-simonelabs-secondary" },
    { label: "Rating", value: "4.8", icon: Star, color: "text-simonelabs-warning" },
    { label: "Revenue", value: "$25K", icon: Clock, color: "text-simonelabs-success" }
  ];

  return (
    <section id="dashboard" className="py-8 sm:py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground heading">
                Welcome back, Sarah!
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Here's what's happening with your courses today.
              </p>
            </div>
            <Button className="simonelabs-primary-button w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create New Course
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="simonelabs-glass-card">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-lg sm:text-2xl font-bold ${stat.color} heading`}>{stat.value}</p>
                  </div>
                  <div className="self-end sm:self-auto">
                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card className="simonelabs-glass-card hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-simonelabs-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Video className="w-6 h-6 sm:w-8 sm:h-8 text-simonelabs-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base heading">AI Course Generator</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Create a complete course outline with AI assistance</p>
            </CardContent>
          </Card>

          <Card className="simonelabs-glass-card hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-simonelabs-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-simonelabs-secondary" />
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base heading">Schedule Live Session</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Set up live classes and virtual events</p>
            </CardContent>
          </Card>

          <Card className="simonelabs-glass-card hover:shadow-lg transition-all duration-200 cursor-pointer sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-simonelabs-success/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-simonelabs-success" />
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base heading">Analytics Dashboard</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">View detailed performance insights</p>
            </CardContent>
          </Card>
        </div>

        {/* Courses Section */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground heading">Your Courses</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="simonelabs-glass-card hover:shadow-lg transition-all duration-200 overflow-hidden">
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
                    <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm border-border hover:bg-muted">
                      Edit Course
                    </Button>
                    <Button size="sm" className="flex-1 text-xs sm:text-sm simonelabs-primary-button">
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

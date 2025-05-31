import { 
  Users, 
  Clock, 
  BookOpen,
  Star
} from "lucide-react";
import DashboardHeader from "./Dashboard/DashboardHeader";
import StatsGrid from "./Dashboard/StatsGrid";
import QuickActions from "./Dashboard/QuickActions";
import CourseCard from "./Dashboard/CourseCard";

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

  const handleCreateCourse = () => {
    console.log("Navigate to create course");
  };

  const handleAIGenerator = () => {
    console.log("Navigate to AI generator");
  };

  const handleScheduleSession = () => {
    console.log("Schedule live session");
  };

  const handleAnalytics = () => {
    console.log("Navigate to analytics");
  };

  const handleEditCourse = (courseId: number) => {
    console.log("Edit course:", courseId);
  };

  const handleCourseAnalytics = (courseId: number) => {
    console.log("View course analytics:", courseId);
  };

  return (
    <section id="dashboard" className="py-8 sm:py-12 bg-background">
      <div className="container mx-auto px-4">
        <DashboardHeader userName="Sarah" onCreateCourse={handleCreateCourse} />
        
        <StatsGrid stats={stats} />
        
        <QuickActions 
          onAIGenerator={handleAIGenerator}
          onScheduleSession={handleScheduleSession}
          onAnalytics={handleAnalytics}
        />

        {/* Courses Section */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground heading">Your Courses</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course}
                onEdit={handleEditCourse}
                onAnalytics={handleCourseAnalytics}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

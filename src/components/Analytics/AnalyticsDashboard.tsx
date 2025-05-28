
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign,
  Clock,
  Target,
  Award,
  Eye
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const AnalyticsDashboard = () => {
  const enrollmentData = [
    { month: 'Jan', enrollments: 45 },
    { month: 'Feb', enrollments: 52 },
    { month: 'Mar', enrollments: 67 },
    { month: 'Apr', enrollments: 81 },
    { month: 'May', enrollments: 95 },
    { month: 'Jun', enrollments: 108 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 2400 },
    { month: 'Feb', revenue: 2800 },
    { month: 'Mar', revenue: 3200 },
    { month: 'Apr', revenue: 3900 },
    { month: 'May', revenue: 4200 },
    { month: 'Jun', revenue: 4800 }
  ];

  const coursePerformance = [
    { name: 'React Development', completionRate: 85, students: 234 },
    { name: 'AI Fundamentals', completionRate: 78, students: 189 },
    { name: 'UX Design', completionRate: 92, students: 156 },
    { name: 'Data Science', completionRate: 73, students: 98 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 65, color: '#8884d8' },
    { name: 'Mobile', value: 28, color: '#82ca9d' },
    { name: 'Tablet', value: 7, color: '#ffc658' }
  ];

  const metrics = [
    {
      title: "Total Students",
      value: "2,847",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Course Completions",
      value: "1,234",
      change: "+8.2%",
      icon: Award,
      color: "text-green-600"
    },
    {
      title: "Monthly Revenue",
      value: "$24,890",
      change: "+15.3%",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Avg. Watch Time",
      value: "42.5 min",
      change: "+3.1%",
      icon: Clock,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your course performance and student engagement</p>
        </div>
        <Badge variant="outline" className="flex items-center">
          <TrendingUp className="w-4 h-4 mr-1" />
          Real-time data
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-green-600 font-medium">{metric.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Student Enrollments</CardTitle>
            <CardDescription>Monthly enrollment trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enrollments" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>Monthly revenue in USD</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance & Device Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>Completion rates by course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coursePerformance.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{course.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{course.students} students</span>
                      <span className="text-sm font-medium">{course.completionRate}%</span>
                    </div>
                  </div>
                  <Progress value={course.completionRate} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
            <CardDescription>Student access by device</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

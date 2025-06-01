
import React from 'react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  AlertTriangle, 
  Shield, 
  Settings,
  TrendingUp,
  UserCheck,
  Flag
} from 'lucide-react';

const AdministrationDashboard = () => {
  const { user } = useEnhancedAuth();

  const recentActivity = [
    {
      id: 1,
      type: "user_signup",
      message: "New user registered: john.doe@example.com",
      timestamp: "2 minutes ago",
      status: "info"
    },
    {
      id: 2,
      type: "course_published",
      message: "Course 'Advanced React' published by Sarah Wilson",
      timestamp: "15 minutes ago",
      status: "success"
    },
    {
      id: 3,
      type: "payment_failed",
      message: "Payment failed for subscription ID: sub_1234567",
      timestamp: "1 hour ago",
      status: "warning"
    },
    {
      id: 4,
      type: "security_alert",
      message: "Multiple failed login attempts from IP: 192.168.1.1",
      timestamp: "2 hours ago",
      status: "error"
    }
  ];

  const stats = [
    { label: "Total Users", value: "15,847", icon: Users, color: "text-blue-600", change: "+12%" },
    { label: "Active Courses", value: "342", icon: BookOpen, color: "text-green-600", change: "+8%" },
    { label: "Monthly Revenue", value: "$125,430", icon: DollarSign, color: "text-yellow-600", change: "+15%" },
    { label: "Support Tickets", value: "23", icon: AlertTriangle, color: "text-red-600", change: "-5%" }
  ];

  const pendingActions = [
    { id: 1, type: "Course Review", description: "5 courses pending approval", count: 5 },
    { id: 2, type: "User Reports", description: "3 user reports to review", count: 3 },
    { id: 3, type: "Refund Requests", description: "8 refund requests pending", count: 8 },
    { id: 4, type: "Content Flags", description: "2 flagged content items", count: 2 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navigation />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Administration Dashboard
              </h1>
              <p className="text-muted-foreground">Platform overview and management tools</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
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
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.change} from last month
                      </p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingActions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{action.type}</p>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{action.count}</Badge>
                        <Button size="sm" variant="outline">Review</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(activity.status).replace('text-', 'bg-')}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministrationDashboard;

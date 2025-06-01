
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Shield } from "lucide-react";
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/hooks/useUserRole';

const RoleSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useEnhancedAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const roles = [
    {
      id: 'student' as UserRole,
      icon: GraduationCap,
      title: "Student",
      description: "Learn new skills with AI-powered courses and interactive content",
      features: ["Personalized learning paths", "Interactive courses", "Study groups"]
    },
    {
      id: 'educator' as UserRole,
      icon: Users,
      title: "Educator",
      description: "Create and monetize your expertise with powerful teaching tools",
      features: ["Course creation tools", "Student analytics", "Revenue sharing"]
    }
  ];

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { role: selectedRole }
      });

      if (error) throw error;

      toast({
        title: "Role selected successfully!",
        description: `Welcome to SimoneLabs as a ${selectedRole}!`,
      });

      // Navigate to the appropriate landing page
      switch (selectedRole) {
        case 'student':
          navigate('/student');
          break;
        case 'educator':
          navigate('/educator');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Error selecting role",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Choose Your Role</CardTitle>
          <CardDescription className="text-lg">
            Select how you'll be using SimoneLabs to get the best experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedRole === role.id
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border hover:border-primary/50 hover:shadow-md'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                    selectedRole === role.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <role.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                    <ul className="space-y-1">
                      {role.features.map((feature, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button
              onClick={handleRoleSelection}
              disabled={!selectedRole || isUpdating}
              className="px-8 py-3 text-lg"
            >
              {isUpdating ? 'Setting up your account...' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelectionPage;


import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, X, ChevronRight, Lightbulb, BookOpen, Users } from "lucide-react";
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

interface WelcomeAssistantProps {
  onClose: () => void;
}

export const WelcomeAssistant = ({ onClose }: WelcomeAssistantProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useEnhancedAuth();
  
  const userRole = user?.user_metadata?.role || 'student';

  const getStepsForRole = () => {
    switch (userRole) {
      case 'student':
        return [
          {
            title: "Welcome to SimoneLabs!",
            description: "I'm your AI learning assistant. Let me help you get started with personalized learning.",
            icon: Bot,
            action: "Let's explore your learning path"
          },
          {
            title: "Discover Your Learning Style",
            description: "Our AI adapts to how you learn best - visual, auditory, or hands-on approaches.",
            icon: Lightbulb,
            action: "Take the learning style quiz"
          },
          {
            title: "Explore Course Catalog",
            description: "Browse our extensive library of AI-powered courses tailored to your interests.",
            icon: BookOpen,
            action: "Browse courses"
          },
          {
            title: "Join Study Groups",
            description: "Connect with fellow learners and participate in collaborative learning experiences.",
            icon: Users,
            action: "Find study groups"
          }
        ];
      case 'educator':
        return [
          {
            title: "Welcome, Educator!",
            description: "I'm here to help you create amazing learning experiences with AI-powered tools.",
            icon: Bot,
            action: "Explore educator features"
          },
          {
            title: "AI Course Builder",
            description: "Use our AI to generate course outlines, content, and assessments automatically.",
            icon: Lightbulb,
            action: "Try the course builder"
          },
          {
            title: "Student Analytics",
            description: "Track student progress and get AI insights to improve your teaching methods.",
            icon: BookOpen,
            action: "View analytics dashboard"
          },
          {
            title: "Monetize Your Expertise",
            description: "Set up pricing for your courses and start earning from your knowledge.",
            icon: Users,
            action: "Set up course pricing"
          }
        ];
      default:
        return [
          {
            title: "Welcome to SimoneLabs!",
            description: "Your AI-powered learning platform awaits. Let's get you started!",
            icon: Bot,
            action: "Begin your journey"
          }
        ];
    }
  };

  const steps = getStepsForRole();
  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto relative">
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 z-10"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <currentStepData.icon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
            <CardDescription className="mt-2">
              {currentStepData.description}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex justify-center space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleSkip}
              variant="outline"
              className="flex-1"
            >
              Skip Tour
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                currentStepData.action
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

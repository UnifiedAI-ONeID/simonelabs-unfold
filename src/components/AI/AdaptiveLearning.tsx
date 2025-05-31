import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, ArrowRight } from "lucide-react";

interface LearningPath {
  id: string;
  title: string;
  difficulty: string;
  progress: number;
  nextTopic: string;
}

const AdaptiveLearning = () => {
  const [currentPath, setCurrentPath] = useState<LearningPath>({
    id: '1',
    title: 'Web Development Path',
    difficulty: 'Intermediate',
    progress: 65,
    nextTopic: 'React Hooks Advanced Patterns'
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Adaptive Learning Path
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{currentPath.title}</h3>
              <Badge variant="outline">{currentPath.difficulty}</Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{currentPath.progress}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          <Progress value={currentPath.progress} />
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Next Topic</div>
                <div className="font-medium">{currentPath.nextTopic}</div>
              </div>
              <Button>
                Continue Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Personalized Recommendations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Advanced State Management",
              "Performance Optimization",
              "Testing Strategies",
              "Security Best Practices"
            ].map((topic, index) => (
              <Button key={index} variant="outline" className="justify-start">
                {topic}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdaptiveLearning;
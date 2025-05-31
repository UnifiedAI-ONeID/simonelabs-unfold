import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Clock, Award } from "lucide-react";

interface LearningMetric {
  label: string;
  value: number;
  target: number;
  icon: any;
}

const ProgressTracker = () => {
  const metrics: LearningMetric[] = [
    {
      label: "Course Progress",
      value: 65,
      target: 100,
      icon: TrendingUp
    },
    {
      label: "Learning Goals",
      value: 4,
      target: 5,
      icon: Target
    },
    {
      label: "Study Hours",
      value: 12,
      target: 20,
      icon: Clock
    },
    {
      label: "Achievements",
      value: 8,
      target: 10,
      icon: Award
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <metric.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{metric.label}</span>
                  </div>
                  <Badge variant="outline">
                    {metric.value}/{metric.target}
                  </Badge>
                </div>
                <Progress value={(metric.value / metric.target) * 100} />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Recent Achievements</h3>
            <div className="space-y-2">
              {[
                "Completed Introduction Module",
                "Perfect Quiz Score",
                "7-Day Study Streak"
              ].map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                >
                  <Award className="h-4 w-4 text-primary" />
                  <span>{achievement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
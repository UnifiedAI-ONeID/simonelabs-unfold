
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LearningData } from './types';

interface CourseProgressCardProps {
  courseProgress: LearningData['courseProgress'];
}

const CourseProgressCard = ({ courseProgress }: CourseProgressCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courseProgress.map((course, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{course.course}</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
              <p className="text-xs text-gray-500">{course.timeSpent}h spent</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseProgressCard;

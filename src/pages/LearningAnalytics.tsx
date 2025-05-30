
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const LearningAnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-background pt-16 sm:pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground heading">
            Learning Analytics
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
            Track your progress and optimize your learning journey
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Analytics Feature Disabled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4 py-8">
              <div className="text-muted-foreground">
                Learning analytics functionality has been simplified and is not available in this version.
              </div>
              <div className="text-sm text-muted-foreground">
                Advanced analytics, progress tracking, and achievement systems have been removed to focus on core course functionality.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearningAnalyticsPage;

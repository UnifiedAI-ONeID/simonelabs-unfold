
import React from 'react';
import LearningAnalytics from '@/components/Analytics/LearningAnalytics';

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
        
        <LearningAnalytics />
      </div>
    </div>
  );
};

export default LearningAnalyticsPage;

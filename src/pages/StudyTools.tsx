
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const StudyTools = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Tools</h1>
          <p className="text-gray-600">Enhance your learning with notes, flashcards, and discussions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Study Tools Feature Disabled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4 py-8">
              <div className="text-muted-foreground">
                Study tools functionality has been simplified and is not available in this version.
              </div>
              <div className="text-sm text-muted-foreground">
                Features like notes, flashcards, and discussions have been removed to focus on core course functionality.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyTools;

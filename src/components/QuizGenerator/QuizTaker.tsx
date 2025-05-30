
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface QuizTakerProps {
  quizId: string;
  onComplete?: () => void;
}

// Since quiz tables were removed, this component now shows a disabled message
const QuizTaker: React.FC<QuizTakerProps> = ({ quizId, onComplete }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Quiz Feature Disabled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4 py-8">
            <div className="text-muted-foreground">
              Quiz functionality has been simplified and is not available in this version of the application.
            </div>
            <div className="text-sm text-muted-foreground">
              The quiz system, including questions, answers, and scoring, has been removed to focus on core course functionality.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizTaker;

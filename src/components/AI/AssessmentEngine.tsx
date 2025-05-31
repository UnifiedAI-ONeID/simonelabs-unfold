import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

const AssessmentEngine = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const questions: Question[] = [
    {
      id: '1',
      text: 'What is the primary purpose of React hooks?',
      options: [
        'To add state to functional components',
        'To create class components',
        'To style components',
        'To handle routing'
      ],
      correctAnswer: 'To add state to functional components'
    },
    // Add more questions as needed
  ];

  const handleAnswer = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Great job! Moving to next question.",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was: ${questions[currentQuestion].correctAnswer}`,
        variant: "destructive",
      });
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      setIsComplete(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isComplete ? (
          <>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant="outline">
                  Question {currentQuestion + 1} of {questions.length}
                </Badge>
                <Badge variant="secondary">Score: {score}</Badge>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium mb-4">{questions[currentQuestion].text}</p>
                <div className="space-y-2">
                  {questions[currentQuestion].options.map((option) => (
                    <Button
                      key={option}
                      variant={selectedAnswer === option ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedAnswer(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleAnswer}
              disabled={!selectedAnswer}
            >
              Submit Answer
            </Button>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {score > questions.length / 2 ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : (
                <AlertCircle className="h-12 w-12 text-yellow-500" />
              )}
            </div>
            <h3 className="text-xl font-bold">Assessment Complete!</h3>
            <p className="text-muted-foreground">
              You scored {score} out of {questions.length}
            </p>
            <Button
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setIsComplete(false);
                setSelectedAnswer('');
              }}
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentEngine;
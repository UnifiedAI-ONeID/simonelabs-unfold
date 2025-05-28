
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useQuiz, useSubmitQuizAttempt } from '@/hooks/useQuizzes';

interface QuizTakerProps {
  quizId: string;
  onComplete?: () => void;
}

const QuizTaker: React.FC<QuizTakerProps> = ({ quizId, onComplete }) => {
  const { data: quiz, isLoading } = useQuiz(quizId);
  const submitQuizAttempt = useSubmitQuizAttempt();
  
  const [answers, setAnswers] = useState<{ [questionId: string]: { selectedOptionId?: string; answerText?: string } }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswerChange = (questionId: string, value: string, type: 'option' | 'text') => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [type === 'option' ? 'selectedOptionId' : 'answerText']: value
      }
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      selectedOptionId: answer.selectedOptionId,
      answerText: answer.answerText
    }));

    try {
      await submitQuizAttempt.mutateAsync({
        quizId,
        answers: formattedAnswers
      });
      onComplete?.();
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quiz) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Quiz not found
          </div>
        </CardContent>
      </Card>
    );
  }

  const questions = quiz.quiz_questions || [];
  const question = questions[currentQuestion];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{quiz.title}</CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {quiz.time_limit && `${quiz.time_limit} min`}
            </div>
          </div>
          {quiz.description && (
            <p className="text-muted-foreground">{quiz.description}</p>
          )}
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {totalQuestions}
            </div>
            <div className="text-sm text-muted-foreground">
              {answeredQuestions}/{totalQuestions} answered
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all" 
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {question && (
            <>
              <h3 className="text-lg font-medium">{question.question_text}</h3>
              
              {question.question_type === 'multiple_choice' && (
                <RadioGroup
                  value={answers[question.id]?.selectedOptionId || ''}
                  onValueChange={(value) => handleAnswerChange(question.id, value, 'option')}
                >
                  {question.quiz_question_options?.map((option: any) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        {option.option_text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.question_type === 'true_false' && (
                <RadioGroup
                  value={answers[question.id]?.answerText || ''}
                  onValueChange={(value) => handleAnswerChange(question.id, value, 'text')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="true" />
                    <Label htmlFor="true" className="cursor-pointer">True</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="false" />
                    <Label htmlFor="false" className="cursor-pointer">False</Label>
                  </div>
                </RadioGroup>
              )}

              {question.question_type === 'short_answer' && (
                <Textarea
                  placeholder="Enter your answer..."
                  value={answers[question.id]?.answerText || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value, 'text')}
                  rows={3}
                />
              )}
            </>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={submitQuizAttempt.isPending || answeredQuestions === 0}
                className="min-w-32"
              >
                {submitQuizAttempt.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Quiz
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(Math.min(totalQuestions - 1, currentQuestion + 1))}
                disabled={currentQuestion === totalQuestions - 1}
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {answeredQuestions < totalQuestions && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                You have {totalQuestions - answeredQuestions} unanswered questions
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizTaker;

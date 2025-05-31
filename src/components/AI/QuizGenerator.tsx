import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

const QuizGenerator = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const { toast } = useToast();

  const generateQuiz = async () => {
    if (!topic.trim() || isGenerating) return;
    
    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockQuestions: Question[] = [
        {
          id: '1',
          text: 'What is the main purpose of React hooks?',
          type: 'multiple_choice',
          options: [
            'To add state to functional components',
            'To create class components',
            'To style components',
            'To handle routing'
          ],
          correctAnswer: 'To add state to functional components',
          explanation: 'React hooks allow functional components to use state and other React features.'
        }
      ];

      setQuestions(mockQuestions);
      
      toast({
        title: "Quiz Generated",
        description: "Your AI-generated quiz is ready.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Quiz Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter quiz topic..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Questions</label>
              <Input
                type="number"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                min={1}
                max={20}
              />
            </div>
          </div>

          <Button
            onClick={generateQuiz}
            disabled={!topic.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Quiz
              </>
            )}
          </Button>
        </div>

        {questions.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Generated Questions</h3>
            {questions.map((question) => (
              <Card key={question.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{question.text}</p>
                    <Badge>{question.type}</Badge>
                  </div>

                  {question.type === 'multiple_choice' && (
                    <div className="space-y-2">
                      {question.options?.map((option, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-lg border ${
                            option === question.correctAnswer
                              ? 'border-green-500 bg-green-50'
                              : ''
                          }`}
                        >
                          {option === question.correctAnswer && (
                            <CheckCircle className="h-4 w-4 text-green-500 inline mr-2" />
                          )}
                          {option}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizGenerator;
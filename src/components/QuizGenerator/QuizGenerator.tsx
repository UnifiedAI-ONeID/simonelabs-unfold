
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Brain, FileText, CheckCircle } from 'lucide-react';
import { useQuizGenerator } from '@/hooks/useQuizGenerator';

interface QuizGeneratorProps {
  courseId?: string;
  sectionId?: string;
  onQuizGenerated?: (quiz: any) => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ courseId, sectionId, onQuizGenerated }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [questionCount, setQuestionCount] = useState(5);
  const [courseContent, setCourseContent] = useState('');
  const [questionTypes, setQuestionTypes] = useState<string[]>(['multiple_choice']);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const { generateQuiz, isGenerating } = useQuizGenerator();

  const handleQuestionTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setQuestionTypes([...questionTypes, type]);
    } else {
      setQuestionTypes(questionTypes.filter(t => t !== type));
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      return;
    }

    try {
      const result = await generateQuiz({
        topic,
        difficulty,
        questionCount,
        questionTypes,
        courseContent: courseContent.trim() || undefined,
        courseId,
        sectionId
      });

      setGeneratedQuestions(result.questions);
      
      // Since we simplified the quiz system, we just pass the questions
      if (onQuizGenerated) {
        onQuizGenerated({ questions: result.questions });
      }
    } catch (error) {
      console.error('Failed to generate quiz:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Quiz Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Quiz Topic *</Label>
            <Input
              id="topic"
              placeholder="e.g., JavaScript Fundamentals, React Hooks, Data Structures"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionCount">Number of Questions</Label>
              <Input
                id="questionCount"
                type="number"
                min="1"
                max="20"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value) || 5)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Question Types</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="multiple_choice"
                  checked={questionTypes.includes('multiple_choice')}
                  onCheckedChange={(checked) => handleQuestionTypeChange('multiple_choice', checked as boolean)}
                />
                <Label htmlFor="multiple_choice">Multiple Choice</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="true_false"
                  checked={questionTypes.includes('true_false')}
                  onCheckedChange={(checked) => handleQuestionTypeChange('true_false', checked as boolean)}
                />
                <Label htmlFor="true_false">True/False</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="short_answer"
                  checked={questionTypes.includes('short_answer')}
                  onCheckedChange={(checked) => handleQuestionTypeChange('short_answer', checked as boolean)}
                />
                <Label htmlFor="short_answer">Short Answer</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseContent">Course Content (Optional)</Label>
            <Textarea
              id="courseContent"
              placeholder="Paste relevant course content or learning materials to help generate more targeted questions..."
              value={courseContent}
              onChange={(e) => setCourseContent(e.target.value)}
              rows={4}
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !topic.trim() || questionTypes.length === 0}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Generated Quiz Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedQuestions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Q{index + 1}</span>
                    <div className="flex-1">
                      <p className="font-medium">{question.question_text}</p>
                      <span className="text-xs text-muted-foreground capitalize">
                        {question.question_type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  {question.options && (
                    <div className="ml-6 space-y-1">
                      {question.options.map((option: string, optIndex: number) => (
                        <div 
                          key={optIndex} 
                          className={`text-sm p-2 rounded ${
                            option === question.correct_answer 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : 'bg-gray-50'
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.question_type !== 'multiple_choice' && (
                    <div className="ml-6 mt-2">
                      <p className="text-sm text-green-700 bg-green-50 p-2 rounded border border-green-200">
                        <strong>Answer:</strong> {question.correct_answer}
                      </p>
                    </div>
                  )}
                  
                  {question.explanation && (
                    <div className="ml-6 mt-2">
                      <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizGenerator;

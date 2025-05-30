
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface QuizQuestion {
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  correct_answer: string;
  explanation: string;
  options?: string[];
}

interface GenerateQuizParams {
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionCount: number;
  questionTypes: string[];
  courseContent?: string;
  courseId?: string;
  sectionId?: string;
}

// Since quiz tables were removed, this hook now only returns mock data
export const useQuizGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQuiz = async (params: GenerateQuizParams) => {
    setIsGenerating(true);
    try {
      // Since quiz tables were removed, just show an error
      toast({
        title: "Quiz generation disabled",
        description: "Quiz features have been simplified and are not available.",
        variant: "destructive",
      });

      // Return mock data structure
      const mockQuestions: QuizQuestion[] = [
        {
          question_text: "What is React?",
          question_type: "multiple_choice",
          correct_answer: "A JavaScript library for building user interfaces",
          explanation: "React is a popular JavaScript library developed by Facebook for building user interfaces.",
          options: [
            "A JavaScript library for building user interfaces",
            "A database management system",
            "A server-side framework",
            "A CSS preprocessor"
          ]
        }
      ];

      return { questions: mockQuestions };

    } catch (error: any) {
      console.error('Mock quiz generation error:', error);
      toast({
        title: "Generation Failed", 
        description: "Quiz generation is not available in the simplified version.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateQuiz,
    isGenerating
  };
};

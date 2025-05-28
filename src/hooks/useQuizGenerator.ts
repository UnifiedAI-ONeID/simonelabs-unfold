
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

export const useQuizGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQuiz = async (params: GenerateQuizParams) => {
    setIsGenerating(true);
    try {
      // Generate quiz questions using AI
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('ai-quiz-generator', {
        body: {
          topic: params.topic,
          difficulty: params.difficulty,
          questionCount: params.questionCount,
          questionTypes: params.questionTypes,
          courseContent: params.courseContent
        }
      });

      if (aiError) throw aiError;

      const generatedQuestions: QuizQuestion[] = aiResponse.questions;

      // If courseId is provided, save the quiz to the database
      if (params.courseId) {
        const { data: quiz, error: quizError } = await supabase
          .from('quizzes')
          .insert({
            course_id: params.courseId,
            section_id: params.sectionId,
            title: `${params.topic} Quiz`,
            description: `Auto-generated ${params.difficulty} level quiz on ${params.topic}`,
            instructions: 'Answer all questions to the best of your ability.',
            time_limit: params.questionCount * 2, // 2 minutes per question
            created_by: (await supabase.auth.getUser()).data.user?.id
          })
          .select('id')
          .single();

        if (quizError) throw quizError;

        // Save questions and options
        for (let i = 0; i < generatedQuestions.length; i++) {
          const question = generatedQuestions[i];
          
          const { data: savedQuestion, error: questionError } = await supabase
            .from('quiz_questions')
            .insert({
              quiz_id: quiz.id,
              question_text: question.question_text,
              question_type: question.question_type,
              correct_answer: question.correct_answer,
              explanation: question.explanation,
              order_index: i
            })
            .select('id')
            .single();

          if (questionError) throw questionError;

          // Save options for multiple choice questions
          if (question.question_type === 'multiple_choice' && question.options) {
            for (let j = 0; j < question.options.length; j++) {
              const option = question.options[j];
              
              await supabase
                .from('quiz_question_options')
                .insert({
                  question_id: savedQuestion.id,
                  option_text: option,
                  is_correct: option === question.correct_answer,
                  order_index: j
                });
            }
          }
        }

        toast({
          title: "Quiz Generated Successfully!",
          description: `Created a ${params.difficulty} level quiz with ${generatedQuestions.length} questions.`,
        });

        return { quiz, questions: generatedQuestions };
      }

      return { questions: generatedQuestions };

    } catch (error: any) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate quiz. Please try again.",
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

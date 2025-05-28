
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useQuizzes = (courseId?: string) => {
  return useQuery({
    queryKey: ['quizzes', courseId],
    queryFn: async () => {
      let query = supabase
        .from('quizzes')
        .select(`
          *,
          quiz_questions (
            *,
            quiz_question_options (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
};

export const useQuiz = (quizId: string) => {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          quiz_questions (
            *,
            quiz_question_options (*)
          )
        `)
        .eq('id', quizId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!quizId,
  });
};

export const useQuizAttempts = (quizId?: string) => {
  return useQuery({
    queryKey: ['quiz-attempts', quizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('quiz_id', quizId!)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id!)
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!quizId,
  });
};

export const useSubmitQuizAttempt = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      quizId, 
      answers 
    }: { 
      quizId: string; 
      answers: { questionId: string; selectedOptionId?: string; answerText?: string }[] 
    }) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      // Create quiz attempt
      const { data: attempt, error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quizId,
          user_id: user.data.user.id,
          started_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (attemptError) throw attemptError;

      // Save answers
      const answersToInsert = answers.map(answer => ({
        attempt_id: attempt.id,
        question_id: answer.questionId,
        selected_option_id: answer.selectedOptionId,
        answer_text: answer.answerText
      }));

      const { error: answersError } = await supabase
        .from('quiz_attempt_answers')
        .insert(answersToInsert);

      if (answersError) throw answersError;

      // Calculate score and update attempt
      // This would involve checking answers against correct ones
      // For now, we'll just mark as completed
      const { error: updateError } = await supabase
        .from('quiz_attempts')
        .update({
          completed_at: new Date().toISOString(),
          time_spent: Math.floor(Math.random() * 600) + 300 // Random time for demo
        })
        .eq('id', attempt.id);

      if (updateError) throw updateError;

      return attempt;
    },
    onSuccess: () => {
      toast({
        title: "Quiz Submitted!",
        description: "Your quiz has been submitted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

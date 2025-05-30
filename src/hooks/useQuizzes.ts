
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Since quiz tables were removed, this hook now returns mock data
export const useQuizzes = (courseId?: string) => {
  return useQuery({
    queryKey: ['quizzes', courseId],
    queryFn: async () => {
      // Return empty array since quiz functionality was removed
      return [];
    },
    enabled: !!courseId,
  });
};

export const useQuiz = (quizId: string) => {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      // Return null since quiz functionality was removed
      return null;
    },
    enabled: !!quizId,
  });
};

export const useQuizAttempts = (quizId?: string) => {
  return useQuery({
    queryKey: ['quiz-attempts', quizId],
    queryFn: async () => {
      // Return empty array since quiz functionality was removed
      return [];
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
      // Since quiz tables were removed, just return a mock response
      toast({
        title: "Quiz functionality disabled",
        description: "Quiz features have been simplified and are not available.",
        variant: "destructive",
      });
      throw new Error('Quiz functionality has been removed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts'] });
    },
    onError: (error: any) => {
      // Error is expected since functionality was removed
    },
  });
};


import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TutorMessage {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

interface CourseContext {
  id: string;
  title: string;
  description: string;
}

export const useAITutor = () => {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(async (
    message: string, 
    courseContext?: CourseContext,
    userLevel?: string
  ) => {
    if (!message.trim() || isLoading) return;

    const userMessage: TutorMessage = {
      id: Date.now().toString(),
      content: message,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-tutor', {
        body: {
          message,
          courseContext,
          userLevel: userLevel || 'Beginner'
        }
      });

      if (error) {
        throw error;
      }

      const botResponse: TutorMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        type: 'bot',
        timestamp: new Date(),
        suggestions: data.suggestions || []
      };

      setMessages(prev => [...prev, botResponse]);
      return botResponse;

    } catch (error) {
      console.error('Error in AI tutor:', error);
      
      const errorResponse: TutorMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again.",
        type: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorResponse]);
      
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const initializeSession = useCallback((courseContext?: CourseContext) => {
    const welcomeMessage: TutorMessage = {
      id: '1',
      content: `Hi! I'm your AI tutor. ${courseContext ? `I see you're working on "${courseContext.title}". ` : ''}I'm here to help you learn and understand any topic. What would you like to learn about today?`,
      type: 'bot',
      timestamp: new Date(),
      suggestions: [
        "Explain the main concepts",
        "Give me study tips", 
        "Create a practice quiz",
        "Help me understand this better"
      ]
    };
    
    setMessages([welcomeMessage]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    initializeSession
  };
};

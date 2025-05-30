
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DiscussionThread, Reply } from '@/components/Discussions/types';

// Since discussion tables were removed, this hook now uses only mock data
export const useDiscussions = (courseId: string, sectionId?: string) => {
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const { toast } = useToast();

  const fetchThreads = async () => {
    try {
      // Use mock data since discussion_threads table was removed
      const mockThreads: DiscussionThread[] = [
        {
          id: '1',
          title: 'How to approach this assignment?',
          content: 'I\'m having trouble understanding the requirements for the final project.',
          author_id: 'demo-user',
          course_id: courseId,
          topic: 'question',
          tags: ['assignment', 'help'],
          is_answered: false,
          created_at: new Date().toISOString(),
          author_profile: { display_name: 'Demo Student' },
          reply_count: 3
        },
        {
          id: '2',
          title: 'Course feedback',
          content: 'This course has been really helpful! Thank you.',
          author_id: 'demo-user-2',
          course_id: courseId,
          topic: 'general',
          tags: ['feedback', 'thanks'],
          is_answered: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          author_profile: { display_name: 'Another Student' },
          reply_count: 1
        }
      ];

      setThreads(mockThreads);
    } catch (error: any) {
      console.error('Error with mock discussions:', error);
      setThreads([]);
    }
  };

  const fetchReplies = async (threadId: string) => {
    try {
      // Use mock replies since discussion tables were removed
      const mockReplies: Reply[] = [
        {
          id: '1',
          content: 'You should start by reviewing the course materials and breaking down the requirements.',
          author_id: 'demo-instructor',
          thread_id: threadId,
          created_at: new Date().toISOString(),
          author_profile: { display_name: 'Demo Instructor' }
        }
      ];
      setReplies(mockReplies);
    } catch (error: any) {
      console.error('Error with mock replies:', error);
      setReplies([]);
    }
  };

  const createThread = async (threadData: {
    title: string;
    content: string;
    topic: string;
    tags: string[];
  }) => {
    if (!threadData.title || !threadData.content) {
      toast({
        title: "Missing information",
        description: "Please provide both title and content",
        variant: "destructive",
      });
      return false;
    }

    try {
      toast({
        title: "Discussion feature disabled",
        description: "Discussion features have been simplified and are not available.",
        variant: "destructive",
      });
      return false;
    } catch (error: any) {
      toast({
        title: "Error creating discussion",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const addReply = async (content: string, threadId: string) => {
    if (!content.trim()) return false;

    try {
      toast({
        title: "Discussion feature disabled",
        description: "Discussion features have been simplified and are not available.",
        variant: "destructive",
      });
      return false;
    } catch (error: any) {
      toast({
        title: "Error adding reply",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [courseId, sectionId]);

  return {
    threads,
    replies,
    fetchThreads,
    fetchReplies,
    createThread,
    addReply
  };
};

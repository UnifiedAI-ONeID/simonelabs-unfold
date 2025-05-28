
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp, Plus, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DiscussionThread {
  id: string;
  title: string;
  content: string;
  author_id: string;
  course_id: string;
  section_id?: string;
  topic: string;
  tags: string[];
  is_answered: boolean;
  created_at: string;
  author_profile?: {
    display_name: string;
    avatar_url?: string;
  };
  reply_count?: number;
}

interface Reply {
  id: string;
  content: string;
  author_id: string;
  thread_id: string;
  created_at: string;
  author_profile?: {
    display_name: string;
    avatar_url?: string;
  };
}

interface DiscussionForumProps {
  courseId: string;
  sectionId?: string;
}

const DiscussionForum = ({ courseId, sectionId }: DiscussionForumProps) => {
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<DiscussionThread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    topic: 'general',
    tags: [] as string[]
  });
  const [newReply, setNewReply] = useState('');
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchThreads();
  }, [courseId, sectionId]);

  useEffect(() => {
    if (selectedThread) {
      fetchReplies(selectedThread.id);
    }
  }, [selectedThread]);

  const fetchThreads = async () => {
    try {
      let query = supabase
        .from('discussion_threads')
        .select(`
          *,
          users_profiles!discussion_threads_author_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (sectionId) {
        query = query.eq('section_id', sectionId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Get reply counts
      const threadsWithCounts = await Promise.all(
        (data || []).map(async (thread) => {
          const { count } = await supabase
            .from('discussion_replies')
            .select('*', { count: 'exact' })
            .eq('thread_id', thread.id);
          
          return {
            ...thread,
            author_profile: thread.users_profiles,
            reply_count: count || 0
          };
        })
      );

      setThreads(threadsWithCounts);
    } catch (error: any) {
      toast({
        title: "Error fetching discussions",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchReplies = async (threadId: string) => {
    try {
      const { data, error } = await supabase
        .from('discussion_replies')
        .select(`
          *,
          users_profiles!discussion_replies_author_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setReplies((data || []).map(reply => ({
        ...reply,
        author_profile: reply.users_profiles
      })));
    } catch (error: any) {
      toast({
        title: "Error fetching replies",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createThread = async () => {
    if (!newThread.title || !newThread.content) {
      toast({
        title: "Missing information",
        description: "Please provide both title and content",
        variant: "destructive",
      });
      return;
    }

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('discussion_threads')
        .insert({
          title: newThread.title,
          content: newThread.content,
          topic: newThread.topic,
          tags: newThread.tags,
          author_id: user.data.user.id,
          course_id: courseId,
          section_id: sectionId
        });

      if (error) throw error;

      toast({
        title: "Discussion created!",
        description: "Your discussion thread has been created.",
      });

      setNewThread({ title: '', content: '', topic: 'general', tags: [] });
      setShowCreateForm(false);
      fetchThreads();
    } catch (error: any) {
      toast({
        title: "Error creating discussion",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addReply = async () => {
    if (!newReply.trim() || !selectedThread) return;

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('discussion_replies')
        .insert({
          content: newReply,
          author_id: user.data.user.id,
          thread_id: selectedThread.id
        });

      if (error) throw error;

      toast({
        title: "Reply added!",
        description: "Your reply has been posted.",
      });

      setNewReply('');
      fetchReplies(selectedThread.id);
      fetchThreads(); // Update reply count
    } catch (error: any) {
      toast({
        title: "Error adding reply",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !newThread.tags.includes(tagInput.trim())) {
      setNewThread({
        ...newThread,
        tags: [...newThread.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewThread({
      ...newThread,
      tags: newThread.tags.filter(tag => tag !== tagToRemove)
    });
  };

  if (selectedThread) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setSelectedThread(null)}>
            ← Back to Discussions
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{selectedThread.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>by {selectedThread.author_profile?.display_name || 'Anonymous'}</span>
              <span>•</span>
              <span>{new Date(selectedThread.created_at).toLocaleDateString()}</span>
              <Badge variant="secondary">{selectedThread.topic}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{selectedThread.content}</p>
            <div className="flex flex-wrap gap-1">
              {selectedThread.tags.map((tag, index) => (
                <Badge key={index} variant="outline">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Replies ({replies.length})</h3>
          
          {replies.map((reply) => (
            <Card key={reply.id}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span>{reply.author_profile?.display_name || 'Anonymous'}</span>
                  <span>•</span>
                  <span>{new Date(reply.created_at).toLocaleDateString()}</span>
                </div>
                <p>{reply.content}</p>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardContent className="pt-4">
              <Textarea
                placeholder="Add your reply..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                rows={3}
              />
              <Button className="mt-2" onClick={addReply}>
                <Send className="w-4 h-4 mr-2" />
                Post Reply
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Discussions</h2>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Discussion
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Discussion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Discussion title..."
              value={newThread.title}
              onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
            />
            
            <select
              className="w-full p-2 border rounded"
              value={newThread.topic}
              onChange={(e) => setNewThread({ ...newThread, topic: e.target.value })}
            >
              <option value="general">General</option>
              <option value="question">Question</option>
              <option value="assignment">Assignment Help</option>
              <option value="technical">Technical Issue</option>
              <option value="feedback">Feedback</option>
            </select>
            
            <Textarea
              placeholder="What would you like to discuss?"
              value={newThread.content}
              onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
              rows={4}
            />
            
            <div className="flex gap-2">
              <Input
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {newThread.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button onClick={createThread}>Create Discussion</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {threads.map((thread) => (
          <Card 
            key={thread.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedThread(thread)}
          >
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg">{thread.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{thread.topic}</Badge>
                  {thread.is_answered && (
                    <Badge variant="default">Answered</Badge>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-3 line-clamp-2">{thread.content}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {thread.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                ))}
                {thread.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">+{thread.tags.length - 3} more</Badge>
                )}
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>by {thread.author_profile?.display_name || 'Anonymous'}</span>
                  <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>{thread.reply_count || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DiscussionForum;

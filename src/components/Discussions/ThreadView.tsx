
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send } from 'lucide-react';
import { DiscussionThread, Reply } from './types';

interface ThreadViewProps {
  thread: DiscussionThread;
  replies: Reply[];
  onBack: () => void;
  onFetchReplies: (threadId: string) => void;
  onAddReply: (content: string, threadId: string) => Promise<boolean>;
}

const ThreadView = ({ thread, replies, onBack, onFetchReplies, onAddReply }: ThreadViewProps) => {
  const [newReply, setNewReply] = useState('');

  useEffect(() => {
    onFetchReplies(thread.id);
  }, [thread.id, onFetchReplies]);

  const handleAddReply = async () => {
    const success = await onAddReply(newReply, thread.id);
    if (success) {
      setNewReply('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          ← Back to Discussions
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{thread.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>by {thread.author_profile?.display_name || 'Anonymous'}</span>
            <span>•</span>
            <span>{new Date(thread.created_at).toLocaleDateString()}</span>
            <Badge variant="secondary">{thread.topic}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{thread.content}</p>
          <div className="flex flex-wrap gap-1">
            {thread.tags.map((tag, index) => (
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
            <Button className="mt-2" onClick={handleAddReply}>
              <Send className="w-4 h-4 mr-2" />
              Post Reply
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThreadView;

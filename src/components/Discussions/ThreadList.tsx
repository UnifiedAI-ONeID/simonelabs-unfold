
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { DiscussionThread } from './types';

interface ThreadListProps {
  threads: DiscussionThread[];
  onSelectThread: (thread: DiscussionThread) => void;
}

const ThreadList = ({ threads, onSelectThread }: ThreadListProps) => {
  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <Card 
          key={thread.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelectThread(thread)}
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
  );
};

export default ThreadList;

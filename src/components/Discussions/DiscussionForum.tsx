
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useDiscussions } from '@/hooks/useDiscussions';
import { DiscussionForumProps, DiscussionThread } from './types';
import ThreadCreator from './ThreadCreator';
import ThreadList from './ThreadList';
import ThreadView from './ThreadView';

const DiscussionForum = ({ courseId, sectionId }: DiscussionForumProps) => {
  const [selectedThread, setSelectedThread] = useState<DiscussionThread | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const {
    threads,
    replies,
    fetchReplies,
    createThread,
    addReply
  } = useDiscussions(courseId, sectionId);

  const handleCreateThread = async (threadData: {
    title: string;
    content: string;
    topic: string;
    tags: string[];
  }) => {
    const success = await createThread(threadData);
    if (success) {
      setShowCreateForm(false);
    }
    return success;
  };

  if (selectedThread) {
    return (
      <ThreadView
        thread={selectedThread}
        replies={replies}
        onBack={() => setSelectedThread(null)}
        onFetchReplies={fetchReplies}
        onAddReply={addReply}
      />
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
        <ThreadCreator
          onCreateThread={handleCreateThread}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <ThreadList
        threads={threads}
        onSelectThread={setSelectedThread}
      />
    </div>
  );
};

export default DiscussionForum;

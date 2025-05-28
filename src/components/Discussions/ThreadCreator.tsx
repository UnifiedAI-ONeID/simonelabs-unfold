
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface ThreadCreatorProps {
  onCreateThread: (threadData: {
    title: string;
    content: string;
    topic: string;
    tags: string[];
  }) => Promise<boolean>;
  onCancel: () => void;
}

const ThreadCreator = ({ onCreateThread, onCancel }: ThreadCreatorProps) => {
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    topic: 'general',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');

  const handleCreateThread = async () => {
    const success = await onCreateThread(newThread);
    if (success) {
      setNewThread({ title: '', content: '', topic: 'general', tags: [] });
      onCancel();
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

  return (
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
          <Button onClick={handleCreateThread}>Create Discussion</Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreadCreator;


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface AddSectionFormProps {
  onAddSection: (section: { title: string; content: string; video_url: string }) => void;
  isLoading: boolean;
}

const AddSectionForm = ({ onAddSection, isLoading }: AddSectionFormProps) => {
  const [newSection, setNewSection] = useState({
    title: '',
    content: '',
    video_url: '',
  });

  const handleSubmit = () => {
    onAddSection(newSection);
    setNewSection({ title: '', content: '', video_url: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add New Section
        </CardTitle>
        <CardDescription>
          Create a new section for your course
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="section-title">Section Title</Label>
          <Input
            id="section-title"
            value={newSection.title}
            onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter section title"
          />
        </div>

        <div>
          <Label htmlFor="section-content">Content</Label>
          <Textarea
            id="section-content"
            value={newSection.content}
            onChange={(e) => setNewSection(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Enter section content"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="video-url">Video URL (optional)</Label>
          <Input
            id="video-url"
            value={newSection.video_url}
            onChange={(e) => setNewSection(prev => ({ ...prev, video_url: e.target.value }))}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={isLoading || !newSection.title.trim()}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isLoading ? 'Adding...' : 'Add Section'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddSectionForm;

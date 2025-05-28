
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Plus } from 'lucide-react';
import { Note } from './types';

interface NoteFormProps {
  currentNote: Partial<Note>;
  setCurrentNote: (note: Partial<Note>) => void;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const NoteForm = ({ currentNote, setCurrentNote, isEditing, onSave, onCancel }: NoteFormProps) => {
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput.trim() && !currentNote.tags?.includes(tagInput.trim())) {
      setCurrentNote({
        ...currentNote,
        tags: [...(currentNote.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentNote({
      ...currentNote,
      tags: currentNote.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  return (
    <Card className="simonelabs-glass-card">
      <CardHeader>
        <CardTitle className="heading text-foreground">{isEditing ? 'Edit Note' : 'Create New Note'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Note title..."
          value={currentNote.title || ''}
          onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
          className="border-border bg-background text-foreground"
        />
        
        <Textarea
          placeholder="Write your notes here..."
          value={currentNote.content || ''}
          onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
          rows={6}
          className="border-border bg-background text-foreground"
        />
        
        <div className="flex gap-2">
          <Input
            placeholder="Add tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
            className="border-border bg-background text-foreground"
          />
          <Button onClick={addTag} size="sm" className="simonelabs-secondary-button">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {currentNote.tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-secondary/80 transition-colors cta-text"
              onClick={() => removeTag(tag)}
            >
              {tag} ×
            </span>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onSave} className="simonelabs-primary-button">
            <Save className="w-4 h-4 mr-2" />
            Save Note
          </Button>
          {isEditing && (
            <Button variant="outline" onClick={onCancel} className="border-border hover:bg-muted cta-text">
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteForm;

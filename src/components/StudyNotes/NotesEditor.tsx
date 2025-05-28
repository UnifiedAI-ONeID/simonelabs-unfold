
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Plus, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Note {
  id: string;
  title: string;
  content: string;
  course_id?: string;
  section_id?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface NotesEditorProps {
  courseId?: string;
  sectionId?: string;
}

const NotesEditor = ({ courseId, sectionId }: NotesEditorProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    tags: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchNotes();
  }, [courseId, sectionId]);

  const fetchNotes = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      // Use mock data for now since table might not be in types yet
      const mockNotes: Note[] = [
        {
          id: '1',
          title: 'Introduction Notes',
          content: 'Key concepts from the introduction lecture...',
          course_id: courseId,
          section_id: sectionId,
          tags: ['introduction', 'basics'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setNotes(mockNotes);
    } catch (error: any) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error fetching notes",
        description: "Using demo data instead.",
        variant: "destructive",
      });
    }
  };

  const saveNote = async () => {
    if (!currentNote.title || !currentNote.content) {
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

      const noteData = {
        ...currentNote,
        user_id: user.data.user.id,
        course_id: courseId,
        section_id: sectionId,
        tags: currentNote.tags || []
      };

      if (isEditing && currentNote.id) {
        // Update existing note in state
        setNotes(notes.map(note => 
          note.id === currentNote.id 
            ? { ...note, ...noteData, updated_at: new Date().toISOString() }
            : note
        ));
      } else {
        // Add new note to state
        const newNote: Note = {
          id: Date.now().toString(),
          title: currentNote.title,
          content: currentNote.content,
          course_id: courseId,
          section_id: sectionId,
          tags: currentNote.tags || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setNotes([newNote, ...notes]);
      }

      toast({
        title: "Note saved!",
        description: "Your note has been saved successfully.",
      });

      setCurrentNote({ title: '', content: '', tags: [] });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error saving note",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      setNotes(notes.filter(note => note.id !== noteId));
      
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting note",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Note' : 'Create New Note'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Note title..."
            value={currentNote.title || ''}
            onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
          />
          
          <Textarea
            placeholder="Write your notes here..."
            value={currentNote.content || ''}
            onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
            rows={6}
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
            {currentNote.tags?.map((tag, index) => (
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
            <Button onClick={saveNote}>
              <Save className="w-4 h-4 mr-2" />
              Save Note
            </Button>
            {isEditing && (
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentNote({ title: '', content: '', tags: [] });
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Notes</h3>
        {notes.map((note) => (
          <Card key={note.id}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{note.title}</h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCurrentNote(note);
                      setIsEditing(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteNote(note.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{note.content}</p>
              <div className="flex flex-wrap gap-1">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(note.updated_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NotesEditor;

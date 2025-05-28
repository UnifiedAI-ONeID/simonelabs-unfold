
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Note } from '@/components/StudyNotes/types';

export const useNotes = (courseId?: string, sectionId?: string) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    tags: []
  });
  const [isEditing, setIsEditing] = useState(false);
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

  const editNote = (note: Note) => {
    setCurrentNote(note);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setCurrentNote({ title: '', content: '', tags: [] });
    setIsEditing(false);
  };

  return {
    notes,
    currentNote,
    setCurrentNote,
    isEditing,
    saveNote,
    deleteNote,
    editNote,
    cancelEdit
  };
};


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Note } from './types';

interface NotesListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

const NotesList = ({ notes, onEdit, onDelete }: NotesListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground heading">Your Notes</h3>
      {notes.map((note) => (
        <Card key={note.id} className="simonelabs-glass-card">
          <CardContent className="pt-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-foreground heading">{note.title}</h4>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(note)}
                  className="border-border hover:bg-muted"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(note.id)}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground mb-2">{note.content}</p>
            <div className="flex flex-wrap gap-1">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(note.updated_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotesList;

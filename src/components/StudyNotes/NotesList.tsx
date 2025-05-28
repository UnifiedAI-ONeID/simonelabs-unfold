
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
      <h3 className="text-lg font-semibold text-[#23243C]">Your Notes</h3>
      {notes.map((note) => (
        <Card key={note.id}>
          <CardContent className="pt-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-[#23243C]">{note.title}</h4>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(note)}
                  className="border-[#E2E4EA] hover:bg-[#F6F7FB]"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(note.id)}
                  className="bg-[#EB5160] hover:bg-[#EB5160]/90"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-[#50546B] mb-2">{note.content}</p>
            <div className="flex flex-wrap gap-1">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#F6F7FB] text-[#50546B] px-2 py-1 rounded text-xs border border-[#E2E4EA]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#50546B] mt-2">
              {new Date(note.updated_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotesList;

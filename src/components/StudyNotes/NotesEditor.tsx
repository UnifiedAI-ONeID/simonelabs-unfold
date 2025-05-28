
import React from 'react';
import { useNotes } from '@/hooks/useNotes';
import { NotesEditorProps } from './types';
import NoteForm from './NoteForm';
import NotesList from './NotesList';

const NotesEditor = ({ courseId, sectionId }: NotesEditorProps) => {
  const {
    notes,
    currentNote,
    setCurrentNote,
    isEditing,
    saveNote,
    deleteNote,
    editNote,
    cancelEdit
  } = useNotes(courseId, sectionId);

  return (
    <div className="space-y-6">
      <NoteForm
        currentNote={currentNote}
        setCurrentNote={setCurrentNote}
        isEditing={isEditing}
        onSave={saveNote}
        onCancel={cancelEdit}
      />

      <NotesList
        notes={notes}
        onEdit={editNote}
        onDelete={deleteNote}
      />
    </div>
  );
};

export default NotesEditor;

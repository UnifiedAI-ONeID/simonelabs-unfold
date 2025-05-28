
export interface Note {
  id: string;
  title: string;
  content: string;
  course_id?: string;
  section_id?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface NotesEditorProps {
  courseId?: string;
  sectionId?: string;
}

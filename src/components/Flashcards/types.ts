
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  deck_id: string;
  created_at: string;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  course_id?: string;
  flashcards: Flashcard[];
}

export interface FlashcardCreatorProps {
  courseId?: string;
}

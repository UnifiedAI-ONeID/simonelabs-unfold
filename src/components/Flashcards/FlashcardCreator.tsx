
import React, { useState } from 'react';
import { useFlashcards } from '@/hooks/useFlashcards';
import { FlashcardCreatorProps } from './types';
import DeckCreator from './DeckCreator';
import CardAdder from './CardAdder';
import DecksList from './DecksList';
import StudyMode from './StudyMode';

const FlashcardCreator = ({ courseId }: FlashcardCreatorProps) => {
  const { decks, createDeck, addCard, deleteCard } = useFlashcards(courseId);
  const [studyMode, setStudyMode] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<string>('');

  const startStudySession = (deckId: string) => {
    setSelectedDeckId(deckId);
    setStudyMode(true);
  };

  const exitStudyMode = () => {
    setStudyMode(false);
    setSelectedDeckId('');
  };

  if (studyMode) {
    const deck = decks.find(d => d.id === selectedDeckId);
    if (!deck) {
      setStudyMode(false);
      return null;
    }
    return <StudyMode deck={deck} onExitStudyMode={exitStudyMode} />;
  }

  return (
    <div className="space-y-6">
      <DeckCreator onCreateDeck={createDeck} />
      <CardAdder decks={decks} onAddCard={addCard} />
      <DecksList 
        decks={decks} 
        onStartStudySession={startStudySession}
        onDeleteCard={deleteCard}
      />
    </div>
  );
};

export default FlashcardCreator;

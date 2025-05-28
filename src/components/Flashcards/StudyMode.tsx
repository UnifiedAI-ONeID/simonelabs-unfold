
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlashcardDeck } from './types';

interface StudyModeProps {
  deck: FlashcardDeck;
  onExitStudyMode: () => void;
}

const StudyMode = ({ deck, onExitStudyMode }: StudyModeProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = deck.flashcards[currentCardIndex];

  const nextCard = () => {
    if (currentCardIndex < deck.flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Study Session: {deck.name}</h2>
        <Button variant="outline" onClick={onExitStudyMode}>
          Exit Study Mode
        </Button>
      </div>

      {currentCard && (
        <Card className="min-h-64">
          <CardContent className="p-8">
            <div 
              className="cursor-pointer min-h-32 flex items-center justify-center text-center"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="space-y-4">
                <p className="text-lg">
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>
                <p className="text-sm text-gray-500">
                  {isFlipped ? 'Back' : 'Front (Click to flip)'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={prevCard}
          disabled={currentCardIndex === 0}
        >
          Previous
        </Button>
        
        <span className="text-sm text-gray-600">
          {currentCardIndex + 1} / {deck.flashcards.length}
        </span>
        
        <Button 
          onClick={nextCard}
          disabled={currentCardIndex === deck.flashcards.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StudyMode;

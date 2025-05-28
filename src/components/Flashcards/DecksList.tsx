
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trash2 } from 'lucide-react';
import { FlashcardDeck } from './types';

interface DecksListProps {
  decks: FlashcardDeck[];
  onStartStudySession: (deckId: string) => void;
  onDeleteCard: (cardId: string) => void;
}

const DecksList = ({ decks, onStartStudySession, onDeleteCard }: DecksListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Flashcard Decks</h3>
      {decks.map((deck) => (
        <Card key={deck.id}>
          <CardContent className="pt-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{deck.name}</h4>
                <p className="text-sm text-gray-600">{deck.description}</p>
                <p className="text-xs text-gray-500">{deck.flashcards.length} cards</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onStartStudySession(deck.id)}
                  disabled={deck.flashcards.length === 0}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Study
                </Button>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              {deck.flashcards.slice(0, 3).map((card) => (
                <div key={card.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm truncate">{card.front}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteCard(card.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              {deck.flashcards.length > 3 && (
                <p className="text-xs text-gray-500">
                  ... and {deck.flashcards.length - 3} more cards
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DecksList;

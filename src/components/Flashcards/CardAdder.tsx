
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { FlashcardDeck } from './types';

interface CardAdderProps {
  decks: FlashcardDeck[];
  onAddCard: (deckId: string, front: string, back: string, difficulty: 'easy' | 'medium' | 'hard') => Promise<boolean>;
}

const CardAdder = ({ decks, onAddCard }: CardAdderProps) => {
  const [selectedDeckId, setSelectedDeckId] = useState<string>('');
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleAddCard = async () => {
    const success = await onAddCard(selectedDeckId, cardFront, cardBack, difficulty);
    if (success) {
      setCardFront('');
      setCardBack('');
      setDifficulty('medium');
    }
  };

  if (decks.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Card to Deck</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <select
          className="w-full p-2 border rounded"
          value={selectedDeckId}
          onChange={(e) => setSelectedDeckId(e.target.value)}
        >
          <option value="">Select a deck...</option>
          {decks.map(deck => (
            <option key={deck.id} value={deck.id}>{deck.name}</option>
          ))}
        </select>
        
        <Textarea
          placeholder="Front of card..."
          value={cardFront}
          onChange={(e) => setCardFront(e.target.value)}
        />
        
        <Textarea
          placeholder="Back of card..."
          value={cardBack}
          onChange={(e) => setCardBack(e.target.value)}
        />
        
        <select
          className="p-2 border rounded"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        
        <Button onClick={handleAddCard}>
          <Save className="w-4 h-4 mr-2" />
          Add Card
        </Button>
      </CardContent>
    </Card>
  );
};

export default CardAdder;

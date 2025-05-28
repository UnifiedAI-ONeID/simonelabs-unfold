
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface DeckCreatorProps {
  onCreateDeck: (name: string, description: string) => Promise<boolean>;
}

const DeckCreator = ({ onCreateDeck }: DeckCreatorProps) => {
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');

  const handleCreateDeck = async () => {
    const success = await onCreateDeck(deckName, deckDescription);
    if (success) {
      setDeckName('');
      setDeckDescription('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Deck</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Deck name..."
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        />
        <Textarea
          placeholder="Deck description..."
          value={deckDescription}
          onChange={(e) => setDeckDescription(e.target.value)}
        />
        <Button onClick={handleCreateDeck}>
          <Plus className="w-4 h-4 mr-2" />
          Create Deck
        </Button>
      </CardContent>
    </Card>
  );
};

export default DeckCreator;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, RotateCcw, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  deck_id: string;
  created_at: string;
}

interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  course_id?: string;
  flashcards: Flashcard[];
}

interface FlashcardCreatorProps {
  courseId?: string;
}

const FlashcardCreator = ({ courseId }: FlashcardCreatorProps) => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Partial<FlashcardDeck>>({
    name: '',
    description: ''
  });
  const [currentCard, setCurrentCard] = useState({
    front: '',
    back: '',
    difficulty: 'medium' as const
  });
  const [selectedDeckId, setSelectedDeckId] = useState<string>('');
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDecks();
  }, [courseId]);

  const fetchDecks = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      // Use mock data for now since tables might not be in types yet
      const mockDecks: FlashcardDeck[] = [
        {
          id: '1',
          name: 'Math Basics',
          description: 'Basic mathematics concepts',
          course_id: courseId,
          flashcards: [
            {
              id: '1',
              front: 'What is 2 + 2?',
              back: '4',
              difficulty: 'easy',
              deck_id: '1',
              created_at: new Date().toISOString()
            },
            {
              id: '2', 
              front: 'What is the square root of 16?',
              back: '4',
              difficulty: 'medium',
              deck_id: '1',
              created_at: new Date().toISOString()
            }
          ]
        }
      ];

      setDecks(mockDecks);
    } catch (error: any) {
      console.error('Error fetching flashcards:', error);
      toast({
        title: "Error fetching flashcards",
        description: "Using demo data instead.",
        variant: "destructive",
      });
    }
  };

  const createDeck = async () => {
    if (!currentDeck.name) {
      toast({
        title: "Missing information",
        description: "Please provide a deck name",
        variant: "destructive",
      });
      return;
    }

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      // Create mock deck for now
      const newDeck: FlashcardDeck = {
        id: Date.now().toString(),
        name: currentDeck.name,
        description: currentDeck.description || '',
        course_id: courseId,
        flashcards: []
      };

      setDecks([newDeck, ...decks]);

      toast({
        title: "Deck created!",
        description: "Your flashcard deck has been created.",
      });

      setCurrentDeck({ name: '', description: '' });
    } catch (error: any) {
      toast({
        title: "Error creating deck",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addCard = async () => {
    if (!selectedDeckId || !currentCard.front || !currentCard.back) {
      toast({
        title: "Missing information",
        description: "Please select a deck and provide both front and back content",
        variant: "destructive",
      });
      return;
    }

    try {
      const newCard: Flashcard = {
        id: Date.now().toString(),
        front: currentCard.front,
        back: currentCard.back,
        difficulty: currentCard.difficulty,
        deck_id: selectedDeckId,
        created_at: new Date().toISOString()
      };

      setDecks(decks.map(deck => 
        deck.id === selectedDeckId 
          ? { ...deck, flashcards: [...deck.flashcards, newCard] }
          : deck
      ));

      toast({
        title: "Card added!",
        description: "Your flashcard has been added to the deck.",
      });

      setCurrentCard({ front: '', back: '', difficulty: 'medium' });
    } catch (error: any) {
      toast({
        title: "Error adding card",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      setDecks(decks.map(deck => ({
        ...deck,
        flashcards: deck.flashcards.filter(card => card.id !== cardId)
      })));

      toast({
        title: "Card deleted",
        description: "Flashcard has been deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting card",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startStudySession = (deckId: string) => {
    setSelectedDeckId(deckId);
    setStudyMode(true);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const nextCard = () => {
    const deck = decks.find(d => d.id === selectedDeckId);
    if (deck && currentCardIndex < deck.flashcards.length - 1) {
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

  if (studyMode) {
    const deck = decks.find(d => d.id === selectedDeckId);
    const currentStudyCard = deck?.flashcards[currentCardIndex];

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Study Session: {deck?.name}</h2>
          <Button variant="outline" onClick={() => setStudyMode(false)}>
            Exit Study Mode
          </Button>
        </div>

        {currentStudyCard && (
          <Card className="min-h-64">
            <CardContent className="p-8">
              <div 
                className="cursor-pointer min-h-32 flex items-center justify-center text-center"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className="space-y-4">
                  <p className="text-lg">
                    {isFlipped ? currentStudyCard.back : currentStudyCard.front}
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
            {currentCardIndex + 1} / {deck?.flashcards.length || 0}
          </span>
          
          <Button 
            onClick={nextCard}
            disabled={currentCardIndex === (deck?.flashcards.length || 1) - 1}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Deck</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Deck name..."
            value={currentDeck.name || ''}
            onChange={(e) => setCurrentDeck({ ...currentDeck, name: e.target.value })}
          />
          <Textarea
            placeholder="Deck description..."
            value={currentDeck.description || ''}
            onChange={(e) => setCurrentDeck({ ...currentDeck, description: e.target.value })}
          />
          <Button onClick={createDeck}>
            <Plus className="w-4 h-4 mr-2" />
            Create Deck
          </Button>
        </CardContent>
      </Card>

      {decks.length > 0 && (
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
              value={currentCard.front}
              onChange={(e) => setCurrentCard({ ...currentCard, front: e.target.value })}
            />
            
            <Textarea
              placeholder="Back of card..."
              value={currentCard.back}
              onChange={(e) => setCurrentCard({ ...currentCard, back: e.target.value })}
            />
            
            <select
              className="p-2 border rounded"
              value={currentCard.difficulty}
              onChange={(e) => setCurrentCard({ ...currentCard, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            
            <Button onClick={addCard}>
              <Save className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </CardContent>
        </Card>
      )}

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
                    onClick={() => startStudySession(deck.id)}
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
                      onClick={() => deleteCard(card.id)}
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
    </div>
  );
};

export default FlashcardCreator;

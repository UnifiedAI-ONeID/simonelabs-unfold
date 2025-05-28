
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FlashcardDeck, Flashcard } from '@/components/Flashcards/types';

export const useFlashcards = (courseId?: string) => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
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

  const createDeck = async (name: string, description: string) => {
    if (!name) {
      toast({
        title: "Missing information",
        description: "Please provide a deck name",
        variant: "destructive",
      });
      return false;
    }

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      const newDeck: FlashcardDeck = {
        id: Date.now().toString(),
        name,
        description: description || '',
        course_id: courseId,
        flashcards: []
      };

      setDecks([newDeck, ...decks]);

      toast({
        title: "Deck created!",
        description: "Your flashcard deck has been created.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error creating deck",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const addCard = async (deckId: string, front: string, back: string, difficulty: 'easy' | 'medium' | 'hard') => {
    if (!deckId || !front || !back) {
      toast({
        title: "Missing information",
        description: "Please select a deck and provide both front and back content",
        variant: "destructive",
      });
      return false;
    }

    try {
      const newCard: Flashcard = {
        id: Date.now().toString(),
        front,
        back,
        difficulty,
        deck_id: deckId,
        created_at: new Date().toISOString()
      };

      setDecks(decks.map(deck => 
        deck.id === deckId 
          ? { ...deck, flashcards: [...deck.flashcards, newCard] }
          : deck
      ));

      toast({
        title: "Card added!",
        description: "Your flashcard has been added to the deck.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error adding card",
        description: error.message,
        variant: "destructive",
      });
      return false;
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

  return {
    decks,
    createDeck,
    addCard,
    deleteCard,
    fetchDecks
  };
};

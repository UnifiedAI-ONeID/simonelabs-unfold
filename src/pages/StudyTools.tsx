
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NotesEditor from '@/components/StudyNotes/NotesEditor';
import FlashcardCreator from '@/components/Flashcards/FlashcardCreator';
import DiscussionForum from '@/components/Discussions/DiscussionForum';
import { BookOpen, MessageSquare, RotateCcw } from 'lucide-react';

const StudyTools = () => {
  const [selectedCourse] = useState<string>(''); // Would be passed from course context

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Tools</h1>
          <p className="text-gray-600">Enhance your learning with notes, flashcards, and discussions</p>
        </div>

        <Tabs defaultValue="notes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="discussions" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Discussions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Study Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <NotesEditor courseId={selectedCourse} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flashcards">
            <Card>
              <CardHeader>
                <CardTitle>Flashcards</CardTitle>
              </CardHeader>
              <CardContent>
                <FlashcardCreator courseId={selectedCourse} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discussions">
            <Card>
              <CardHeader>
                <CardTitle>Course Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                <DiscussionForum courseId={selectedCourse || 'demo'} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudyTools;

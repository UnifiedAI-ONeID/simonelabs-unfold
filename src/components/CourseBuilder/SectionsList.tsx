
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  video_url?: string;
  content: any;
  order: number;
}

interface SectionsListProps {
  sections: Section[] | undefined;
}

const SectionsList = ({ sections }: SectionsListProps) => {
  if (!sections || sections.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No sections added yet. Create your first section below.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Course Sections</h2>
      {sections.map((section, index) => (
        <Card key={section.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {index + 1}. {section.title}
                </CardTitle>
                {section.video_url && (
                  <CardDescription>
                    Video: {section.video_url}
                  </CardDescription>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {(section.content as any)?.text || 'No content added yet'}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SectionsList;

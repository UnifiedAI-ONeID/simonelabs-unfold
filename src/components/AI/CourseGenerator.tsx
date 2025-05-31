import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wand2, BookOpen, Brain, Target, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratedCourse {
  title: string;
  description: string;
  objectives: string[];
  sections: {
    title: string;
    content: string;
    duration: string;
    activities: string[];
  }[];
  difficulty: string;
  prerequisites: string[];
  targetAudience: string;
  estimatedDuration: string;
}

const CourseGenerator = () => {
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);
  const { toast } = useToast();

  const generateCourse = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a course topic",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          targetAudience,
          difficulty,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate course');

      const data = await response.json();
      setGeneratedCourse(data);
      
      toast({
        title: "Course Generated!",
        description: "Your AI-generated course outline is ready.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Course Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Course Topic</label>
            <Input
              placeholder="e.g., Machine Learning Fundamentals"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Target Audience</label>
            <Textarea
              placeholder="Who is this course for?"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={generateCourse} 
            disabled={isGenerating || !topic.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Brain className="mr-2 h-4 w-4 animate-spin" />
                Generating Course...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Course
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedCourse && (
        <Card>
          <CardHeader>
            <CardTitle>{generatedCourse.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">
                <Target className="w-3 h-3 mr-1" />
                {generatedCourse.difficulty}
              </Badge>
              <Badge variant="secondary">
                <Clock className="w-3 h-3 mr-1" />
                {generatedCourse.estimatedDuration}
              </Badge>
              <Badge variant="secondary">
                <Users className="w-3 h-3 mr-1" />
                {generatedCourse.sections.length} sections
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{generatedCourse.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Learning Objectives</h3>
              <ul className="list-disc list-inside space-y-1">
                {generatedCourse.objectives.map((objective, index) => (
                  <li key={index} className="text-muted-foreground">{objective}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Course Outline</h3>
              <div className="space-y-4">
                {generatedCourse.sections.map((section, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">
                        {index + 1}. {section.title}
                      </h4>
                      <Badge variant="outline">{section.duration}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{section.content}</p>
                    <div className="space-y-1">
                      {section.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="text-sm flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span>{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="flex-1">
                Create Course
              </Button>
              <Button variant="outline" className="flex-1">
                Edit Outline
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseGenerator;
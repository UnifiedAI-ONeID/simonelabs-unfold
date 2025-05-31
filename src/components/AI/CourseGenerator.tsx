import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, Clock, Users, Brain, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CourseOutline {
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  sections: {
    title: string;
    description: string;
    estimatedTime: string;
  }[];
  targetAudience: string;
  prerequisites: string[];
}

const CourseGenerator = () => {
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState<CourseOutline | null>(null);
  const { toast } = useToast();

  const generateOutline = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai-course-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, targetAudience })
      });

      if (!response.ok) throw new Error('Failed to generate course outline');

      const mockOutline: CourseOutline = {
        title: `Mastering ${topic}`,
        description: `A comprehensive course designed to take you from beginner to advanced in ${topic}. Learn practical skills, best practices, and real-world applications.`,
        difficulty: 'Intermediate',
        duration: '6-8 weeks',
        sections: [
          {
            title: `Introduction to ${topic}`,
            description: 'Fundamental concepts and core principles',
            estimatedTime: '2 hours'
          },
          {
            title: 'Getting Started',
            description: 'Setting up your environment and first steps',
            estimatedTime: '3 hours'
          },
          {
            title: 'Core Concepts',
            description: 'Deep dive into essential knowledge',
            estimatedTime: '4 hours'
          },
          {
            title: 'Practical Applications',
            description: 'Hands-on projects and real-world examples',
            estimatedTime: '5 hours'
          },
          {
            title: 'Advanced Techniques',
            description: 'Professional-level skills and optimization',
            estimatedTime: '4 hours'
          }
        ],
        targetAudience: targetAudience || 'Beginners to intermediate learners',
        prerequisites: ['Basic computer skills', 'Willingness to learn']
      };
      
      setGeneratedOutline(mockOutline);
      
      toast({
        title: "Course outline generated!",
        description: "Your AI-generated course structure is ready.",
      });
    } catch (error) {
      console.error('Error generating course:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate course outline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Course Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Course Topic</label>
            <Input
              placeholder="e.g., React Development, Data Science, UI/UX Design"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Target Audience (Optional)</label>
            <Textarea
              placeholder="e.g., Beginners with no programming experience, Working professionals looking to upskill"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button 
            onClick={generateOutline}
            disabled={!topic.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Generating Course Outline...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Course Outline
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedOutline && (
        <Card>
          <CardHeader>
            <CardTitle>{generatedOutline.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="flex items-center">
                <BookOpen className="w-3 h-3 mr-1" />
                {generatedOutline.difficulty}
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {generatedOutline.duration}
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {generatedOutline.sections.length} sections
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{generatedOutline.description}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Target Audience</h3>
              <p className="text-muted-foreground">{generatedOutline.targetAudience}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Prerequisites</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                {generatedOutline.prerequisites.map((prereq, index) => (
                  <li key={index}>{prereq}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Course Sections</h3>
              <div className="space-y-3">
                {generatedOutline.sections.map((section, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">
                        {index + 1}. {section.title}
                      </h4>
                      <Badge variant="outline">{section.estimatedTime}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{section.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button className="flex-1">
                Create Course from Outline
              </Button>
              <Button variant="outline" className="flex-1">
                Regenerate Outline
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseGenerator;
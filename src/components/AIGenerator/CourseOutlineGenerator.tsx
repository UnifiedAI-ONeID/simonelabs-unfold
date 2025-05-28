
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, Clock, Users } from "lucide-react";

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

const CourseOutlineGenerator = () => {
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState<CourseOutline | null>(null);

  const generateOutline = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation with a delay
    setTimeout(() => {
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
          },
          {
            title: 'Final Project',
            description: 'Capstone project to showcase your skills',
            estimatedTime: '6 hours'
          }
        ],
        targetAudience: targetAudience || 'Beginners to intermediate learners',
        prerequisites: ['Basic computer skills', 'Willingness to learn']
      };
      
      setGeneratedOutline(mockOutline);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
            AI Course Outline Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating Course Outline...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Course Outline
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedOutline && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{generatedOutline.title}</CardTitle>
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
              <p className="text-gray-600">{generatedOutline.description}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Target Audience</h3>
              <p className="text-gray-600">{generatedOutline.targetAudience}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Prerequisites</h3>
              <ul className="list-disc list-inside text-gray-600">
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
                    <p className="text-gray-600 text-sm">{section.description}</p>
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

export default CourseOutlineGenerator;

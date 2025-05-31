import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, BarChart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Analysis {
  readability: number;
  engagement: number;
  clarity: number;
  suggestions: string[];
}

const ContentAnalyzer = () => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const { toast } = useToast();

  const analyzeContent = async () => {
    if (!content.trim() || isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockAnalysis: Analysis = {
        readability: 85,
        engagement: 78,
        clarity: 92,
        suggestions: [
          'Consider adding more examples to illustrate key concepts',
          'Break down complex explanations into smaller steps',
          'Add interactive elements to increase engagement'
        ]
      };

      setAnalysis(mockAnalysis);
      
      toast({
        title: "Analysis Complete",
        description: "Content analysis and suggestions are ready.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Content Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your course content here..."
          rows={8}
        />

        <Button
          onClick={analyzeContent}
          disabled={!content.trim() || isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Content...
            </>
          ) : (
            <>
              <BarChart className="mr-2 h-4 w-4" />
              Analyze Content
            </>
          )}
        </Button>

        {analysis && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Readability</span>
                  <span>{analysis.readability}%</span>
                </div>
                <Progress value={analysis.readability} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Engagement</span>
                  <span>{analysis.engagement}%</span>
                </div>
                <Progress value={analysis.engagement} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Clarity</span>
                  <span>{analysis.clarity}%</span>
                </div>
                <Progress value={analysis.clarity} />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Suggestions for Improvement</h3>
              <div className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 rounded-lg bg-muted"
                  >
                    <Sparkles className="h-4 w-4 mt-1" />
                    <p>{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentAnalyzer;
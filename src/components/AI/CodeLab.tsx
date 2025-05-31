import { useState } from 'react';
import Editor from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeLabProps {
  initialCode?: string;
  language?: string;
  onSave?: (code: string) => void;
}

const CodeLab = ({ 
  initialCode = '// Write your code here',
  language = 'javascript',
  onSave 
}: CodeLabProps) => {
  const [code, setCode] = useState(initialCode);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleRun = async () => {
    try {
      const response = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code,
          language: selectedLanguage 
        }),
      });

      if (!response.ok) throw new Error('Failed to run code');

      const { result, error } = await response.json();
      
      setOutput(error || result);
      
      if (!error) {
        toast({
          title: "Code Executed",
          description: "Your code ran successfully!",
        });
      } else {
        toast({
          title: "Execution Error",
          description: "There was an error running your code.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: "Failed to run code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(code);
      toast({
        title: "Code Saved",
        description: "Your code has been saved successfully.",
      });
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    toast({
      title: "Code Reset",
      description: "Code has been reset to initial state.",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Code Lab</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Editor
              height="400px"
              language={selectedLanguage}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                automaticLayout: true,
              }}
            />
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleRun}>
                <Play className="h-4 w-4 mr-2" />
                Run Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {output && (
        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{output}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodeLab;
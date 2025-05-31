import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Editor from '@monaco-editor/react';
import { Play, Save, Code, Terminal } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const CodeLab = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Write your code here\n');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'java', label: 'Java' }
  ];

  const runCode = async () => {
    setIsRunning(true);
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOutput('Code executed successfully!\nOutput: Hello, World!');
      
      toast({
        title: "Code Executed",
        description: "Your code ran successfully.",
      });
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: "Failed to run code. Please check for errors.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const saveCode = () => {
    toast({
      title: "Code Saved",
      description: "Your code has been saved successfully.",
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Interactive Code Lab
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <Editor
            height="400px"
            language={language}
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

        <div className="flex justify-between">
          <Button variant="outline" onClick={saveCode}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button onClick={runCode} disabled={isRunning}>
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
        </div>

        {output && (
          <div className="border rounded-lg p-4 bg-muted">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="h-4 w-4" />
              <span className="font-medium">Output</span>
            </div>
            <pre className="whitespace-pre-wrap text-sm">{output}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CodeLab;
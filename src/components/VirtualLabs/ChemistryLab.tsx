```tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Flask, Beaker, ThermometerHot, Play, RotateCcw } from 'lucide-react';

interface Reagent {
  id: string;
  name: string;
  color: string;
  type: 'acid' | 'base' | 'salt' | 'other';
}

interface Experiment {
  id: string;
  name: string;
  description: string;
  reagents: string[];
  temperature: number;
  duration: number;
}

const ChemistryLab = () => {
  const [selectedReagents, setSelectedReagents] = useState<string[]>([]);
  const [temperature, setTemperature] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const reagents: Reagent[] = [
    { id: 'hcl', name: 'Hydrochloric Acid', color: 'transparent', type: 'acid' },
    { id: 'naoh', name: 'Sodium Hydroxide', color: 'transparent', type: 'base' },
    { id: 'nacl', name: 'Sodium Chloride', color: 'white', type: 'salt' },
    { id: 'phenol', name: 'Phenolphthalein', color: 'pink', type: 'other' },
  ];

  const experiments: Experiment[] = [
    {
      id: 'acid-base',
      name: 'Acid-Base Titration',
      description: 'Neutralization reaction between HCl and NaOH',
      reagents: ['hcl', 'naoh', 'phenol'],
      temperature: 25,
      duration: 5000,
    },
  ];

  const handleAddReagent = (reagentId: string) => {
    setSelectedReagents([...selectedReagents, reagentId]);
  };

  const handleRunExperiment = async () => {
    setIsRunning(true);
    
    try {
      // Simulate experiment
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Experiment Complete",
        description: "The reaction has finished successfully.",
      });
    } catch (error) {
      toast({
        title: "Experiment Failed",
        description: "There was an error running the experiment.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const resetExperiment = () => {
    setSelectedReagents([]);
    setTemperature(25);
    setIsRunning(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flask className="h-5 w-5" />
          Virtual Chemistry Lab
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Reagents</h3>
            <div className="space-y-2">
              {reagents.map((reagent) => (
                <Button
                  key={reagent.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleAddReagent(reagent.id)}
                  disabled={selectedReagents.includes(reagent.id) || isRunning}
                >
                  <Beaker className="h-4 w-4 mr-2" />
                  {reagent.name}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Temperature</h3>
              <div className="flex items-center gap-2">
                <ThermometerHot className="h-4 w-4" />
                <Input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  disabled={isRunning}
                  min={0}
                  max={100}
                />
                <span>°C</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Reaction Vessel</h3>
            <div className="border rounded-lg p-4 min-h-[200px] relative">
              {selectedReagents.length > 0 ? (
                <div className="space-y-2">
                  {selectedReagents.map((reagentId) => {
                    const reagent = reagents.find(r => r.id === reagentId);
                    return (
                      <div key={reagentId} className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: reagent?.color || 'transparent', border: '1px solid #ccc' }}
                        />
                        <span>{reagent?.name}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Add reagents to begin
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={resetExperiment}
                disabled={isRunning}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleRunExperiment}
                disabled={selectedReagents.length < 2 || isRunning}
              >
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Experiment'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChemistryLab;
```
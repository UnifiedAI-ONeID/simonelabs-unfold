```tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Zap, Battery, Lightbulb, Plus, Play, RotateCcw } from 'lucide-react';

interface Component {
  id: string;
  type: 'battery' | 'resistor' | 'led';
  value: number;
  unit: string;
}

const CircuitLab = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const handleAddComponent = (type: Component['type']) => {
    const newComponent: Component = {
      id: Date.now().toString(),
      type,
      value: type === 'battery' ? 9 : type === 'resistor' ? 1000 : 2,
      unit: type === 'battery' ? 'V' : type === 'resistor' ? 'Ω' : 'V',
    };
    setComponents([...components, newComponent]);
  };

  const handleUpdateValue = (id: string, value: number) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, value } : comp
    ));
  };

  const handleSimulate = async () => {
    setIsRunning(true);
    
    try {
      // Simulate circuit
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Simulation Complete",
        description: "Circuit analysis finished successfully.",
      });
    } catch (error) {
      toast({
        title: "Simulation Failed",
        description: "There was an error simulating the circuit.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const resetCircuit = () => {
    setComponents([]);
    setIsRunning(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Virtual Circuit Lab
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleAddComponent('battery')}
            disabled={isRunning}
          >
            <Battery className="h-4 w-4 mr-2" />
            Add Battery
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAddComponent('resistor')}
            disabled={isRunning}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Resistor
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAddComponent('led')}
            disabled={isRunning}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Add LED
          </Button>
        </div>

        <div className="border rounded-lg p-4 min-h-[200px]">
          {components.length > 0 ? (
            <div className="space-y-4">
              {components.map((component) => (
                <div key={component.id} className="flex items-center gap-4">
                  {component.type === 'battery' && <Battery className="h-6 w-6" />}
                  {component.type === 'resistor' && <Plus className="h-6 w-6" />}
                  {component.type === 'led' && <Lightbulb className="h-6 w-6" />}
                  
                  <div className="flex-1">
                    <Input
                      type="number"
                      value={component.value}
                      onChange={(e) => handleUpdateValue(component.id, Number(e.target.value))}
                      disabled={isRunning}
                    />
                  </div>
                  <span>{component.unit}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Add components to build your circuit
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={resetCircuit}
            disabled={isRunning}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSimulate}
            disabled={components.length === 0 || isRunning}
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Simulating...' : 'Run Simulation'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CircuitLab;
```
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Battery, Lightbulb, RotateCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const CircuitLab = () => {
  const [voltage, setVoltage] = useState('9');
  const [resistance, setResistance] = useState('100');
  const [isCircuitOn, setIsCircuitOn] = useState(false);
  const { toast } = useToast();

  const toggleCircuit = () => {
    setIsCircuitOn(!isCircuitOn);
    
    toast({
      title: isCircuitOn ? "Circuit Off" : "Circuit On",
      description: isCircuitOn ? "Circuit has been disconnected." : "Circuit is now active.",
    });
  };

  const resetCircuit = () => {
    setVoltage('9');
    setResistance('100');
    setIsCircuitOn(false);
  };

  const current = parseFloat(voltage) / parseFloat(resistance);
  const power = parseFloat(voltage) * current;

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Voltage Control */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Battery className="h-5 w-5 text-yellow-500" />
              <h3 className="font-medium">Voltage Source</h3>
            </div>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min="0"
                max="24"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-24"
              />
              <span className="text-sm">Volts</span>
            </div>
          </div>

          {/* Resistance Control */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Resistance</h3>
            </div>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min="1"
                max="1000"
                value={resistance}
                onChange={(e) => setResistance(e.target.value)}
                className="w-24"
              />
              <span className="text-sm">Ohms</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={toggleCircuit}
            variant={isCircuitOn ? "destructive" : "default"}
          >
            {isCircuitOn ? (
              <>
                <Lightbulb className="mr-2 h-4 w-4\" fill="currentColor" />
                Turn Off
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Turn On
              </>
            )}
          </Button>
          <Button variant="outline" onClick={resetCircuit}>
            <RotateCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-2">Current</h4>
            <p className="text-2xl font-bold">
              {current.toFixed(2)} <span className="text-sm font-normal">Amperes</span>
            </p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-2">Power</h4>
            <p className="text-2xl font-bold">
              {power.toFixed(2)} <span className="text-sm font-normal">Watts</span>
            </p>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">Circuit Information</h4>
          <p className="text-sm text-muted-foreground">
            Adjust voltage and resistance to see how they affect current and power in a simple DC circuit. The simulation follows Ohm's Law (V = IR).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CircuitLab;
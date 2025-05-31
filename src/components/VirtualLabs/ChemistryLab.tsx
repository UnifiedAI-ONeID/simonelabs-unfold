import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Flask, Atom, Play, RotateCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const ChemistryLab = () => {
  const [selectedChemical1, setSelectedChemical1] = useState('');
  const [selectedChemical2, setSelectedChemical2] = useState('');
  const [quantity1, setQuantity1] = useState('1');
  const [quantity2, setQuantity2] = useState('1');
  const [isReacting, setIsReacting] = useState(false);
  const { toast } = useToast();

  const chemicals = [
    { value: 'h2o', label: 'Water (H₂O)' },
    { value: 'nacl', label: 'Sodium Chloride (NaCl)' },
    { value: 'hcl', label: 'Hydrochloric Acid (HCl)' },
    { value: 'naoh', label: 'Sodium Hydroxide (NaOH)' },
  ];

  const startReaction = async () => {
    if (!selectedChemical1 || !selectedChemical2) return;
    
    setIsReacting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Reaction Complete",
        description: "Chemical reaction simulation finished successfully.",
      });
    } catch (error) {
      toast({
        title: "Simulation Error",
        description: "Failed to simulate reaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsReacting(false);
    }
  };

  const resetExperiment = () => {
    setSelectedChemical1('');
    setSelectedChemical2('');
    setQuantity1('1');
    setQuantity2('1');
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Chemical 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Flask className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Chemical 1</h3>
            </div>
            <Select value={selectedChemical1} onValueChange={setSelectedChemical1}>
              <SelectTrigger>
                <SelectValue placeholder="Select chemical" />
              </SelectTrigger>
              <SelectContent>
                {chemicals.map(chemical => (
                  <SelectItem key={chemical.value} value={chemical.value}>
                    {chemical.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2 items-center">
              <span className="text-sm">Quantity (ml):</span>
              <Input
                type="number"
                min="0"
                max="100"
                value={quantity1}
                onChange={(e) => setQuantity1(e.target.value)}
                className="w-24"
              />
            </div>
          </div>

          {/* Chemical 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Flask className="h-5 w-5 text-purple-500" />
              <h3 className="font-medium">Chemical 2</h3>
            </div>
            <Select value={selectedChemical2} onValueChange={setSelectedChemical2}>
              <SelectTrigger>
                <SelectValue placeholder="Select chemical" />
              </SelectTrigger>
              <SelectContent>
                {chemicals.map(chemical => (
                  <SelectItem key={chemical.value} value={chemical.value}>
                    {chemical.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2 items-center">
              <span className="text-sm">Quantity (ml):</span>
              <Input
                type="number"
                min="0"
                max="100"
                value={quantity2}
                onChange={(e) => setQuantity2(e.target.value)}
                className="w-24"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={startReaction}
            disabled={!selectedChemical1 || !selectedChemical2 || isReacting}
          >
            {isReacting ? (
              <>
                <Atom className="mr-2 h-4 w-4 animate-spin" />
                Reacting...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Reaction
              </>
            )}
          </Button>
          <Button variant="outline" onClick={resetExperiment}>
            <RotateCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">Reaction Information</h4>
          <p className="text-sm text-muted-foreground">
            Select two chemicals and their quantities to simulate a reaction. The simulation will show the reaction process and results.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChemistryLab;
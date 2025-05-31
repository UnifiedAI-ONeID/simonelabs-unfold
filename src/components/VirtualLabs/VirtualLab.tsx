```tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThreeDViewer from './ThreeDViewer';
import ChemistryLab from './ChemistryLab';
import CircuitLab from './CircuitLab';
import { Flask, Zap, Cube } from 'lucide-react';

const VirtualLab = () => {
  const [activeTab, setActiveTab] = useState('3d');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Virtual Laboratory</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="3d" className="flex items-center gap-2">
              <Cube className="h-4 w-4" />
              3D Models
            </TabsTrigger>
            <TabsTrigger value="chemistry" className="flex items-center gap-2">
              <Flask className="h-4 w-4" />
              Chemistry
            </TabsTrigger>
            <TabsTrigger value="circuits" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Circuits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="3d">
            <ThreeDViewer />
          </TabsContent>

          <TabsContent value="chemistry">
            <ChemistryLab />
          </TabsContent>

          <TabsContent value="circuits">
            <CircuitLab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VirtualLab;
```
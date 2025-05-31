import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThreeDViewer from './ThreeDViewer';
import ChemistryLab from './ChemistryLab';
import CircuitLab from './CircuitLab';

const VirtualLab = () => {
  const [activeTab, setActiveTab] = useState('3d');

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Virtual Laboratory</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="3d">3D Models</TabsTrigger>
            <TabsTrigger value="chemistry">Chemistry Lab</TabsTrigger>
            <TabsTrigger value="circuits">Circuit Lab</TabsTrigger>
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
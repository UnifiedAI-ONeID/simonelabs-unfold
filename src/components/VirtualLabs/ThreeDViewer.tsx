
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Card, CardContent } from "@/components/ui/card";
import ThreeDModel from './LabComponents/ThreeDModel';
import LabCamera from './LabComponents/LabCamera';
import LabLighting from './LabComponents/LabLighting';

const ThreeDViewer = () => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="h-[500px] w-full">
          <Canvas>
            <LabCamera />
            <OrbitControls />
            <LabLighting />
            <ThreeDModel />
          </Canvas>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreeDViewer;

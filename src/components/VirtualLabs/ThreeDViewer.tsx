```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface ThreeDViewerProps {
  modelUrl?: string;
  title?: string;
}

const ThreeDViewer = ({ modelUrl, title = '3D Model Viewer' }: ThreeDViewerProps) => {
  const [zoom, setZoom] = useState(5);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRotate(!autoRotate)}
            >
              <RotateCcw className={`h-4 w-4 ${autoRotate ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] rounded-lg overflow-hidden border">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, zoom]} />
            <OrbitControls autoRotate={autoRotate} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="orange" />
            </mesh>
          </Canvas>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            <ZoomOut className="h-4 w-4" />
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              min={2}
              max={10}
              step={0.1}
            />
            <ZoomIn className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreeDViewer;
```
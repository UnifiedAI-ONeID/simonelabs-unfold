import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Card, CardContent } from "@/components/ui/card";

const ThreeDViewer = () => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="h-[500px] w-full">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="orange" />
            </mesh>
          </Canvas>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreeDViewer;
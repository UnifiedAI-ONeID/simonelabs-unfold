
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface ThreeDModelProps {
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const ThreeDModel = ({ 
  color = "orange", 
  position = [0, 0, 0], 
  rotation = [0, 0, 0] 
}: ThreeDModelProps) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default ThreeDModel;

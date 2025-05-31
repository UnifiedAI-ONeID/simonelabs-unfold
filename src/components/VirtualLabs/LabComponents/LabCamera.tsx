
import { PerspectiveCamera } from '@react-three/drei';

interface LabCameraProps {
  position?: [number, number, number];
  fov?: number;
}

const LabCamera = ({ position = [0, 0, 5], fov = 75 }: LabCameraProps) => {
  return <PerspectiveCamera makeDefault position={position} fov={fov} />;
};

export default LabCamera;

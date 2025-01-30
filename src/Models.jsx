import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

function Model() {
  const { scene } = useGLTF("/models/model23-a05.glb");

  return (
    <group>
      <group position={[-10, 0, 7.50]}>
        <primitive object={scene} />
      </group>

    </group>
  );
}
 
export default Model;

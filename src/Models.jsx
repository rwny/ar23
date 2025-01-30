import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

function Models() {
  const { scene } = useGLTF("./models/model23-a05.glb");

  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <group>
      <group position={[-10, 0, 7.50]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}
 
export default Models;

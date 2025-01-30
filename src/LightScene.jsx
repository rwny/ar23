import { useRef } from 'react';
import { Grid, SoftShadows, AccumulativeShadows, RandomizedLight, ContactShadows, Environment, OrbitControls } from '@react-three/drei';

export default function LightScene() {
    const shadowMapSize = 1024 * 4;
    return (
        <>

            <Environment
                files="./image/pretoria_gardens_1k.exr" 
                background
                backgroundBlurriness={0.5}
            />

            <ambientLight intensity={0.3} />
            
            {/* Main directional light */}
            <directionalLight
                position={[-50, 35, 50]}
                intensity={1.2}
                castShadow
                shadow-mapSize={[shadowMapSize, shadowMapSize]}
                shadow-camera-left={-50}
                shadow-camera-right={50}
                shadow-camera-top={50}
                shadow-camera-bottom={-50}
                shadow-camera-near={0.1}
                shadow-camera-far={200}
                shadowBias={-0.01}
            />
            <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={15} 
                maxDistance={50}
                enableTilt={true}
                enableDamping={false}
                dampingFactor={0.8}
                // minAzimuthAngle={-Math.PI/2}
                // maxAzimuthAngle={Math.PI/2}
                minPolarAngle={0.9} // bird eye
                maxPolarAngle={1.52} // normal eye level
            />

            {/* Floor Plane */}
            <mesh position={[0,-1,0]} rotation-x={-Math.PI / 2}>
                <planeGeometry args={[150, 150]} />
                <meshStandardMaterial color="gray" />
            </mesh>

            {/* Grid Overlay */}
            <Grid
                position={[0, -0.5, 0]}
                args={[100, 100]}
                cellSize={1}
                cellThickness={1}
                cellColor="#6f6f6f55"
                sectionSize={10}
                sectionThickness={1}
                sectionColor="#9d4b4b22"
                fadeDistance={100}
                fadeStrength={2}
                infiniteGrid={true}
            />

        </>
    )
}
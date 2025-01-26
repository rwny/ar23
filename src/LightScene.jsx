import { useRef } from 'react';
import { Grid, SoftShadows, AccumulativeShadows, RandomizedLight, ContactShadows, Environment } from '@react-three/drei';

export default function LightScene() {
    return (
        <>
            <SoftShadows size={40} samples={16} />
            
            <Environment 
                preset="city"
                intensity={0.5}
                background={false}
            />
            
            {/* Main directional light */}
            <directionalLight
                position={[-50, 35, 50]}
                intensity={1.2}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-camera-left={-50}
                shadow-camera-right={50}
                shadow-camera-top={50}
                shadow-camera-bottom={-50}
                shadow-camera-near={0.1}
                shadow-camera-far={200}
                shadowBias={-0.001}
            />

            {/* Shadow-receiving plane */}
            <mesh 
                position={[0, -0.8, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
            >
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#f0f0f0" />
            </mesh>

            {/* Additional ambient light */}
            <ambientLight intensity={0.3} />

            <AccumulativeShadows
                position={[0, -0.5, 0]}
                frames={100}
                alphaTest={0.9}
                scale={100}
                color="black"
                opacity={0.8}
            >
                <RandomizedLight
                    amount={8}
                    radius={10}
                    ambient={0.5}
                    intensity={1}
                    position={[-50, 35, 50]}
                    bias={0.001}
                    castShadow
                />
            </AccumulativeShadows>

            <ContactShadows
                position={[0, -0.5, 0]}
                opacity={0.8}
                blur={2}
                far={10}
                resolution={1024}
                color="#000000"
                receiveShadow
            />

            <Grid
                position={[0, -0.5, 0]}
                args={[100, 100]}
                cellSize={1}
                cellThickness={1}
                cellColor="#6f6f6f55"
                sectionSize={10}
                sectionThickness={1}
                sectionColor="#9d4b4b55"
                fadeDistance={100}
                fadeStrength={2}
                infiniteGrid={true}
            />
        </>
    )
}

import { useRef, useEffect } from 'react';
import { CameraHelper } from 'three';
import { Grid } from '@react-three/drei';

export default function LightScene() {
    const shadowArea = 100;
    const shadowMapSize = 1024 * 10;
    const lightRef = useRef();

    useEffect(() => {
        if (lightRef.current) {
            const shadowCamera = lightRef.current.shadow.camera;
            const helper = new CameraHelper(shadowCamera);
            lightRef.current.parent.add(helper);
            
            return () => {
                helper.dispose();
            };
        }
    }, []);

    return (
        <>
            <Grid
                position={[0, -0.1, 0]}
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
            <ambientLight intensity={0.5} />
            <directionalLight 
                ref={lightRef}
                position={[-10, 35, -50]}
                intensity={2}
                castShadow
                shadow-mapSize={[shadowMapSize, shadowMapSize]}
                shadow-camera-left={-shadowArea}
                shadow-camera-right={shadowArea}
                shadow-camera-top={shadowArea}
                shadow-camera-bottom={-shadowArea}
                shadow-camera-near={0.1}
                shadow-camera-far={200}
                shadowBias={0.01}
                shadowNormalBias={0.04}
            />
        </>
    )
}

export default function LightScene() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight 
                position={[5, 5, 5]} 
                intensity={1} 
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadowBias={-0.0001}
            />
            
            {/* Floor Plane */}
            {/* <mesh 
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[0, 0, 0]} 
                receiveShadow
                
            >
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial 
                    // color="#303030" 
                    color="#eaeaea" 
                    // roughness={0.8}
                    // metalness={0.2}
                />
            </mesh> */}
        </>
    )
}
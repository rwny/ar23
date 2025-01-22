import { useGLTF } from '@react-three/drei'

export default function LoadModels({ arrowV, arrowH }) {
    // const { nodes } = useGLTF('./src/assets/models/modelvh_2.glb')
    const { nodes } = useGLTF('./models/model023-04.glb')


    console.log(nodes)
    console.log('Current State:', `V${arrowV}H${arrowH}`)
    
    // // Log all nodes to find Plane.000
    // Object.values(nodes).forEach(node => {
    //     if (node.name === 'Plane000' || node.name === 'Plane.000') {
    //         // console.log('Found Plane000:', node.name, 'userData:', node.userData);
    //     }
    // });
    
    // Function to render V0H0 object
    // const renderV0H0 = () => {
    //     const baseNode = Object.values(nodes).find(
    //         node => node.userData?.modelV === 0 && node.userData?.modelH === 0
    //     );
        
    //     if (baseNode) {
    //         // console.log('Rendering V0H0:', baseNode.name);
    //         return (
    //             <primitive 
    //                 position ={[-2.50,0,0]}
    //                 key={baseNode.uuid}
    //                 object={baseNode}
    //                 visible={true}
    //                 castShadow
    //                 receiveShadow
    //             />
    //         );
    //     }
    //     return null;
    // };

    return (
        <group>
            {/* Always render V0H0 */}
            {/* {renderV0H0()} */}
            
            {/* Render other nodes */}
            {Object.values(nodes).map((node) => {
                // if (!node.userData?.modelV && !node.userData?.modelH) return null;
                // if (node.userData.modelV === 0 && node.userData.modelH === 0) return null; // Skip V0H0
                
                const isCurrentVRow = node.userData.modelV === arrowV;
                const shouldShow = 
                    (arrowV === 0 && node.userData.modelV === 0 && node.userData.modelH <= arrowH) || 
                    (arrowV > 0 && (
                        node.userData.modelV < arrowV || 
                        (isCurrentVRow && node.userData.modelH <= arrowH)
                    ));
                
                if (shouldShow) {
                    console.log('Visible Node:', node.name, `V${node.userData.modelV}H${node.userData.modelH}`);
                }
                
                return (
                    <>
                    <mesh>
                        <boxGeometry args={[1,100,1]} />
                        <meshStandardMaterial color="red" />
                    </mesh>

                    {/* <primitive 
                        position ={[-2.50,0,0]}
                        key={node.uuid}
                        object={node}
                        visible={shouldShow}
                        castShadow
                        receiveShadow
                    /> */}

                    <group position = {[0,0,7.5]}>
                        <primitive object={nodes.Scene} />
                    </group>
                    </>
                )
            })}
        </group>
    )
}

useGLTF.preload('./src/assets/models/vhkey.glb')
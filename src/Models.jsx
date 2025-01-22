import { useGLTF } from '@react-three/drei'
import { useState, useRef } from 'react'
import * as THREE from 'three'

export default function LoadModels({ arrowV, arrowH, onObjectSelect }) {
    const { nodes } = useGLTF('./models/modelvh.glb')
    const [hovered, setHovered] = useState(null)
    const [clicked, setClicked] = useState(null)
    const originalMaterials = useRef(new Map())
    console.log(nodes.Scene)
    // const { nodes } = useGLTF('./models/model023-04.glb')

    console.log(nodes)
    console.log('Current State:', `V${arrowV}H${arrowH}`)
    

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
                    <primitive 
                        position ={[-2.50,0,0]}
                        key={node.uuid}
                        object={node}
                        visible={shouldShow}
                        castShadow
                        receiveShadow
                        onPointerEnter={(e) => {
                            e.stopPropagation()
                            setHovered(node.uuid)
                            // Store original material if not already stored
                            if (!originalMaterials.current.has(node.uuid)) {
                                originalMaterials.current.set(node.uuid, node.material)
                            }
                            // Change to hotpink
                            node.material = new THREE.MeshStandardMaterial({
                                color: 'hotpink',
                                metalness: 0.1,
                                roughness: 0.75
                            })
                        }}
                        onPointerLeave={(e) => {
                            e.stopPropagation()
                            setHovered(null)
                            // Restore original material if not clicked
                            if (node.uuid !== clicked) {
                                node.material = originalMaterials.current.get(node.uuid)
                            }
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            // If clicking the same object again, deselect it
                            if (clicked === node.uuid) {
                                setClicked(null)
                                node.material = originalMaterials.current.get(node.uuid)
                                onObjectSelect(null)
                                return
                            }
                            
                            setClicked(node.uuid)
                            
                            // If another object was previously clicked, restore its material
                            if (clicked) {
                                const prevNode = Object.values(nodes).find(n => n.uuid === clicked)
                                if (prevNode) {
                                    prevNode.material = originalMaterials.current.get(clicked)
                                }
                            }
                            
                            // Set new clicked object's material to hotpink
                            node.material = new THREE.MeshStandardMaterial({
                                color: 'hotpink',
                                metalness: 0.1,
                                roughness: 0.75
                            })
                            
                            // Trigger object info display
                            if (node.userData?.objectInfo) {
                                console.log('Selected Object Info:', node.userData.objectInfo)
                                onObjectSelect({
                                    name: node.name,
                                    objectInfo: node.userData.objectInfo
                                })
                            }
                        }}
                    />
                )
            })}
        </group>
    )
}

useGLTF.preload('./models/modelvh.glb')

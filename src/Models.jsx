import { useGLTF } from '@react-three/drei'
import { useState, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { userData } from 'three/tsl'

export default function LoadModels({ arrowV, arrowH, onObjectSelect }) {
    const { nodes } = useGLTF('./models/model23-a04.glb')
    // const { nodes } = useGLTF('./models/model023-04.glb')

    const [hovered, setHovered] = useState(null)
    const [clicked, setClicked] = useState(null)
    const originalMaterials = useRef(new Map())
    
    // Pre-cache the selection material
    const selectionMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: 'gold',
        metalness: 0.1,
        roughness: 0.75
    }), [])
    
    // Create a map of nodes by UUID for faster lookups
    const nodesMap = useMemo(() => {
        const map = new Map()
        Object.values(nodes).forEach(node => map.set(node.uuid, node))
        return map
    }, [nodes])
    console.log(nodes.Scene)

    console.log(nodes)
    console.log('Current State:', `V${arrowV}H${arrowH}`)
    

    return (
        <group position={[0,0,7.50]} >
            {Object.values(nodes).map((node) => {
                // if (!node.userData?.modelV && !node.userData?.modelH) return null;
                // if (node.userData.modelV === 0 && node.userData.modelH === 0) return null; // Skip V0H0
                
                const isCurrentVRow = node.userData.modelV === arrowV;
                let shouldShow = false;
                
                switch (arrowV) {
                    case 0:
                        // Show all modelV 0,1,2
                        shouldShow = true;
                        break;
                        
                    case 1:
                        if (node.userData.modelV === 0) {
                            // Always show modelV 0
                            shouldShow = true;
                        } else if (node.userData.modelV === 1) {
                            // Show modelV 1 only if modelH >= arrowH
                            shouldShow = arrowH < node.userData.modelH;
                        } else if (node.userData.modelV === 2) {
                            shouldShow = true;
                        }
                        break;
                        
                    case 2:
                        if (node.userData.modelV === 0) {
                            // Always show modelV 0
                            shouldShow = true;
                        } else if (node.userData.modelV === 1) {
                            // Show modelV 1 if modelH > 0
                            shouldShow != node.userData.modelH > 0;
                        } else if (node.userData.modelV === 2) {
                            // Show modelV 2 only if modelH >= arrowH
                            shouldShow = arrowH < node.userData.modelH;
                        }
                        break;
                        
                    default:
                        shouldShow = false;
                }
                
                if (shouldShow) {
                    console.log('Visible Node:', node.name, `V${node.userData.modelV}H${node.userData.modelH}`);
                }
                
                return (

                    <primitive 
                        key={node.uuid}
                        object={node}
                        visible={shouldShow}
                        castShadow
                        receiveShadow
                        onClick={(e) => {
                            // Only stop propagation if we're actually handling the click
                            if (clicked !== node.uuid) {
                                e.stopPropagation()
                            }
                            
                            // Use timeout to allow orbit controls to process first
                            setTimeout(() => {
                                // If clicking the same object again, deselect it
                                if (clicked === node.uuid) {
                                    setClicked(null)
                                    node.material = originalMaterials.current.get(node.uuid)
                                    onObjectSelect(null)
                                    return
                                }
                                
                                setClicked(node.uuid)
                            
                                try {
                                    // If another object was previously clicked, restore its material
                                    if (clicked) {
                                        const prevNode = nodesMap.get(clicked)
                                        if (prevNode && originalMaterials.current.has(clicked)) {
                                            const originalMaterial = originalMaterials.current.get(clicked)
                                            if (originalMaterial) {
                                                prevNode.material = originalMaterial
                                            }
                                        }
                                    }
                                    
                                    // Store original material if not already stored
                                    if (!originalMaterials.current.has(node.uuid)) {
                                        originalMaterials.current.set(node.uuid, node.material)
                                    }
                                    
                                    // Set new clicked object's material using pre-cached material
                                    if (node) {
                                        node.material = selectionMaterial
                                    }
                                } catch (error) {
                                    console.error('Error handling click:', error)
                                }
                                
                                // Trigger object info display
                                if (node.userData) {
                                    console.log('Selected Object Info:', node.userData)
                                    onObjectSelect({
                                        header: node.name,
                                        details: {
                                            modelV: node.userData.modelV,
                                            modelH: node.userData.modelH,
                                            ...(node.userData.objectInfo ? { objectInfo: node.userData.objectInfo } : {})
                                        }
                                    })
                                }
                            }, 50) // Small delay to allow orbit controls to process
                        }}
                    />
                )
            })}
        </group>
    )
}

useGLTF.preload('./models/model23-a04.glb')

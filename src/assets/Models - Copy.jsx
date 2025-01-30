import { useGLTF, Html } from '@react-three/drei'
import { useState, useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'

export default function LoadModels({ arrowV, arrowH, onObjectSelect }) {
    // Table to store model data
    const [modelTable, setModelTable] = useState([])

    // Load main GLB model
    const models = {
        model23a04: useGLTF('/models/model23-a05.glb')
    }

    useEffect(() => {
        // Create combined model table
        const table = []

        Object.values(models).forEach(model => {
            Object.values(model.nodes).forEach(node => {
                if (node.userData?.modelH && node.userData?.modelV) {
                    table.push({
                        name: node.name,
                        modelV: node.userData.modelV,
                        modelH: node.userData.modelH,
                        uuid: node.uuid
                    })
                }
            })
        })

        // Sort by modelV then modelH
        table.sort((a, b) => {
            if (a.modelV === b.modelV) {
                return a.modelH - b.modelH
            }
            return a.modelV - b.modelV
        })

        setModelTable(table)
        console.log('Model Table:', table)
    }, [])

    const [hovered, setHovered] = useState(null)
    const [clicked, setClicked] = useState(null)
    const [labelPosition, setLabelPosition] = useState(null)
    const originalMaterials = useRef(new Map())

    const selectionMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: 'gold',
        metalness: 0.1,
        roughness: 0.75
    }), [])

    const nodesMap = useMemo(() => {
        const map = new Map()
        Object.values(models.model23a04.nodes).forEach(node => map.set(node.uuid, node))
        return map
    }, [models])

    return (
        <group position={[0,0,7.50]} >
            {Object.values(models.model23a04.nodes).map((node) => {
                const isCurrentVRow = node.userData.modelV === arrowV
                let shouldShow = false
                
                switch (arrowV) {
                    case 0:
                        shouldShow = true
                        break
                    case 1:
                        if (node.userData.modelV === 0) {
                            shouldShow = true
                        } else if (node.userData.modelV === 1) {
                            shouldShow = arrowH < node.userData.modelH
                        } else if (node.userData.modelV === 2) {
                            shouldShow = true
                        }
                        break
                    case 2:
                        if (node.userData.modelV === 0) {
                            shouldShow = true
                        } else if (node.userData.modelV === 1) {
                            shouldShow = node.userData.modelH < 0
                        } else if (node.userData.modelV === 2) {
                            shouldShow = arrowH < node.userData.modelH
                        }
                        break
                    default:
                        shouldShow = false
                }
                
                return (
                    <primitive 
                        key={node.uuid}
                        object={node}
                        visible={shouldShow}
                        castShadow
                        receiveShadow
                        onClick={(e) => {
                            if (clicked !== node.uuid) {
                                e.stopPropagation()
                            }
                            
                            setTimeout(() => {
                                if (clicked === node.uuid) {
                                    setClicked(null)
                                    node.material = originalMaterials.current.get(node.uuid)
                                    onObjectSelect(null)
                                    return
                                }
                                
                                setClicked(node.uuid)
                                
                                try {
                                    if (clicked) {
                                        const prevNode = nodesMap.get(clicked)
                                        if (prevNode && originalMaterials.current.has(clicked)) {
                                            const originalMaterial = originalMaterials.current.get(clicked)
                                            if (originalMaterial) {
                                                prevNode.material = originalMaterial
                                            }
                                        }
                                    }
                                    
                                    if (!originalMaterials.current.has(node.uuid)) {
                                        originalMaterials.current.set(node.uuid, node.material)
                                    }
                                    
                                    if (node) {
                                        node.material = selectionMaterial
                                    }
                                } catch (error) {
                                    console.error('Error handling click:', error)
                                }
                                
                                if (node.userData) {
                                    onObjectSelect({
                                        header: node.name,
                                        details: {
                                            modelV: node.userData.modelV,
                                            modelH: node.userData.modelH,
                                            ...(node.userData.objectInfo ? { objectInfo: node.userData.objectInfo } : {})
                                        }
                                    })
                                }
                            }, 50)
                        }}
                        onPointerMove={(e) => {
                            e.stopPropagation()
                            setLabelPosition(e.point)
                        }}
                        onPointerOut={() => setLabelPosition(null)}
                    >
                        {clicked === node.uuid && labelPosition && (
                            <Html position={[0, 0, 0]} center>
                                <div className="object-label">
                                    {node.name}
                                </div>
                            </Html>
                        )}
                    </primitive>
                )
            })}
        </group>
    )
}

// Preload main model
useGLTF.preload('/models/model23-a05.glb')

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState, useEffect, useCallback } from 'react'
import './App.css'
import LightScene from './LightScene.jsx'
import LoadModels from './Models.jsx'

function App() {
  const [arrowV, setArrowV] = useState(0)
  const [arrowH, setArrowH] = useState(0)
  const [pressedKey, setPressedKey] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const limitV = 3+1
  const limitH = 5

  const updateArrowV = useCallback((delta) => {
    const newArrowV = Math.min(limitV, Math.max(0, arrowV + delta))
    if (newArrowV !== arrowV) {
      setArrowV(newArrowV)
      setArrowH(delta > 0 ? 0 : limitH)
      // setArrowH(delta =0)
    }
  }, [arrowV])

  const updateArrowH = (delta) => {
    setArrowH(prev => Math.min(limitH, Math.max(0, prev + delta)))
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPressedKey(e.key);
      switch(e.key) {
        case 'ArrowUp':
          updateArrowV(1)
          break
        case 'ArrowDown':
          updateArrowV(-1)
          break
        case 'ArrowLeft':
          updateArrowH(-1)
          break
        case 'ArrowRight':
          updateArrowH(1)
          break
      }
    }

    const handleKeyUp = () => {
      setPressedKey(null);
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [arrowV, updateArrowV])

  return (
    <>
      <div className={`sidebar ${showSidebar ? '' : 'hidden'}`}>
        <button 
          className="sidebar-toggle"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? '◄' : '►'}
        </button>
          {selectedObject && (
            <div className="object-name">{selectedObject.header}</div>
          )}
          <div className="object-data">
            {selectedObject ? (
              <>
                <div className="object-properties">
                  <div className="model-data">
                    <div>Model V: {selectedObject.details.modelV}</div>
                    <div>Model H: {selectedObject.details.modelH}</div>
                    {selectedObject.objectInfo && (
                      <pre>
                        {JSON.stringify(selectedObject.objectInfo, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="object-properties">
                Click an object to see its properties
              </div>
            )}
          </div>
        
        <div className="controls-container">
          <div className="phase-display">
            <div>Phase: {
              arrowV === 0 ? 'Existing' :
              arrowV === 1 ? 'Arch Demolish' :
              arrowV === 2 ? 'Structure Demolish' :
              arrowV === 3 ? 'Structure' :
              arrowV === 4 ? 'Architecture' :
              arrowV === 5 ? 'Interior' :
              'Unknown'
            }</div>
          </div>
          <div className="state-display">
            <div>State {arrowV}-{arrowH}</div>
          </div>
          <div className="arrow-controls">
            <button 
              onClick={() => updateArrowV(1)}
              className={pressedKey === 'ArrowUp' ? 'pressed-up' : ''}
            >▲</button>
            <button 
              onClick={() => updateArrowV(-1)}
              className={pressedKey === 'ArrowDown' ? 'pressed-down' : ''}
            >▼</button>
            <button 
              onClick={() => updateArrowH(-1)}
              className={pressedKey === 'ArrowLeft' ? 'pressed-left' : ''}
            >◀</button>
            <button 
              onClick={() => updateArrowH(1)}
              className={pressedKey === 'ArrowRight' ? 'pressed-right' : ''}
            >▶</button>
          </div>
        </div>
      </div>

      <Canvas
        shadows
        camera={{
          position: [-15,8,-10],
          fov: 75
        }}
      >
        <OrbitControls />
        <LightScene />
        <LoadModels 
          arrowV={arrowV} 
          arrowH={arrowH}
          onObjectSelect={setSelectedObject}
        />
      </Canvas>
    </>
  )
}

export default App

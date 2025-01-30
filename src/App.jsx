import React from 'react';
import { Canvas } from '@react-three/fiber';

import Model from './Models.jsx';
import LightScene from './LightScene.jsx';

function App() {
  return (
    <div className="app">
      <div className="canvas-container">
        <Canvas
          camera={{ 
            position: [-35, 8, -13],
            fov: 50 
          }}
        >
         <Model />
         <LightScene />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
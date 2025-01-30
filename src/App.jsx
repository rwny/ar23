import React from 'react';
import { Canvas } from '@react-three/fiber';
import Models from './Models.jsx';
import LightScene from './LightScene.jsx';
import Sidebar from './components/Sidebar.jsx';
import './App.css'

function App() {
    return (
        <div> {/* Parent wrapper div */}
            <div className="app">
                <Sidebar />
                <div className="canvas-container">
                    <Canvas
                        shadows
                        camera={{
                            position: [-25, 6, -13],
                            fov: 50
                        }}
                    >
                        <Models />
                        <LightScene />
                    </Canvas>
                </div>
            </div>
            <div className="version-text">
              Version 1.0.0 @rwny
            </div>
        </div>
    );
}

export default App;
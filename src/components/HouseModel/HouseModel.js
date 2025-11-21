import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const House = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Foundation */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.5, 6]} />
        <meshStandardMaterial color="#696969" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[5, 3, 5]} />
        <meshStandardMaterial color="#F5F5DC" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 4.5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[4, 2, 4]} />
        <meshStandardMaterial color="#8B0000" />
      </mesh>

      {/* Door */}
      <mesh position={[0, 1, 2.51]}>
        <boxGeometry args={[1, 2, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Windows */}
      <mesh position={[-2, 2, 2.51]}>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#87CEEB" />
      </mesh>
      <mesh position={[2, 2, 2.51]}>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#87CEEB" />
      </mesh>
    </group>
  );
};

const HouseModel = () => {
  return (
    <div className="house-model-container">
      <Canvas camera={{ position: [10, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={0.8}
          castShadow
        />
        <House />
        <OrbitControls 
          enableZoom={true} 
          enablePan={true}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>
      <div className="model-controls">
        <p>Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
};

export default HouseModel;
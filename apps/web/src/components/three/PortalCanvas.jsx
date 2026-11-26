import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

const GlowingRing = () => {
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.getElapsedTime() * 0.4;
      ringRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <group ref={ringRef}>
      {/* Outer Torus */}
      <mesh>
        <torusGeometry args={[2.5, 0.08, 16, 100]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={2}
          roughness={0.2}
        />
      </mesh>
      {/* Inner Torus */}
      <mesh>
        <torusGeometry args={[2.0, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#22D3EE"
          emissive="#22D3EE"
          emissiveIntensity={2.5}
          roughness={0.1}
        />
      </mesh>
      {/* Central Singularity Sphere */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#1E1B4B"
          emissiveIntensity={1}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};

const OrbitingCrystals = () => {
  const groupRef = useRef();

  const crystals = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      angle: (i / 6) * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
      radius: 3.2,
      scale: 0.2 + Math.random() * 0.15,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {crystals.map((c, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1}>
          <mesh
            position={[
              Math.cos(c.angle) * c.radius,
              Math.sin(c.angle) * 0.5,
              Math.sin(c.angle) * c.radius,
            ]}
          >
            <octahedronGeometry args={[c.scale]} />
            <meshStandardMaterial
              color="#FBBF24"
              emissive="#F59E0B"
              emissiveIntensity={1.5}
              roughness={0.1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

export const PortalCanvas = ({ className = 'w-full h-[500px]' }) => {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#8B5CF6" />
        <pointLight position={[-5, -5, -5]} intensity={1.5} color="#22D3EE" />
        <GlowingRing />
        <OrbitingCrystals />
        <Stars radius={50} depth={50} count={1200} factor={4} saturation={0} fade speed={1.5} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
};

export default PortalCanvas;

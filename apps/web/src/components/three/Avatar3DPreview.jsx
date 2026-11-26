import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows } from '@react-three/drei';

const StylizedCharacter = ({ equippedItems = {}, skinTone = '#d1a384' }) => {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle idle breathing animation
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.05;
    }
  });

  const hasArmor = equippedItems.armor && equippedItems.armor !== 'none';
  const hasWings = equippedItems.effects === 'effect_quantum_wings';
  const hasVisor = equippedItems.accessories === 'accessory_ar_visor';

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Head */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={skinTone} roughness={0.4} />
      </mesh>

      {/* Hair (Cyber spikes) */}
      <mesh position={[0, 2.5, 0.05]}>
        <coneGeometry args={[0.38, 0.4, 6]} />
        <meshStandardMaterial color={equippedItems.hairColor || '#8B5CF6'} roughness={0.3} />
      </mesh>

      {/* Visor if equipped */}
      {hasVisor && (
        <mesh position={[0, 2.25, 0.32]}>
          <boxGeometry args={[0.45, 0.12, 0.1]} />
          <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={2} />
        </mesh>
      )}

      {/* Torso */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 0.9, 16]} />
        <meshStandardMaterial
          color={hasArmor ? '#6D28D9' : '#1E293B'}
          emissive={hasArmor ? '#8B5CF6' : '#000000'}
          emissiveIntensity={hasArmor ? 0.8 : 0}
          roughness={hasArmor ? 0.2 : 0.8}
        />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.45, 1.35, 0]}>
        <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      <mesh position={[0.45, 1.35, 0]}>
        <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.2, 0.5, 0]}>
        <capsuleGeometry args={[0.12, 0.8, 8, 16]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
      <mesh position={[0.2, 0.5, 0]}>
        <capsuleGeometry args={[0.12, 0.8, 8, 16]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>

      {/* Boots */}
      <mesh position={[-0.2, 0.08, 0.05]}>
        <boxGeometry args={[0.2, 0.16, 0.3]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      <mesh position={[0.2, 0.08, 0.05]}>
        <boxGeometry args={[0.2, 0.16, 0.3]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* Quantum Wings (if equipped) */}
      {hasWings && (
        <group position={[0, 1.5, -0.2]}>
          <mesh rotation={[0, 0, Math.PI / 4]} position={[-0.6, 0.4, 0]}>
            <coneGeometry args={[0.2, 1.2, 4]} />
            <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={2} transparent opacity={0.8} />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]} position={[0.6, 0.4, 0]}>
            <coneGeometry args={[0.2, 1.2, 4]} />
            <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={2} transparent opacity={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export const Avatar3DPreview = ({ equippedItems = {}, skinTone = '#d1a384', className = 'h-[360px]' }) => {
  return (
    <div className={`w-full relative ${className}`}>
      <Canvas camera={{ position: [0, 1, 4], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 4]} intensity={1.5} color="#FFFFFF" />
        <pointLight position={[-3, 2, -2]} intensity={1} color="#8B5CF6" />
        <StylizedCharacter equippedItems={equippedItems} skinTone={skinTone} />
        <ContactShadows position={[0, -1.05, 0]} opacity={0.6} scale={4} blur={2} far={4} color="#080B14" />
        <OrbitControls enableZoom={true} minDistance={2.5} maxDistance={6} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
};

export default Avatar3DPreview;

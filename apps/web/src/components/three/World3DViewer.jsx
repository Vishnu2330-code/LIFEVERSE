import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Grid } from '@react-three/drei';
import * as THREE from 'three';

const IslandGround = ({ theme = 'futuristic_city' }) => {
  const getThemeColor = () => {
    switch (theme) {
      case 'space_colony':
        return '#7C2D12';
      case 'fantasy_island':
        return '#065F46';
      case 'cyberpunk_city':
        return '#1E1B4B';
      default:
        return '#1E293B';
    }
  };

  return (
    <group position={[0, -0.4, 0]}>
      {/* Floating Island Base */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[5, 4.2, 0.8, 32]} />
        <meshStandardMaterial color={getThemeColor()} roughness={0.6} />
      </mesh>
      {/* Under-rock stalactite */}
      <mesh position={[0, -1.2, 0]}>
        <coneGeometry args={[4.2, 1.8, 16]} />
        <meshStandardMaterial color="#0F172A" roughness={0.9} />
      </mesh>
    </group>
  );
};

const RenderedBuilding = ({ building, isSelected, onClick }) => {
  const meshRef = useRef();
  const { buildingType, gridX, gridY, level } = building;

  // Convert grid coords (0-9) to 3D world coords on island
  const posX = (gridX - 4.5) * 0.8;
  const posZ = (gridY - 4.5) * 0.8;

  const getBuildingVisuals = () => {
    switch (buildingType) {
      case 'learning_library':
        return { color: '#38BDF8', height: 1.2 * (1 + level * 0.2), geometry: 'box' };
      case 'fitness_arena':
        return { color: '#EF4444', height: 0.9 * (1 + level * 0.2), geometry: 'cylinder' };
      case 'productivity_tower':
        return { color: '#8B5CF6', height: 2.0 * (1 + level * 0.2), geometry: 'box' };
      case 'meditation_garden':
        return { color: '#10B981', height: 0.5 * (1 + level * 0.2), geometry: 'cylinder' };
      default:
        return { color: '#FBBF24', height: 1.5, geometry: 'box' };
    }
  };

  const visuals = getBuildingVisuals();

  return (
    <group
      position={[posX, visuals.height / 2, posZ]}
      onClick={(e) => {
        e.stopPropagation();
        onClick(building);
      }}
    >
      <mesh ref={meshRef}>
        {visuals.geometry === 'box' ? (
          <boxGeometry args={[0.6, visuals.height, 0.6]} />
        ) : (
          <cylinderGeometry args={[0.35, 0.45, visuals.height, 16]} />
        )}
        <meshStandardMaterial
          color={visuals.color}
          emissive={isSelected ? visuals.color : '#000000'}
          emissiveIntensity={isSelected ? 0.6 : 0}
          roughness={0.3}
        />
      </mesh>
      {isSelected && (
        <mesh position={[0, visuals.height / 2 + 0.3, 0]}>
          <octahedronGeometry args={[0.15]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={2} />
        </mesh>
      )}
    </group>
  );
};

export const World3DViewer = ({
  world,
  onSelectBuilding,
  selectedBuilding,
  className = 'h-[550px]',
}) => {
  const buildings = world?.buildings || [];

  return (
    <div className={`w-full relative ${className}`}>
      <Canvas
        camera={{ position: [0, 8, 9], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 10, 5]} intensity={1.4} castShadow />
        <pointLight position={[-5, 4, -4]} intensity={0.8} color="#8B5CF6" />

        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
          <IslandGround theme={world?.theme} />
          {buildings.map((b) => (
            <RenderedBuilding
              key={b.buildingId}
              building={b}
              isSelected={selectedBuilding?.buildingId === b.buildingId}
              onClick={onSelectBuilding}
            />
          ))}
        </Float>

        <OrbitControls
          enableZoom={true}
          minDistance={5}
          maxDistance={18}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
};

export default World3DViewer;

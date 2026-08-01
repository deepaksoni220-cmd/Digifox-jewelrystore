import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Placeholder ring — swap later with a GLTF model.
 * Built from a torus (band) + cone prongs + octahedron stone.
 */
export function PlaceholderRing() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={group}>
      {/* Band */}
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.18, 64, 200]} />
        <meshPhysicalMaterial
          color="#e8e8ec"
          metalness={1}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.4}
        />
      </mesh>
      {/* Prongs */}
      {[-0.35, 0.35].map((x) =>
        [-0.35, 0.35].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 1.05, z]}>
            <coneGeometry args={[0.07, 0.4, 16]} />
            <meshPhysicalMaterial color="#e8e8ec" metalness={1} roughness={0.18} envMapIntensity={1.4} />
          </mesh>
        ))
      )}
      {/* Stone */}
      <mesh position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[0.45, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.2}
          roughness={0.05}
          transmission={0.9}
          thickness={0.6}
          ior={2.4}
          clearcoat={1}
          envMapIntensity={2}
        />
      </mesh>
    </group>
  );
}

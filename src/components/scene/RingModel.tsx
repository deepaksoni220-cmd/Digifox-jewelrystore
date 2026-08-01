import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Respect the Vite base path so the model resolves both at "/" (dev) and when
// the site is embedded under a sub-path like "/my-site/".
const MODEL_URL = import.meta.env.BASE_URL + "ring.glb";

// Normalize the imported ring so the existing RING_STATES (tuned around a
// ~2.2-unit ring with the stone pointing up and the band opening facing the
// camera) keep working regardless of the GLB's native scale/orientation.
const TARGET_SIZE = 2.2;
// The exported ring sits with its stone toward +Y and the band hole along Z,
// which already matches the placeholder convention — no extra rotation needed.
const BASE_ROTATION: [number, number, number] = [0, 0, 0];

/**
 * The real signature ring (GLTF). Centered + uniformly scaled so it drops in
 * for the old PlaceholderRing. Each mount gets its own clone so the hero ring
 * and the six cluster rings can move independently.
 */
export function RingModel({ spin = false }: { spin?: boolean }) {
  const { scene } = useGLTF(MODEL_URL);
  const group = useRef<THREE.Group>(null);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    // Center on origin and normalize size.
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const k = TARGET_SIZE / maxDim;
    clone.position.set(-center.x * k, -center.y * k, -center.z * k);
    clone.scale.setScalar(k);
    // No material overrides — use original GLB colours as designed.
    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    if (spin && group.current) {
      group.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={group} rotation={BASE_ROTATION}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

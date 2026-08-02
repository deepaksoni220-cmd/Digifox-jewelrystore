import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { RingModel } from "./RingModel";

import { ringState } from "./ringState";

// Slowly rotate the studio HDRI so its reflection lines glide across the chrome
// even when the ring geometry is nearly still — the "alive" jewelry feel.
function SlidingReflections() {
  useFrame(({ scene }, delta) => {
    const rot = (scene as unknown as { environmentRotation?: THREE.Euler })
      .environmentRotation;
    if (rot) rot.y += delta * 0.04;
  });
  return null;
}

function CameraRig() {
  const init = useRef(false);
  useFrame(({ camera }, delta) => {
    const d = Math.min(delta, 1 / 30); // clamp so tab-refocus hitches don't jump
    if (!init.current) {
      camera.position.z = ringState.camZ;
      init.current = true;
    } else {
      camera.position.z = THREE.MathUtils.damp(camera.position.z, ringState.camZ, 8, d);
    }
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function RingRig() {
  const root = useRef<THREE.Group>(null);
  const orbits = useRef<THREE.Group[]>([]);
  const init = useRef(false);

  useFrame((_, delta) => {
    if (!root.current) return;
    const r = root.current;
    const d = Math.min(delta, 1 / 30); // clamp so tab-refocus hitches don't jump
    const damp = THREE.MathUtils.damp;
    const baseScale = THREE.MathUtils.lerp(ringState.scale, ringState.scale * 0.55, ringState.cluster);
    if (!init.current) {
      // First paint: snap straight to the resting pose (no fade/slide/pop-in).
      r.position.set(ringState.posX, ringState.posY, 0);
      r.scale.setScalar(baseScale);
      r.rotation.set(ringState.rotX, ringState.rotY, ringState.rotZ);
      init.current = true;
    } else {
      // Frame-rate-independent damping → identical butter at 60/120/144 Hz.
      r.position.x = damp(r.position.x, ringState.posX, 11, d);
      r.position.y = damp(r.position.y, ringState.posY, 11, d);
      const s = damp(r.scale.x, baseScale, 11, d);
      r.scale.setScalar(s);
      r.rotation.x = damp(r.rotation.x, ringState.rotX, 10, d);
      r.rotation.y = damp(r.rotation.y, ringState.rotY, 9, d);
      r.rotation.z = damp(r.rotation.z, ringState.rotZ, 10, d);
    }

    const t = ringState.cluster;
    orbits.current.forEach((g, i) => {
      if (!g) return;
      const angle = (i / 6) * Math.PI * 2 + performance.now() * 0.00025;
      const radius = 1.8 * t;
      g.position.x = Math.cos(angle) * radius;
      g.position.y = Math.sin(angle) * radius + Math.sin(performance.now() * 0.001 + i) * 0.08 * t;
      g.position.z = Math.sin(angle * 1.3) * 0.4 * t;
      g.scale.setScalar(0.6 * t);
      g.visible = t > 0.02;
      g.rotation.y += d * 0.5;
      g.rotation.x = Math.sin(angle * 2 + performance.now() * 0.0005) * 0.5;
    });
  });

  return (
    <group ref={root}>
      <RingModel />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) orbits.current[i] = el;
          }}
        >
          <RingModel />
        </group>
      ))}
    </group>
  );
}

export function RingCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 32 }}
      gl={{ antialias: true, alpha: true, toneMappingExposure: 1.1 }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 6, 4]} intensity={2.4} />
      <directionalLight position={[-5, 2, -3]} intensity={1.2} color="#b8c6ff" />
      <directionalLight position={[0, -4, 2]} intensity={0.5} color="#ffd9b8" />
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <SlidingReflections />
        <RingRig />
        <ContactShadows position={[0, -1.6, 0]} opacity={0.35} blur={3} far={4} />
      </Suspense>
      <CameraRig />
    </Canvas>
  );
}

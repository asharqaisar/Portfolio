'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type GyroscopeProps = {
  paused: boolean;
  reduced: boolean;
  compact: boolean;
};

/**
 * Three rings on different axes, orbiting the portrait in front of them.
 *
 * Deliberately not the old obelisk: this form reads as instrumentation —
 * gimbals, bearings, orbits — which suits "I deploy and run the thing"
 * better than a sculpture does. Two steel rings carry the light, one lime
 * ring carries the accent, so the object never competes with the portrait
 * sitting in front of it.
 */
export function Gyroscope({ paused, reduced, compact }: GyroscopeProps) {
  const group = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  // Segment counts are the main mobile lever: this is the whole poly budget.
  const seg: [number, number] = compact ? [96, 10] : [176, 14];

  useEffect(() => {
    if (reduced) return;
    const onMove = (event: PointerEvent) => {
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || paused) return;

    if (reduced) {
      // Snap: under reduced motion only a couple of frames run, so damping
      // toward a target would freeze the form mid-ramp.
      g.rotation.set(-0.12, 0.34, 0);
      if (ringA.current) ringA.current.rotation.set(0, 0.2, 0);
      if (ringB.current) ringB.current.rotation.set(1.15, 0, 0.42);
      if (ringC.current) ringC.current.rotation.set(0.5, 0.62, 0);
      return;
    }

    const t = state.clock.elapsedTime;
    const step = Math.min(delta, 1 / 30);

    if (ringA.current) ringA.current.rotation.y += step * 0.16;
    if (ringB.current) {
      ringB.current.rotation.x -= step * 0.11;
      ringB.current.rotation.z += step * 0.06;
    }
    if (ringC.current) ringC.current.rotation.y -= step * 0.09;

    // Lean toward the pointer, damped. Never enough to break the silhouette.
    const targetY = pointer.current.x * 0.42;
    const targetX = pointer.current.y * 0.24;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY + t * 0.03, 2.2, step);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX - 0.08, 2.2, step);
  });

  return (
    <group ref={group} rotation={[-0.08, 0.34, 0]}>
      {/* outer steel ring */}
      <mesh ref={ringA} rotation={[0, 0.2, 0]}>
        <torusGeometry args={[1.577, 0.013, seg[1], seg[0]]} />
        <meshStandardMaterial color="#cbd5e1" metalness={1} roughness={0.22} envMapIntensity={1.4} />
      </mesh>

      {/* mid lime ring — the accent */}
      <mesh ref={ringB} rotation={[1.15, 0, 0.42]}>
        <torusGeometry args={[1.339, 0.016, seg[1], seg[0]]} />
        <meshStandardMaterial
          color="#aef33f"
          metalness={0.72}
          roughness={0.3}
          envMapIntensity={1.15}
          emissive="#aef33f"
          emissiveIntensity={0.14}
        />
      </mesh>

      {/* inner steel ring, counter-rotating */}
      <mesh ref={ringC} rotation={[0.5, 0.62, 0]}>
        <torusGeometry args={[1.134, 0.011, seg[1], seg[0]]} />
        <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.34} envMapIntensity={1.1} />
      </mesh>

    </group>
  );
}

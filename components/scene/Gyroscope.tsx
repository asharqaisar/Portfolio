'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type GyroscopeProps = {
  paused: boolean;
  reduced: boolean;
  compact: boolean;
  onTextureReady?: () => void;
};

/**
 * The portrait is part of the scene, not layered behind it.
 *
 * It used to be an <img> painted over the canvas, which meant every ring was
 * sliced off at the photo's edge — two objects stacked, not one composition.
 * Now the photo is a textured disc at the centre of the ring system, so the
 * near arc of a ring passes in front of it and the far arc disappears behind
 * it, with WebGL handling the occlusion.
 *
 * Three rings on different axes — two steel, one lime. Reads as instrumentation
 * (gimbals, bearings, orbits), which suits "I deploy and run the thing".
 */

// The photo circle is 1/1.9 of the canvas box (the canvas overhangs the stage
// by 45%). At camera z=5.6 / fov 34 the half-height is 1.712 world units, so
// the photo's radius in scene units is 0.526 * 1.712 = 0.901.
const PORTRAIT_R = 0.901;

// A square window on a 1000x1619 source: 0.6177 of the height, positioned to
// match the CSS crop `object-position: 52% 38%`. v is measured from the bottom
// because three.js uploads textures flipped.
const REPEAT_Y = 0.6177;
const OFFSET_Y = 0.2372;

function radialTexture(stops: Array<[number, string]>, size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [at, color] of stops) gradient.addColorStop(at, color);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function Gyroscope({ paused, reduced, compact, onTextureReady }: GyroscopeProps) {
  const group = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const sweep = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [photo, setPhoto] = useState<THREE.Texture | null>(null);

  const seg: [number, number] = compact ? [96, 10] : [176, 14];

  // Rim shade: transparent across the face, easing to the void colour at the
  // edge, so the photo dissolves into the background instead of being a cutout.
  const rim = useMemo(
    () =>
      radialTexture([
        [0, 'rgba(2,6,23,0)'],
        [0.58, 'rgba(2,6,23,0)'],
        [0.86, 'rgba(2,6,23,0.34)'],
        [1, 'rgba(2,6,23,0.92)'],
      ]),
    [],
  );

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let disposed = false;
    loader.load('/ashar-portrait.jpg', (texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      texture.repeat.set(1, REPEAT_Y);
      texture.offset.set(0, OFFSET_Y);
      setPhoto(texture);
      onTextureReady?.();
    });
    return () => {
      disposed = true;
    };
  }, [onTextureReady]);

  useEffect(() => () => photo?.dispose(), [photo]);

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
      if (sweep.current) sweep.current.rotation.set(-1.15, 0, 0.15);
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
    if (sweep.current) sweep.current.rotation.y += step * 0.07;

    // Lean toward the pointer, damped. Never enough to break the silhouette.
    const targetY = pointer.current.x * 0.42;
    const targetX = pointer.current.y * 0.24;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY + t * 0.03, 2.2, step);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX - 0.08, 2.2, step);
  });

  return (
    <group ref={group} rotation={[-0.08, 0.34, 0]}>
      {/* the photograph itself */}
      {photo && (
        <mesh>
          <circleGeometry args={[PORTRAIT_R, compact ? 48 : 96]} />
          <meshBasicMaterial map={photo} toneMapped={false} />
        </mesh>
      )}

      {/* rim shade — melts the edge into the ground */}
      {rim && (
        <mesh position={[0, 0, 0.004]}>
          <circleGeometry args={[PORTRAIT_R, compact ? 48 : 96]} />
          <meshBasicMaterial map={rim} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      )}

      {/* outer steel ring */}
      <mesh ref={ringA} rotation={[0, 0.2, 0]}>
        <torusGeometry args={[1.577, 0.013, seg[1], seg[0]]} />
        <meshStandardMaterial color="#cbd5e1" metalness={1} roughness={0.22} envMapIntensity={1.4} />
      </mesh>

      {/* mid ring — steel, orbits clear of the photo */}
      <mesh ref={ringB} rotation={[1.15, 0, 0.42]}>
        <torusGeometry args={[1.339, 0.014, seg[1], seg[0]]} />
        <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.3} envMapIntensity={1.2} />
      </mesh>

      {/* inner steel ring, counter-rotating */}
      <mesh ref={ringC} rotation={[0.5, 0.62, 0]}>
        <torusGeometry args={[1.134, 0.011, seg[1], seg[0]]} />
        <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.34} envMapIntensity={1.1} />
      </mesh>

      {/*
        Sweep ring — the one that proves the portrait is inside the scene.
        Tilted -1.15 about X, so its near arc rides at y = -R*cos(1.15) ≈ -0.48,
        well inside the photo's 0.901 radius, at z = +R*sin(1.15) ≈ +1.11 (in
        front). The far arc sits at the same height behind the disc and is
        occluded by it. That depth swap is the whole point.
      */}
      <mesh ref={sweep} rotation={[-1.15, 0, 0.15]}>
        <torusGeometry args={[1.22, 0.009, seg[1], seg[0]]} />
        <meshStandardMaterial
          color="#aef33f"
          metalness={0.7}
          roughness={0.28}
          envMapIntensity={1.2}
          emissive="#aef33f"
          emissiveIntensity={0.18}
        />
      </mesh>
    </group>
  );
}

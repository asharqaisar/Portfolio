'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { Gyroscope } from './scene/Gyroscope';

let cachedWebgl: boolean | null = null;

/** Probed once per page load; the server optimistically assumes WebGL exists. */
function getWebglSupport() {
  if (cachedWebgl === null) {
    const probe = document.createElement('canvas');
    cachedWebgl = Boolean(probe.getContext('webgl2') || probe.getContext('webgl'));
  }
  return cachedWebgl;
}

const subscribeToNothing = () => () => {};
const assumeSupported = () => true;

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/** Painted stand-in when WebGL is unavailable: the same three rings, flat. */
function StaticRings() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
      <ellipse
        cx="200"
        cy="200"
        rx="180"
        ry="64"
        fill="none"
        stroke="#cbd5e1"
        strokeOpacity="0.42"
        strokeWidth="1.1"
        transform="rotate(-16 200 200)"
      />
      <ellipse
        cx="200"
        cy="200"
        rx="152"
        ry="53"
        fill="none"
        stroke="#aef33f"
        strokeOpacity="0.62"
        strokeWidth="1.5"
        transform="rotate(28 200 200)"
      />
      <ellipse
        cx="200"
        cy="200"
        rx="126"
        ry="44"
        fill="none"
        stroke="#94a3b8"
        strokeOpacity="0.38"
        strokeWidth="1"
        transform="rotate(-46 200 200)"
      />
    </svg>
  );
}

export function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const supported = useSyncExternalStore(subscribeToNothing, getWebglSupport, assumeSupported);
  const [visible, setVisible] = useState(true);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const compact = useMediaQuery('(max-width: 639px)');

  // Stop the render loop the moment the hero scrolls away.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (supported === false) {
    return (
      <div ref={wrap} aria-hidden className="pointer-events-none absolute inset-0">
        <StaticRings />
      </div>
    );
  }

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none absolute inset-0">
      {supported && (
        <Canvas
          dpr={compact ? [1, 1.5] : [1, 1.75]}
          frameloop={visible && !reduced ? 'always' : 'demand'}
          camera={{ position: [0, 0, 5.6], fov: 34 }}
          gl={{ alpha: true, antialias: !compact, powerPreference: 'high-performance' }}
        >
          <Gyroscope paused={!visible} reduced={reduced} compact={compact} />

          {/* Local lightformers only — no HDR fetch, no network cost. */}
          <Environment resolution={compact ? 64 : 128} frames={1}>
            <Lightformer
              form="rect"
              intensity={2.6}
              color="#aef33f"
              position={[2.4, 2.2, 1.8]}
              scale={[3, 3, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1.5}
              color="#dbeafe"
              position={[-3, 1.2, -2]}
              scale={[4, 4, 1]}
            />
            <Lightformer
              form="circle"
              intensity={1.1}
              color="#94a3b8"
              position={[0, -2.6, 1.4]}
              scale={[3, 3, 1]}
            />
            <mesh scale={12}>
              <sphereGeometry args={[1, 24, 24]} />
              <meshBasicMaterial color="#0b1220" side={1} />
            </mesh>
          </Environment>
        </Canvas>
      )}
    </div>
  );
}

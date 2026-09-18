/** Film grain + a soft vignette. Sits above everything, catches nothing. */
export function Grain() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50">
      <div className="grain absolute inset-0 opacity-[0.045] mix-blend-overlay" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(125% 90% at 50% 40%, transparent 42%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
}

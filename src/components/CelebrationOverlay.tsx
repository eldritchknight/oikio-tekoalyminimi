import { useEffect, useState, useCallback, useMemo } from 'react';

interface Props {
  onComplete: () => void;
}

// Generate deterministic particle positions based on index
function generateParticles() {
  return Array.from({ length: 24 }, (_, i) => ({
    id: i,
    // Use deterministic positioning based on index for consistent renders
    delay: (i * 0.02) % 0.5,
    x: ((i * 17 + 7) % 100),
    y: ((i * 23 + 11) % 100),
    size: 4 + (i % 5),
  }));
}

export function CelebrationOverlay({ onComplete }: Props) {
  const [phase, setPhase] = useState<'intro' | 'main' | 'outro'>('intro');

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  // Animation phases
  useEffect(() => {
    if (prefersReducedMotion) {
      // Skip directly to completion for reduced motion
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }

    // Phase transitions
    const introTimer = setTimeout(() => setPhase('main'), 300);
    const outroTimer = setTimeout(() => setPhase('outro'), 2200);
    const completeTimer = setTimeout(onComplete, 2800);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(outroTimer);
      clearTimeout(completeTimer);
    };
  }, [prefersReducedMotion, onComplete]);

  // Memoize particles to avoid regenerating on every render
  const particles = useMemo(() => generateParticles(), []);

  if (prefersReducedMotion) {
    return (
      <div className="celebration-overlay celebration-overlay--reduced" role="alert" aria-live="polite">
        <div className="celebration-content">
          <div className="celebration-text celebration-text--title">
            KAIKKI KENTÄT KALIBROITU
          </div>
          <div className="celebration-text celebration-text--subtitle">
            AI-OPERATOR STATUS: ONLINE
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`celebration-overlay celebration-overlay--${phase}`}
      role="alert"
      aria-live="polite"
    >
      {/* Pixel particles */}
      <div className="celebration-particles" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="celebration-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Glow ring */}
      <div className="celebration-glow-ring" aria-hidden="true" />

      {/* Main content */}
      <div className="celebration-content">
        <div className="celebration-icon" aria-hidden="true">
          <div className="celebration-icon-inner" />
        </div>

        <div className="celebration-text celebration-text--title">
          KAIKKI KENTÄT KALIBROITU
        </div>

        <div className="celebration-text celebration-text--subtitle">
          AI-OPERATOR STATUS: ONLINE
        </div>
      </div>

      {/* Skip button */}
      <button
        className="celebration-skip"
        onClick={handleSkip}
        aria-label="Ohita animaatio"
      >
        [ESC] OHITA
      </button>
    </div>
  );
}

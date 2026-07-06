'use client';

import { useEffect, useRef } from 'react';

/* Muted looping showcase. Plays via JS (not the autoPlay attribute) so a
   blocked autoplay resolves silently instead of logging an unhandled
   rejection — and retries on the visitor's first interaction. */
export default function ShowcaseVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    v.muted = true;
    const tryPlay = () => v.play().catch(() => { /* blocked — first frame stands in */ });
    tryPlay();

    const onInteract = () => {
      if (v.paused) tryPlay();
    };
    window.addEventListener('pointerdown', onInteract, { once: true });
    window.addEventListener('scroll', onInteract, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('scroll', onInteract);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      style={{ width: '100%', display: 'block' }}
    />
  );
}

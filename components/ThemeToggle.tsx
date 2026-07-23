'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Theme = 'dark' | 'light';

/* Darkroom ↔ Daylight. The control is a specimen swatch of the other
   room — paper in the dark, ink in the light. On click the new theme
   expands as a circle from the exact point you clicked. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    setTheme(
      document.documentElement.getAttribute('data-theme') === 'light'
        ? 'light'
        : 'dark',
    );
  }, []);

  const apply = (next: Theme) => {
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode — preference just won't persist */
    }
    setTheme(next);
  };

  const toggle = (e: React.MouseEvent) => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (reduced || !doc.startViewTransition) {
      apply(next);
      return;
    }

    const x = e.clientX || window.innerWidth - 40;
    const y = e.clientY || 24;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = doc.startViewTransition(() => apply(next));
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 650,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    });
  };

  const destination = theme === 'light' ? 'Darkroom' : 'Daylight';

  return (
    <motion.button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to the ${destination.toLowerCase()} theme`}
      title={destination}
      data-cursor
      data-cursor-label={destination}
      whileHover="hover"
      whileTap="tap"
    >
      <motion.span
        className="theme-chip"
        aria-hidden
        variants={
          reduced
            ? undefined
            : {
                hover: {
                  rotate: 45,
                  scale: 1.45,
                  boxShadow:
                    '0 0 12px color-mix(in srgb, var(--bone) 45%, transparent)',
                },
                tap: { rotate: 45, scale: 0.85 },
              }
        }
        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
      />
    </motion.button>
  );
}

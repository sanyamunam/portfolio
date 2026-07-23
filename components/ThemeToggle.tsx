'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Theme = 'dark' | 'light';

/* Darkroom ↔ Daylight. The control is the darkroom's pull-cord lamp:
   a cord hanging from the top of the page. Press it and the cord
   stretches; release, it snaps back and the new theme floods out from
   the bead as a circle — the light turning on. */
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
      aria-label={`Pull the light cord — switch to the ${destination.toLowerCase()} theme`}
      title={`Pull — ${destination.toLowerCase()}`}
      data-cursor
      data-cursor-label={theme === 'light' ? 'Lights off' : 'Lights on'}
      whileHover="sway"
      whileTap="pull"
    >
      <motion.span
        className="cord-group"
        aria-hidden
        variants={
          reduced
            ? undefined
            : {
                sway: {
                  rotate: [0, 5, -4, 2, 0],
                  transition: { duration: 1.4, ease: 'easeInOut' },
                },
                pull: { rotate: 0 },
              }
        }
      >
        <motion.span
          className="cord-line"
          variants={reduced ? undefined : { pull: { scaleY: 1.4 } }}
          transition={{ type: 'spring', stiffness: 420, damping: 17 }}
        />
        <motion.span
          className="cord-bead"
          variants={
            reduced
              ? undefined
              : {
                  sway: {
                    boxShadow:
                      '0 0 10px color-mix(in srgb, var(--sienna) 55%, transparent)',
                  },
                  pull: { y: 12 },
                }
          }
          transition={{ type: 'spring', stiffness: 420, damping: 17 }}
        />
      </motion.span>
    </motion.button>
  );
}

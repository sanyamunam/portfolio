'use client';

import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

/* Darkroom ↔ Daylight. The switch expands a circle of the new theme
   from the exact point you clicked — like a light turning on. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

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

  return (
    <button
      type="button"
      className="theme-toggle caption"
      onClick={toggle}
      aria-label="Switch between dark and light theme"
      data-cursor
      data-cursor-label={theme === 'light' ? 'Lights off' : 'Lights on'}
    >
      <span className="stamp-mark" aria-hidden>✺</span>
      <span suppressHydrationWarning>
        {theme === 'light' ? 'Darkroom' : 'Daylight'}
      </span>
    </button>
  );
}

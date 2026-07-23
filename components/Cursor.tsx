'use client';

import { useEffect, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

export default function Cursor() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState('');

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const ringX = useSpring(mx, { stiffness: 260, damping: 26, mass: 0.6 });
  const ringY = useSpring(my, { stiffness: 260, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setEnabled(true);

    /* ink dust — the pointer sheds tiny specimen pixels as it moves */
    const DUST = ['--turquoise', '--orchid', '--sienna', '--wine', '--bone'];
    const noDust = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lastDust = 0;
    let dustIndex = 0;

    const shed = (e: MouseEvent) => {
      if (noDust) return;
      const now = performance.now();
      if (now - lastDust < 45) return;
      lastDust = now;
      const d = document.createElement('div');
      d.className = 'px-dust';
      const size = 3 + Math.random() * 3;
      d.style.width = `${size}px`;
      d.style.height = `${size}px`;
      d.style.left = `${e.clientX + (Math.random() * 16 - 8)}px`;
      d.style.top = `${e.clientY + (Math.random() * 16 - 8)}px`;
      d.style.background = `var(${DUST[dustIndex++ % DUST.length]})`;
      document.body.appendChild(d);
      d.addEventListener('animationend', () => d.remove());
      /* backstop for throttled tabs where the animation never runs */
      setTimeout(() => d.remove(), 1500);
    };

    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      shed(e);
    };

    const over = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button, [data-cursor]');
      if (target) {
        setHovering(true);
        setLabel(target.getAttribute('data-cursor-label') ?? '');
      } else {
        setHovering(false);
        setLabel('');
      }
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, [mx, my]);

  if (!enabled || prefersReducedMotion) return null;

  return (
    <>
      {/* ink dot */}
      <motion.div
        style={{
          x: mx,
          y: my,
          position: 'fixed',
          top: -3,
          left: -3,
          width: 6,
          height: 6,
          background: 'var(--bone)',
          zIndex: 500,
          pointerEvents: 'none',
          mixBlendMode: 'difference',
        }}
      />
      {/* trailing frame */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          position: 'fixed',
          top: -20,
          left: -20,
          width: 40,
          height: 40,
          zIndex: 499,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animate={{
          scale: hovering ? 1.9 : 1,
          rotate: hovering ? 45 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: '1px solid var(--bone)',
            mixBlendMode: 'difference',
            opacity: 0.8,
          }}
        />
        {label && (
          <span
            style={{
              fontSize: 8,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--jet)',
              background: 'var(--turquoise)',
              padding: '3px 6px',
              whiteSpace: 'nowrap',
              transform: 'rotate(-45deg)',
            }}
          >
            {label}
          </span>
        )}
      </motion.div>
    </>
  );
}

'use client';

import {
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion';

/* Monumental Ranade type with a staggered letter-rise reveal.
   The signature element — one word filling the frame.
   Hovering it sends a wave through the letterforms: each letter dips
   into the baseline and springs back, one after the other. */
export default function Wordmark({
  text,
  size = 'var(--text-wordmark)',
  color = 'var(--turquoise)',
  delay = 0.1,
  as: Tag = 'h1',
}: {
  text: string;
  size?: string;
  color?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'div';
}) {
  const reduced = useReducedMotion();
  const wave = useAnimationControls();
  const letters = text.split('');

  const ripple = () => {
    if (reduced) return;
    wave.start((i: number) => ({
      y: ['0%', '16%', '0%'],
      transition: { duration: 0.65, delay: i * 0.045, ease: [0.16, 1, 0.3, 1] },
    }));
  };

  return (
    <Tag
      className="display"
      aria-label={text}
      onMouseEnter={ripple}
      style={{
        fontSize: size,
        color,
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {letters.map((ch, i) => (
        <span
          key={i}
          aria-hidden
          style={{ display: 'inline-block', overflow: 'hidden' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: reduced ? 0 : '110%' }}
            animate={{ y: 0 }}
            transition={{
              duration: 1,
              delay: delay + i * 0.055,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <motion.span
              custom={i}
              animate={wave}
              style={{ display: 'inline-block' }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

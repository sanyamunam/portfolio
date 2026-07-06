'use client';

import { motion, useReducedMotion } from 'framer-motion';

/* Premium page transition: a jet curtain lifts off the incoming page
   while content settles up into place. Re-mounts on every navigation. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <>
      <motion.div
        aria-hidden
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--jet-3)',
          transformOrigin: 'top',
          zIndex: 450,
          pointerEvents: 'none',
        }}
      />
      <motion.div
        aria-hidden
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.7, delay: 0.08, ease: [0.83, 0, 0.17, 1] }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--turquoise)',
          transformOrigin: 'top',
          zIndex: 449,
          pointerEvents: 'none',
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}

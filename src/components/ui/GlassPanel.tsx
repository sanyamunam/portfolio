"use client";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { ReactNode } from "react";

export function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(50);
  const x = useSpring(rawX, { stiffness: 80, damping: 20 });
  const sheen = useMotionTemplate`radial-gradient(40% 60% at ${x}% 0%, var(--edge), transparent 70%)`;

  return (
    <motion.div
      className={`glass relative overflow-hidden ${className}`}
      onPointerMove={
        reduce
          ? undefined
          : (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              rawX.set(((e.clientX - r.left) / r.width) * 100);
            }
      }
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 opacity-60"
        style={{ background: sheen }}
      />
      {children}
    </motion.div>
  );
}

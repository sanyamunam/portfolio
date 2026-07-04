"use client";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import type { ReactNode } from "react";

export function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotionSafe();
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
      onPointerLeave={reduce ? undefined : () => rawX.set(50)}
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

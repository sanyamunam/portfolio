"use client";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent } from "react";

/**
 * Magnetic pull: the element leans toward the cursor by up to `strength` px.
 * Spread the returned handlers on the element and pass x/y to motion style.
 * No-ops under reduced motion or coarse pointers.
 */
export function useMagnetic(strength = 6) {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 18 });
  const y = useSpring(rawY, { stiffness: 150, damping: 18 });

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 2 * strength);
    rawY.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 2 * strength);
  };
  const onPointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { x, y, handlers: { onPointerMove, onPointerLeave } };
}

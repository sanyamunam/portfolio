"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
  type RefObject,
} from "react";
import { useInView, useMotionValue, type MotionValue } from "framer-motion";

type LightCtxValue = {
  /** Raw target temperature (0–4). Atmosphere smooths it with a spring. */
  temp: MotionValue<number>;
};

const LightCtx = createContext<LightCtxValue | null>(null);

export function LightProvider({ children }: { children: ReactNode }) {
  const temp = useMotionValue(0);
  const value = useMemo(() => ({ temp }), [temp]);
  return <LightCtx.Provider value={value}>{children}</LightCtx.Provider>;
}

export function useLight(): LightCtxValue {
  const ctx = useContext(LightCtx);
  if (!ctx) throw new Error("useLight must be used inside <LightProvider>");
  return ctx;
}

/**
 * Static beats: when the section is in view, set the world temperature.
 * Case valleys scrub temp directly instead (see CaseValley).
 *
 * `amount` (default 0.4) is the fraction of the section's own box that must
 * intersect the viewport before it counts as "in view". That default assumes
 * a section no taller than ~2.5x the viewport — IntersectionObserver can
 * never report more than `viewportHeight / sectionHeight` intersection for
 * taller sections, so a fixed 0.4 would simply never fire. Beats with a lot
 * of internal scroll room (e.g. a slow, one-at-a-time reveal sequence)
 * should pass a smaller `amount` so the world still grades once the reader
 * is meaningfully inside the section.
 */
export function useSectionLight(
  ref: RefObject<Element | null>,
  temperature: number,
  amount: number = 0.4
) {
  const { temp } = useLight();
  const inView = useInView(ref, { amount });
  useEffect(() => {
    if (inView) temp.set(temperature);
  }, [inView, temperature, temp]);
}

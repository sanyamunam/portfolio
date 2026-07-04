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
 */
export function useSectionLight(
  ref: RefObject<Element | null>,
  temperature: number
) {
  const { temp } = useLight();
  const inView = useInView(ref, { amount: 0.4 });
  useEffect(() => {
    if (inView) temp.set(temperature);
  }, [inView, temperature, temp]);
}

"use client";
import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * SSR-safe prefers-reduced-motion. Unlike framer's useReducedMotion (which
 * reads the media query on the first client render and so disagrees with the
 * server-rendered markup), this reports `false` for SSR + hydration and
 * updates immediately after — no hydration mismatch, no lint-hostile
 * setState-in-effect. Reduced-motion users see one animation-less frame.
 */
export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}

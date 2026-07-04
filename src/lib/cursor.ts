"use client";
import { createContext, useContext } from "react";
import type { MotionValue } from "framer-motion";

export type CursorMode = "ember" | "lens";
export type CursorKind =
  | "default"
  | "link"
  | "nav"
  | "case"
  | "play"
  | "art"
  | "absorb";

export type CursorTarget = {
  kind: CursorKind;
  label?: string;
  /** Measured once on target-enter; used for soft snap / absorb. */
  rect?: DOMRect;
} | null;

export type CursorState = {
  /** Raw pointer position in viewport px (skins add their own springs). */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** 0 | 1 */
  pressed: MotionValue<number>;
  /** 0 | 1 — pointer inside the document */
  visible: MotionValue<number>;
  target: CursorTarget;
  mode: CursorMode;
  setMode: (m: CursorMode) => void;
};

export const CursorContext = createContext<CursorState | null>(null);

export function useCursor(): CursorState {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursor must be used inside CursorProvider");
  return ctx;
}

/** Velocity (px/s) → comet stretch: 1 at rest, capped at 1.3. */
export function stretchFor(speed: number): number {
  const t = Math.min(Math.max(speed, 0), 5000) / 5000;
  return 1 + t * 0.3;
}

/** Distance (px) → 0..1 glow within `radius`; 0 outside or for radius ≤ 0. */
export function proximity(dist: number, radius: number): number {
  if (radius <= 0) return 0;
  return Math.max(0, Math.min(1, 1 - dist / radius));
}

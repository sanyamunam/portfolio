"use client";
import { useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { sampleLight, type LightTokens } from "@/lib/lightScript";
import { useLight } from "./LightProvider";

const VAR_MAP: Record<keyof LightTokens, string> = {
  bg: "--bg",
  ink: "--ink",
  muted: "--muted",
  glowA: "--glow-a",
  glowB: "--glow-b",
  glass: "--glass",
  edge: "--edge",
};

function applyTokens(t: LightTokens) {
  const s = document.documentElement.style;
  for (const k of Object.keys(VAR_MAP) as (keyof LightTokens)[]) {
    s.setProperty(VAR_MAP[k], t[k]);
  }
}

export function Atmosphere() {
  const { temp } = useLight();
  const reduce = useReducedMotion();

  // Slow, cinematic grade between worlds (~2s settle). Reduced motion: near-instant.
  const smooth = useSpring(
    temp,
    reduce ? { stiffness: 500, damping: 50 } : { stiffness: 26, damping: 16, mass: 1.4 }
  );

  useMotionValueEvent(smooth, "change", (v) => applyTokens(sampleLight(v)));
  useEffect(() => applyTokens(sampleLight(temp.get())), [temp]);

  // Cursor warmth: primary glow leans gently toward the pointer (decorative).
  const rawX = useMotionValue(32);
  const rawY = useMotionValue(38);
  const wx = useSpring(rawX, { stiffness: 40, damping: 20 });
  const wy = useSpring(rawY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const onMove = (e: PointerEvent) => {
      // lean, don't follow: map pointer to a narrow 24–44% band
      rawX.set(24 + (e.clientX / window.innerWidth) * 20);
      rawY.set(28 + (e.clientY / window.innerHeight) * 20);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  const glowA = useMotionTemplate`radial-gradient(56% 48% at ${wx}% ${wy}%, var(--glow-a), transparent 70%)`;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ background: glowA }} />
      <div
        className="atmo-drift absolute inset-0"
        style={{
          background:
            "radial-gradient(48% 60% at 76% 72%, var(--glow-b), transparent 72%)",
        }}
      />
      <div className="grain absolute inset-0" />
    </div>
  );
}

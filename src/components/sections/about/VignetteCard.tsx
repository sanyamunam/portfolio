"use client";
import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { EASE } from "@/lib/motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Glyph } from "./glyphs";
import type { ABOUT } from "@/content/content";

type Moment = (typeof ABOUT.moments)[number];

const LAYER_SPRING = { stiffness: 150, damping: 20 };

/**
 * A lived-in scene: 3-layer hover parallax (glyph deepest, text mid,
 * handwritten tagline closest), interior warmth tracking the cursor,
 * a one-time entrance sheen, and a tagline that inks itself on first hover.
 */
export function VignetteCard({ m, index }: { m: Moment; index: number }) {
  const reduce = useReducedMotionSafe();
  const [hovered, setHovered] = useState(false);
  const [inked, setInked] = useState(false);

  // The sheen sits behind GlassPanel's overflow-hidden clip and starts mostly
  // off-panel (x: -110%), so observing the sheen element itself yields a
  // near-zero clipped intersection ratio and whileInView never fires. Track
  // the card's own (unclipped) bounding box instead and drive the sheen from
  // that boolean.
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef, { once: true, amount: 0.5 });

  // Pointer position within the card, normalized to [-1, 1].
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, LAYER_SPRING);
  const sy = useSpring(py, LAYER_SPRING);

  const glyphX = useTransform(sx, (v) => v * -4); // deepest: against the cursor
  const glyphY = useTransform(sy, (v) => v * -4);
  const textX = useTransform(sx, (v) => v * 2);
  const textY = useTransform(sy, (v) => v * 2);
  const tagX = useTransform(sx, (v) => v * 5); // closest: with the cursor
  const tagY = useTransform(sy, (v) => v * 5);

  // Interior warmth follows the cursor (decorative, sits UNDER the text).
  const wx = useTransform(sx, (v) => 50 + v * 50);
  const wy = useTransform(sy, (v) => 50 + v * 50);
  const warmth = useMotionTemplate`radial-gradient(140px circle at ${wx}% ${wy}%, var(--glow-b), transparent 70%)`;

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    setHovered(true);
    setInked(true);
  };
  const onPointerLeave = () => {
    setHovered(false);
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="h-full"
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      animate={{ y: hovered && !reduce ? -3 : 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <GlassPanel
        className={`flex h-full flex-col p-7 transition-shadow duration-300 ${
          hovered ? "shadow-[0_12px_32px_oklch(0_0_0_/_0.08)]" : ""
        }`}
      >
        {/* interior warmth */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: warmth }}
          animate={{ opacity: hovered && !reduce ? 0.45 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        />
        {/* one-time entrance sheen */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 opacity-70"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, var(--edge) 50%, transparent 60%)",
            }}
            initial={{ x: "-110%" }}
            animate={cardInView ? { x: "310%" } : undefined}
            transition={{ duration: 1.1, ease: EASE, delay: 0.45 + index * 0.15 }}
          />
        )}

        <motion.div style={reduce ? undefined : { x: glyphX, y: glyphY }}>
          <Glyph name={m.glyph} delay={0.3 + index * 0.25} />
        </motion.div>
        <motion.div style={reduce ? undefined : { x: textX, y: textY }}>
          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted">{m.kicker}</p>
          <h3 className="mt-2 font-display text-2xl tracking-tight">{m.title}</h3>
          <p className="mt-3 leading-relaxed text-muted">{m.body}</p>
        </motion.div>
        <motion.div
          className="mt-auto grid pt-6"
          style={reduce ? undefined : { x: tagX, y: tagY }}
        >
          <p
            className="vignette-pencil col-start-1 row-start-1 font-hand text-2xl text-ink"
            data-inked={inked || undefined}
          >
            {m.tagline}
          </p>
          {!reduce && (
            <motion.p
              aria-hidden
              className="col-start-1 row-start-1 font-hand text-2xl text-ink"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={inked ? { clipPath: "inset(0 0% 0 0)" } : undefined}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            >
              {m.tagline}
            </motion.p>
          )}
        </motion.div>
      </GlassPanel>
    </motion.div>
  );
}

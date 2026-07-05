"use client";
import { motion, useSpring, useTransform } from "framer-motion";
import { useCursor } from "@/lib/cursor";
import { EASE } from "@/lib/motion";
import { CursorLabel } from "./CursorLabel";

const LAZY = { stiffness: 120, damping: 22 };
const BASE = 72; // disc diameter at rest

/** Scale per target kind (disc contracts on targets, admires art, hugs the CTA). */
function scaleFor(kind: string | undefined): number {
  switch (kind) {
    case "art":
      return 96 / BASE;
    case "absorb":
      return 40 / BASE;
    case "link":
    case "nav":
    case "case":
    case "play":
      return 48 / BASE;
    default:
      return 1;
  }
}

export function LensCursor() {
  const { x, y, pressed, visible, target } = useCursor();
  const sx = useSpring(x, LAZY);
  const sy = useSpring(y, LAZY);
  const opacity = useSpring(visible, { stiffness: 300, damping: 30 });
  const pressScale = useSpring(useTransform(pressed, [0, 1], [1, 0.92]), {
    stiffness: 400,
    damping: 30,
  });
  const kind = target?.kind;
  const hot = Boolean(kind);

  return (
    <>
      <motion.div className="absolute left-0 top-0" style={{ x: sx, y: sy, opacity }}>
        {/* press squeeze on its own wrapper — never mix an external MotionValue
            and an animate target for the same transform on one element */}
        <motion.div style={{ scale: pressScale }}>
          <motion.div
            className="rounded-full"
            animate={{ scale: scaleFor(kind) }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{
              width: BASE,
              height: BASE,
              marginLeft: -BASE / 2,
              marginTop: -BASE / 2,
              border: "1px solid var(--edge)",
              boxShadow: "inset 0 1px 0 var(--edge), 0 4px 24px oklch(0 0 0 / 0.06)",
              // Brighten, never blur — text under the lens must stay legible.
              // Inline styles bypass Lightning CSS, so both twins survive.
              WebkitBackdropFilter: hot
                ? "brightness(1.12) saturate(1.06)"
                : "brightness(1.07) saturate(1.06)",
              backdropFilter: hot
                ? "brightness(1.12) saturate(1.06)"
                : "brightness(1.07) saturate(1.06)",
            }}
          />
        </motion.div>
      </motion.div>
      <CursorLabel />
    </>
  );
}

"use client";
import {
  motion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { stretchFor, useCursor } from "@/lib/cursor";
import { EASE } from "@/lib/motion";
import { CursorLabel } from "./CursorLabel";

const FOLLOW = { stiffness: 700, damping: 42 };

/** Ring diameter per target kind (px); absent = no ring (bead/halo states). */
const RING: Record<string, number> = { link: 26, nav: 26, case: 40, play: 32 };

export function EmberCursor() {
  const { x, y, pressed, visible, target } = useCursor();
  const kind = target?.kind ?? "default";

  // Soft snap: lean 30% toward link/nav centers; absorb pulls all the way in.
  const pull = kind === "absorb" ? 1 : kind === "link" || kind === "nav" ? 0.3 : 0;
  const rect = target?.rect;
  const tx = useTransform(x, (v) =>
    rect && pull ? v + (rect.left + rect.width / 2 - v) * pull : v
  );
  const ty = useTransform(y, (v) =>
    rect && pull ? v + (rect.top + rect.height / 2 - v) * pull : v
  );
  const sx = useSpring(tx, FOLLOW);
  const sy = useSpring(ty, FOLLOW);

  // Velocity → comet stretch along the motion vector (default state only).
  const vx = useVelocity(sx);
  const vy = useVelocity(sy);
  const speed = useTransform(() => Math.hypot(vx.get(), vy.get()));
  const stretchRaw = useSpring(useTransform(speed, stretchFor), {
    stiffness: 300,
    damping: 30,
  });
  const stretch = useTransform(stretchRaw, (s) => (kind === "default" ? s : 1));
  const squash = useTransform(stretch, (s) => 1 / s);
  const angle = useTransform(() => (Math.atan2(vy.get(), vx.get()) * 180) / Math.PI);

  const pressScale = useSpring(useTransform(pressed, [0, 1], [1, 0.8]), {
    stiffness: 400,
    damping: 30,
  });
  const opacity = useSpring(visible, { stiffness: 300, damping: 30 });

  const ring = RING[kind] ?? 0;
  const absorbed = kind === "absorb";
  const halo = kind === "art";

  return (
    <>
      <motion.div className="absolute left-0 top-0" style={{ x: sx, y: sy, opacity }}>
        <motion.div
          style={{ scale: pressScale }}
          animate={{ scale: absorbed ? 0.4 : 1, opacity: absorbed ? 0 : 1 }}
          transition={{ duration: 0.32, ease: EASE }}
        >
          <motion.div style={{ rotate: angle, scaleX: stretch, scaleY: squash }}>
            {/* the bead — visible in default + absorb-approach */}
            <motion.div
              className="absolute rounded-full"
              animate={{ opacity: ring || halo ? 0 : 1, scale: ring || halo ? 0.4 : 1 }}
              transition={{ duration: 0.2, ease: EASE }}
              style={{
                width: 10,
                height: 10,
                left: -5,
                top: -5,
                background:
                  "radial-gradient(circle at 35% 35%, oklch(1 0 0 / 0.9), var(--glow-a) 60%, transparent)",
                boxShadow: "0 0 14px 2px var(--glow-a), inset 0 0 0 1px var(--edge)",
              }}
            />
          </motion.div>

          {/* the ring — link/nav/case/play */}
          <motion.div
            className="absolute rounded-full"
            initial={false}
            animate={{
              opacity: ring ? 1 : 0,
              width: ring || 26,
              height: ring || 26,
              left: -(ring || 26) / 2,
              top: -(ring || 26) / 2,
            }}
            transition={{ duration: 0.2, ease: EASE }}
            style={{
              border: "1.5px solid color-mix(in oklch, var(--ink) 45%, transparent)",
              boxShadow: "0 0 14px 0 var(--glow-a)",
            }}
          >
            {/* play glyph inside the ring */}
            <motion.span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{ opacity: kind === "play" ? 0.8 : 0 }}
              transition={{ duration: 0.15 }}
              style={{
                width: 0,
                height: 0,
                borderTop: "5px solid transparent",
                borderBottom: "5px solid transparent",
                borderLeft: "8px solid var(--ink)",
                marginLeft: 1,
              }}
            />
          </motion.div>

          {/* the halo — art */}
          <motion.div
            className="absolute rounded-full"
            animate={{ opacity: halo ? 0.55 : 0, scale: halo ? 1 : 0.3 }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{
              width: 64,
              height: 64,
              left: -32,
              top: -32,
              background: "radial-gradient(circle, var(--glow-a), transparent 70%)",
            }}
          />
        </motion.div>
      </motion.div>
      <CursorLabel />
    </>
  );
}

"use client";
import { useEffect, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
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

/* ------------------------ liquid refraction engine ------------------------
 * feTurbulence noise drives feDisplacementMap through
 * `backdrop-filter: url(#liquid-lens)` — real refraction of the page pixels
 * under the disc, an organic fluid wobble (spec §3.7's approved fallback
 * recipe; Chromium only, see the probe below).
 *
 * Why not the primary radial lens map (feImage data-URI)? Verified broken in
 * Chromium 149: the feImage raster's geometry is baked at paint time, and
 * once the disc travels (composited transforms OR left/top layout moves under
 * this overlay) the bake goes stale — the barrel collapses into a uniform
 * 13px double-image smear. Rescue attempts (layout-driven travel,
 * transform-free ancestors, per-frame paint/structural invalidation) all
 * failed on the live page even though every recipe works on a static test
 * page. feTurbulence is GENERATED per evaluation — no resource bake — and
 * pixel-verified live: distinct, position-correct wobble during motion and
 * at every rest point. The blur below smooths the NOISE MAP, not the
 * backdrop — no fog, spec's ≤0.5px backdrop-blur rule untouched.
 */
const FILTER_ID = "liquid-lens";

/** Chromium renders SVG reference filters in backdrop-filter; Safari/Firefox
 * don't (today) and must keep the shipped brightness/saturate lens exactly. */
function probeRefraction(): boolean {
  return (
    typeof CSS !== "undefined" &&
    (CSS.supports("backdrop-filter", `url(#${FILTER_ID})`) ||
      CSS.supports("-webkit-backdrop-filter", `url(#${FILTER_ID})`))
  );
}

const GLINT = { stiffness: 200, damping: 24 };
const GLINT_REST = { x: -5, y: -5 }; // settles toward top-left, like lit glass

/** Glint offset: opposite the motion vector, blending back to the rest bias. */
function glintOffset(vx: number, vy: number, axis: "x" | "y"): number {
  const m = Math.hypot(vx, vy);
  const rest = GLINT_REST[axis];
  if (m === 0) return rest;
  const k = Math.min(m / 800, 1);
  const dir = (axis === "x" ? -vx : -vy) / m;
  return (1 - k) * rest + k * dir * 14;
}

export function LensCursor() {
  const { x, y, pressed, visible, target } = useCursor();
  // Probe once at mount. Lazy initializer, not set-state-in-effect: LensCursor
  // only mounts inside the active, client-gated provider, so CSS exists here.
  const [refract] = useState(probeRefraction);
  const sx = useSpring(x, LAZY);
  const sy = useSpring(y, LAZY);
  const opacity = useSpring(visible, { stiffness: 300, damping: 30 });
  const pressScale = useSpring(useTransform(pressed, [0, 1], [1, 0.92]), {
    stiffness: 400,
    damping: 30,
  });

  const kind = target?.kind;
  const hot = Boolean(kind);

  // Per-kind scale as a MotionValue (liquid branch): it joins the disc's
  // single composed transform, so no animate target ever shares a transform
  // with external MotionValues on one element.
  const kindScale = useMotionValue(1);
  useEffect(() => {
    const controls = animate(kindScale, scaleFor(kind), {
      duration: 0.25,
      ease: EASE,
    });
    return () => controls.stop();
  }, [kind, kindScale]);

  // Velocity → gentle elastic squash along the motion vector (ember's comet
  // technique, capped far lower — glass, not flame) + the glint's slide.
  const vx = useVelocity(sx);
  const vy = useVelocity(sy);
  const speed = useTransform(() => Math.hypot(vx.get(), vy.get()));
  const stretch = useSpring(
    useTransform(speed, (s) => 1 + Math.min(s / 6000, 0.12)),
    { stiffness: 200, damping: 24 }
  );
  const angle = useTransform(() => (Math.atan2(vy.get(), vx.get()) * 180) / Math.PI);
  // rotate(θ) · squash · rotate(−θ) aligns the stretch with the motion vector
  // while the disc's contents (fringe, highlight) stay upright — and the
  // sandwich is the identity at rest, so velocity-noise in θ can't jitter a
  // still disc. Press + kind + sandwich compose into ONE MotionValue string on
  // the disc itself: no animate/MotionValue mixing, no transformed wrappers
  // around the backdrop element.
  const discTransform = useTransform(() => {
    const a = angle.get();
    const st = stretch.get();
    const s = pressScale.get() * kindScale.get();
    return `rotate(${a}deg) scaleX(${st}) scaleY(${1 / st}) rotate(${-a}deg) scale(${s})`;
  });
  const glintX = useSpring(
    useTransform(() => glintOffset(vx.get(), vy.get(), "x")),
    GLINT
  );
  const glintY = useSpring(
    useTransform(() => glintOffset(vx.get(), vy.get(), "y")),
    GLINT
  );

  return (
    <>
      {refract ? (
        // ONE hidden filter host for the overlay. Kept at 0x0 (not
        // display:none — that would drop the filter reference).
        <svg aria-hidden width={0} height={0} style={{ position: "absolute" }}>
          <filter
            id={FILTER_ID}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="2"
              seed="7"
              result="n"
            />
            <feGaussianBlur in="n" stdDeviation="2" result="nb" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="nb"
              scale="48"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      ) : null}
      <motion.div className="absolute left-0 top-0" style={{ x: sx, y: sy, opacity }}>
        {refract ? (
          <>
            <motion.div
              className="relative rounded-full"
              style={{
                width: BASE,
                height: BASE,
                marginLeft: -BASE / 2,
                marginTop: -BASE / 2,
                transform: discTransform,
                border: "1px solid var(--edge)",
                boxShadow:
                  "inset 0 1px 0 var(--edge), 0 4px 24px oklch(0 0 0 / 0.06)",
                // Real refraction + a light lift. Inline styles bypass
                // Lightning CSS, so both twins survive. No backdrop blur:
                // the page bends, it never fogs.
                WebkitBackdropFilter: hot
                  ? `url(#${FILTER_ID}) brightness(1.12) saturate(1.06)`
                  : `url(#${FILTER_ID}) brightness(1.06) saturate(1.05)`,
                backdropFilter: hot
                  ? `url(#${FILTER_ID}) brightness(1.12) saturate(1.06)`
                  : `url(#${FILTER_ID}) brightness(1.06) saturate(1.05)`,
              }}
            >
              {/* chromatic fringe — the rim refracts HER light (hero palette),
                  not a generic RGB split. Masked to the outer ~15%;
                  soft-light keeps text contrast intact. */}
              <div
                aria-hidden
                className="lens-fringe pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(var(--hf-blush), var(--hf-champagne), var(--hf-turquoise), var(--hf-blush))",
                  WebkitMaskImage:
                    "radial-gradient(closest-side, transparent 82%, #000 97%)",
                  maskImage:
                    "radial-gradient(closest-side, transparent 82%, #000 97%)",
                  mixBlendMode: "soft-light",
                  opacity: 0.3,
                }}
              />
            </motion.div>
            {/* specular glint — its own layer (no backdrop filter, transforms
                are safe here); the holder mirrors the disc's kind scale so the
                glint travels with the disc's size. */}
            <motion.div className="absolute left-0 top-0" style={{ scale: kindScale }}>
              <motion.div
                className="pointer-events-none absolute rounded-full"
                style={{
                  width: 10,
                  height: 10,
                  left: -5,
                  top: -5,
                  x: glintX,
                  y: glintY,
                  background: "oklch(1 0 0 / 0.9)",
                  filter: "blur(4px)",
                  opacity: 0.5,
                }}
              />
            </motion.div>
          </>
        ) : (
          /* No SVG-reference backdrop-filter support: the lens exactly as
             shipped — brighten, never blur, text stays legible. Press squeeze
             on its own wrapper — never mix an external MotionValue and an
             animate target for the same transform on one element. */
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
        )}
      </motion.div>
      <CursorLabel />
    </>
  );
}

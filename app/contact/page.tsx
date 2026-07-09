'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import Reveal from '@/components/Reveal';

const EMAIL = 'sanyamunam95@gmail.com';

/* Typographic shortcuts — each opens a pre-addressed email. */
const OPENERS = [
  { label: 'A project brief', token: 'turquoise' },
  { label: 'A UX audit', token: 'orchid' },
  { label: 'A talk or a workshop', token: 'sienna' },
  { label: 'Unreasonably good design', token: 'wine' },
];

/* Same fractal noise as the site grain — here it plays the undeveloped
   emulsion that clears as the print develops. */
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function SpreadLine({ text }: { text: string }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <span key={i} style={{ display: 'inline-block' }}>
          {ch}
        </span>
      ))}
    </>
  );
}

export default function Contact() {
  const reduced = useReducedMotion() ?? false;
  const stageRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  });

  /* ——— the development sequence, driven by scroll ——— */
  const safelight = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const developedLight = useTransform(scrollYProgress, [0.35, 0.75], [0, 1]);
  const emulsion = useTransform(scrollYProgress, [0, 0.55], [0.4, 0]);
  const letsOpacity = useTransform(scrollYProgress, [0.05, 0.5], [0.35, 1]);
  const talkOpacity = useTransform(scrollYProgress, [0.1, 0.62], [0.08, 1]);
  const typeScale = useTransform(scrollYProgress, [0, 0.6], [0.97, 1]);
  const stage1 = useTransform(scrollYProgress, [0, 0.26, 0.34], [1, 1, 0]);
  const stage2 = useTransform(
    scrollYProgress,
    [0.34, 0.42, 0.6, 0.68],
    [0, 1, 1, 0],
  );
  const stage3 = useTransform(scrollYProgress, [0.68, 0.76], [0, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [0.66, 0.82], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.66, 0.82], [36, 0]);

  const typeSize = 'clamp(4rem, 17vw, 15.5rem)';

  return (
    <>
      {/* ——— THE LAST PRINT — a photograph developing on scroll ———
           280vh scroll stage, 100svh sticky frame. The page begins under
           the darkroom safelight; scrolling develops the print until the
           invitation is fixed. */}
      <section ref={stageRef} style={{ height: '280vh', position: 'relative' }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100svh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* safelight — the red lamp before anything develops */}
          <motion.div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              opacity: reduced ? 0 : safelight,
              background: `
                radial-gradient(70% 60% at 72% 18%, color-mix(in srgb, var(--wine) calc(26% * var(--wash-boost, 1)), transparent) 0%, transparent 65%),
                radial-gradient(50% 45% at 12% 82%, color-mix(in srgb, var(--wine) calc(14% * var(--wash-boost, 1)), transparent) 0%, transparent 60%)`,
            }}
          />

          {/* developed light — the full palette blooms in */}
          <motion.div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              opacity: reduced ? 1 : developedLight,
              background: `
                radial-gradient(60% 50% at 78% 16%, color-mix(in srgb, var(--orchid) calc(14% * var(--wash-boost, 1)), transparent) 0%, transparent 62%),
                radial-gradient(55% 48% at 10% 72%, color-mix(in srgb, var(--turquoise) calc(11% * var(--wash-boost, 1)), transparent) 0%, transparent 62%)`,
            }}
          />

          {/* undeveloped emulsion — heavy grain that clears */}
          <motion.div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              opacity: reduced ? 0 : emulsion,
              backgroundImage: NOISE,
            }}
          />

          {/* top row — kicker + darkroom stage timer */}
          <div
            style={{
              padding: 'clamp(96px, 13vh, 150px) var(--gutter) 0',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 24,
              position: 'relative',
            }}
          >
            <Reveal>
              <p className="caption">Sanya Munam — Correspondence</p>
            </Reveal>
            <div style={{ position: 'relative', minWidth: 180 }}>
              <motion.p
                className="caption"
                style={{
                  opacity: reduced ? 0 : stage1,
                  position: 'absolute',
                  right: 0,
                  whiteSpace: 'nowrap',
                  color: 'var(--muted)',
                }}
              >
                Stage 01 — Exposing
              </motion.p>
              <motion.p
                className="caption"
                style={{
                  opacity: reduced ? 0 : stage2,
                  position: 'absolute',
                  right: 0,
                  whiteSpace: 'nowrap',
                  color: 'var(--muted)',
                }}
              >
                Stage 02 — Developing
              </motion.p>
              <motion.p
                className="caption"
                style={{
                  opacity: reduced ? 1 : stage3,
                  position: 'absolute',
                  right: 0,
                  whiteSpace: 'nowrap',
                  color: 'var(--orchid)',
                }}
              >
                Stage 03 — Fixed. Your move.
              </motion.p>
            </div>
          </div>

          {/* the invitation — fades in as the print fixes */}
          <motion.div
            style={{
              opacity: reduced ? 1 : ctaOpacity,
              y: reduced ? 0 : ctaY,
              alignSelf: 'flex-end',
              padding: '0 var(--gutter)',
              maxWidth: '40ch',
              position: 'relative',
            }}
          >
            <p className="body-lg" style={{ marginBottom: 20, textWrap: 'balance' }}>
              Always up for a conversation about UX and unreasonably good
              design.
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="cta"
              data-cursor-label="Write to Sanya"
              style={{ color: 'var(--turquoise)' }}
            >
              Say hello ↗
            </a>
            <p className="caption" style={{ marginTop: 18, color: 'var(--muted)' }}>
              Doha, Qatar · GMT+3 · First reply within a day
            </p>
          </motion.div>

          {/* the monumental type — ghost to ink */}
          <motion.h1
            aria-label="Let's talk"
            style={{
              padding: '0 8px 2px',
              scale: reduced ? 1 : typeScale,
              transformOrigin: 'bottom left',
              position: 'relative',
            }}
          >
            <motion.span
              className="display"
              aria-hidden
              style={{
                opacity: reduced ? 1 : letsOpacity,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: typeSize,
                lineHeight: 0.85,
                color: 'transparent',
                WebkitTextStroke: '1.5px var(--bone)',
              }}
            >
              <SpreadLine text="LET&#8217;S" />
            </motion.span>
            <motion.span
              className="display"
              aria-hidden
              style={{
                opacity: reduced ? 1 : talkOpacity,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: typeSize,
                lineHeight: 0.85,
                color: 'var(--orchid)',
              }}
            >
              <SpreadLine text="TALK" />
            </motion.span>
          </motion.h1>
        </div>
      </section>

      {/* ——— P.S. — typographic shortcuts, no blank page ——— */}
      <section
        className="hairline-top"
        style={{
          padding: 'clamp(44px, 6vw, 80px) var(--gutter)',
        }}
      >
        <Reveal>
          <p className="caption" style={{ color: 'var(--muted)', marginBottom: 18 }}>
            P.S. — Know what it&#8217;s about? Skip the blank page:
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 32px' }}>
            {OPENERS.map((o) => (
              <a
                key={o.label}
                href={`mailto:${EMAIL}?subject=${encodeURIComponent(o.label)}`}
                className="caption link-line"
                data-cursor-label="Write this"
                style={{ color: `var(--${o.token})` }}
              >
                {o.label} ↗
              </a>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}

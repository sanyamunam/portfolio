'use client';

import {
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion';
import Reveal from './Reveal';

const EMAIL = 'sanyamunam95@gmail.com';

/* The closing mark — the name as a blind emboss on the darkroom wall.
   Nearly invisible at rest; run the cursor over it and a wave of light
   travels through the letters, then the room goes quiet again. */
function GhostName() {
  const reduced = useReducedMotion() ?? false;
  const wave = useAnimationControls();
  const letters = 'SANYA MUNAM'.split('');

  const ripple = () => {
    if (reduced) return;
    wave.start((i: number) => ({
      y: ['0%', '14%', '0%'],
      opacity: [0.26, 1, 0.26],
      transition: { duration: 0.7, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] },
    }));
  };

  return (
    <div
      aria-hidden
      onMouseEnter={ripple}
      style={{
        margin: 'clamp(48px, 7vw, 104px) calc(8px - var(--gutter)) 0',
        userSelect: 'none',
      }}
    >
      <span
        className="display"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 'clamp(2.3rem, 11.5vw, 10.5rem)',
          lineHeight: 0.9,
          color: 'color-mix(in srgb, var(--bone) 30%, transparent)',
        }}
      >
        {letters.map((ch, i) =>
          ch === ' ' ? (
            <span key={i} style={{ width: '0.28em' }} />
          ) : (
            <motion.span
              key={i}
              custom={i}
              animate={wave}
              style={{ display: 'inline-block', opacity: 0.26 }}
            >
              {ch}
            </motion.span>
          ),
        )}
      </span>
    </div>
  );
}

const SKILLS = [
  'UX Strategy',
  'Benchmarking',
  'User Interviews',
  'Persona Mapping',
  'Google Analytics',
  'Hotjar Analysis',
  'Wireframing',
  'Client Pitches',
  'Design Direction',
  'Stakeholder Alignment',
  'Design Operations',
  'Team Leadership',
];

export default function Footer() {
  return (
    <footer className="surface-footer" style={{ position: 'relative' }}>
      {/* running marquee strip */}
      <div
        className="marquee hairline-top"
        style={{ padding: '14px 0', borderBottom: '1px solid var(--line)' }}
        aria-hidden
      >
        {[0, 1].map((i) => (
          <div key={i} className="marquee-inner" style={{ alignItems: 'center' }}>
            {SKILLS.map((s, j) => {
              const editorial = j % 2 === 1;
              return (
                <span
                  key={s}
                  style={{
                    padding: '0 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 24,
                  }}
                >
                  <span
                    className={editorial ? 'display' : 'caption'}
                    style={
                      editorial
                        ? {
                            fontSize: 16,
                            textTransform: 'none',
                            lineHeight: 1,
                            color: 'var(--bone)',
                          }
                        : { color: 'var(--muted)' }
                    }
                  >
                    {s}
                  </span>
                  <span aria-hidden style={{ color: 'var(--muted)', fontSize: 10 }}>
                    ✺
                  </span>
                </span>
              );
            })}
          </div>
        ))}
      </div>

      <div
        className="section"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
          paddingTop: 'clamp(72px, 10vw, 140px)',
          paddingBottom: 'clamp(40px, 6vw, 80px)',
          textAlign: 'center',
        }}
      >
        {/* Shelby section anchor — quiet callout */}
        <Reveal>
          <p
            className="display"
            style={{ fontSize: 'var(--text-heading)', color: 'var(--muted)' }}
          >
            Contact
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <p
            className="display"
            style={{
              fontSize: 'clamp(1.6rem, 4.5vw, 3.4rem)',
              textTransform: 'none',
              maxWidth: '26ch',
              lineHeight: 1.08,
              textWrap: 'balance',
            }}
          >
            Always up for a conversation about UX and unreasonably good design.
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <a
            href={`mailto:${EMAIL}`}
            className="cta"
            data-cursor-label="Write to Sanya"
            style={{ color: 'var(--turquoise)', marginTop: 8 }}
          >
            Say hello ↗
          </a>
        </Reveal>

        <Reveal delay={0.18}>
          <span className="caption" style={{ color: 'var(--muted)' }}>
            Doha, Qatar — GMT+3
          </span>
        </Reveal>

        {/* the blind-embossed name — hover to send light through it */}
        <Reveal delay={0.2} style={{ width: '100%' }}>
          <GhostName />
        </Reveal>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginTop: 'clamp(28px, 4vw, 56px)',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <span className="caption">©2026 Sanya Munam — All rights reserved</span>

          {/* the maker's stamp — handmade, and proud of it */}
          <div
            className="stamp caption"
            data-cursor
            data-cursor-label="100% handmade"
          >
            <span className="stamp-mark" aria-hidden>✺</span>
            <span>Designed & hand-coded by Sanya Munam — no template in sight</span>
            <span className="stamp-mark" aria-hidden>✺</span>
          </div>

          <span className="caption" style={{ color: 'var(--muted)' }}>
            Built from scratch with Next.js
          </span>
        </div>
      </div>
    </footer>
  );
}

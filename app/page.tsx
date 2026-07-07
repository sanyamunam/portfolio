'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Wordmark from '@/components/Wordmark';
import Reveal from '@/components/Reveal';
import { projects } from '@/lib/projects';
import { withBase } from '@/lib/site';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const wordmarkY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const atmosphereOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <>
      {/* ——— HERO ————————————————————————————— */}
      <section
        ref={heroRef}
        style={{
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          overflow: 'hidden',
          padding: '0 0 4px',
        }}
      >
        {/* atmosphere — the darkroom's version of botanical photography */}
        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            opacity: atmosphereOpacity,
            background: `
              radial-gradient(60% 50% at 78% 18%, rgba(157,107,128,0.16) 0%, transparent 60%),
              radial-gradient(50% 45% at 12% 68%, rgba(153,225,217,0.10) 0%, transparent 60%),
              radial-gradient(45% 40% at 55% 95%, rgba(229,189,223,0.08) 0%, transparent 55%)`,
          }}
        />

        {/* rotated side label — running header */}
        <div
          aria-hidden
          className="display side-label"
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-62%)',
            writingMode: 'vertical-rl',
            fontSize: 'clamp(2.6rem, 7vw, 6.5rem)',
            color: 'var(--bone)',
            opacity: 0.14,
            lineHeight: 0.9,
            userSelect: 'none',
          }}
        >
          UX LEAD
        </div>

        {/* hero subtitle — author's bio on a book jacket */}
        <div
          style={{
            padding: '0 var(--gutter)',
            marginBottom: 'clamp(20px, 3vw, 40px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ maxWidth: '44ch' }}
          >
            <p className="caption" style={{ marginBottom: 12, lineHeight: 1.9 }}>
              Sanya Munam — UX Lead & Project Manager
              <br />
              Doha, Qatar
            </p>
            <p className="body-lg" style={{ color: 'var(--bone)' }}>
              I shape UX strategy and design direction for products that feel
              effortless.
            </p>
          </motion.div>
          <motion.span
            className="caption"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            Scroll — Selected work ↓
          </motion.span>
        </div>

        {/* the wordmark — edge to edge, brand-defining */}
        <motion.div style={{ y: wordmarkY, padding: '0 8px' }}>
          <Wordmark text="SANYA" />
        </motion.div>
      </section>

      {/* ——— SELECTED WORK — editorial index —————————— */}
      <section
        className="section"
        style={{
          background: `
            radial-gradient(55% 40% at 85% 0%, rgba(157,107,128,0.10) 0%, transparent 60%),
            var(--jet-wine)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 'clamp(36px, 5vw, 64px)',
          }}
        >
          <Reveal>
            <h2 className="display" style={{ fontSize: 'var(--text-display)' }}>
              Selected work
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/work" className="caption link-line" data-cursor-label="All work">
              Full index →
            </Link>
          </Reveal>
        </div>

        <div>
          {projects.map((p, i) => {
            const row = (
              <motion.div
                className="hairline-top"
                whileHover={p.disabled ? undefined : 'hover'}
                initial="rest"
                animate="rest"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'clamp(40px, 6vw, 80px) 1fr auto auto',
                  gap: 'clamp(12px, 3vw, 40px)',
                  alignItems: 'center',
                  padding: 'clamp(20px, 3.5vw, 40px) 0',
                  position: 'relative',
                  opacity: p.disabled ? 0.45 : 1,
                }}
              >
                <span className="caption" style={{ color: 'var(--muted)' }}>
                  {p.index}
                </span>

                <div style={{ minWidth: 0 }}>
                  <motion.h3
                    className="display"
                    variants={{ rest: { x: 0 }, hover: { x: 16 } }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    style={{
                      fontSize: 'clamp(1.6rem, 4.2vw, 3.4rem)',
                      color: 'var(--bone)',
                      textTransform: 'none',
                    }}
                  >
                    {p.client}
                  </motion.h3>
                  <span className="caption" style={{ color: 'var(--muted)' }}>
                    {p.disabled ? 'Case study in progress — content on its way' : p.title}
                  </span>
                </div>

                {/* specimen swatch — ink chip */}
                <motion.span
                  aria-hidden
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.6, rotate: 45 } }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  style={{
                    width: 14,
                    height: 14,
                    background: p.specimen.hex,
                    display: 'inline-block',
                  }}
                />

                <span className="caption">{p.year}</span>
              </motion.div>
            );

            return (
              <Reveal key={p.slug} delay={i * 0.06}>
                {p.disabled ? (
                  row
                ) : (
                  <Link href={`/work/${p.slug}`} data-cursor-label="Open case">
                    {row}
                  </Link>
                )}
              </Reveal>
            );
          })}
          <div className="hairline-top" />
        </div>
      </section>

      {/* ——— PROFILE TEASER ————————————————————— */}
      <section
        className="section"
        style={{
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))',
          gap: 'clamp(40px, 6vw, 96px)',
          alignItems: 'center',
        }}
      >
        <div>
          <Reveal>
            <p className="caption" style={{ marginBottom: 24 }}>Profile</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p
              className="display"
              style={{
                fontSize: 'clamp(1.8rem, 3.6vw, 3.4rem)',
                textTransform: 'none',
                maxWidth: '22ch',
                lineHeight: 1.05,
              }}
            >
              Curiosity is my operating system — a workshop, my dad’s thumb on
              Google Pay, and a 600-page biography made sure of it.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <Link
              href="/about"
              className="caption link-line"
              data-cursor-label="Read story"
              style={{ display: 'inline-block', marginTop: 32, color: 'var(--turquoise)' }}
            >
              Read the story →
            </Link>
          </Reveal>
        </div>

        {/* figure plate — the ink self-portrait, archived like everything else */}
        <Reveal delay={0.12}>
          <Link href="/about" data-cursor-label="Read story" aria-label="About Sanya">
            <div
              className="glass"
              style={{
                padding: 'clamp(24px, 3.5vw, 48px)',
                background: 'rgba(153, 225, 217, 0.04)',
                borderColor: 'rgba(153, 225, 217, 0.18)',
              }}
            >
              <div
                className="ink-illustration"
                style={{
                  color: 'var(--turquoise)',
                  WebkitMask: `url(${withBase('/illustration.svg')}) center / contain no-repeat`,
                  mask: `url(${withBase('/illustration.svg')}) center / contain no-repeat`,
                }}
              />
              <p
                className="caption"
                style={{
                  marginTop: 20,
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <span>Fig. 00 — Self-portrait in ink</span>
                <span style={{ color: 'var(--muted)' }}>About Sanya</span>
              </p>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* ——— CAPABILITIES — how I work ——————————————
           Deliberately unlike the work index: deepest surface,
           centered anchor, and column rules instead of rows. */}
      <section
        className="section"
        style={{
          background: `
            radial-gradient(55% 60% at 50% 0%, rgba(153,225,217,0.07) 0%, transparent 65%),
            radial-gradient(40% 45% at 85% 100%, rgba(229,189,223,0.05) 0%, transparent 60%),
            var(--jet-3)`,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'clamp(44px, 6vw, 88px)' }}>
          <Reveal>
            <p className="caption" style={{ color: 'var(--muted)', marginBottom: 14 }}>
              Strategy · Direction · Leadership
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              className="display"
              style={{ fontSize: 'var(--text-heading)', color: 'var(--bone)' }}
            >
              How I work
            </h2>
          </Reveal>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: 'clamp(36px, 5vw, 72px)',
            alignItems: 'start',
          }}
        >
          {[
            {
              label: 'The groundwork',
              accent: 'var(--turquoise)',
              lead: 'Research that earns the right to design.',
              text: 'Benchmarking the best national and international players, reading real behaviour through Google Analytics and Hotjar, sitting down with users, and mapping personas until the audience stops being an abstraction.',
            },
            {
              label: 'The direction',
              accent: 'var(--orchid)',
              lead: 'Strategy that survives the client room.',
              text: 'UX strategy, wireframes and concept pitches built to align high-stakes stakeholders — and to win genuine enthusiasm, not just sign-off.',
            },
            {
              label: 'The leadership',
              accent: 'var(--sienna)',
              lead: 'Teams that ship.',
              text: 'Running design operations for a studio of 25+ designers and leading a team of UX specialists — carrying products from first sketch to go-live.',
            },
          ].map((a, i) => (
            <Reveal key={a.label} delay={i * 0.08}>
              <div
                style={{
                  borderLeft: '1px solid var(--line)',
                  paddingLeft: 'clamp(18px, 2.5vw, 30px)',
                  display: 'grid',
                  gap: 16,
                }}
              >
                <span
                  className="display"
                  style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', color: a.accent }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="caption" style={{ color: 'var(--muted)' }}>{a.label}</p>
                <h3
                  className="display"
                  style={{
                    fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)',
                    textTransform: 'none',
                    lineHeight: 1.1,
                    color: 'var(--bone)',
                    maxWidth: '18ch',
                  }}
                >
                  {a.lead}
                </h3>
                <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--muted)' }}>
                  {a.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

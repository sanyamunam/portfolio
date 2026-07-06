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
          className="display"
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
            <p className="caption" style={{ marginBottom: 12 }}>
              Sanya Munam — UX Lead · Doha, Qatar
            </p>
            <p className="body-lg" style={{ color: 'var(--bone)' }}>
              I shape UX strategy and design direction for products that
              disappear into people’s lives.
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
      <section className="section" style={{ background: 'var(--jet-2)' }}>
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
              GPay, and a 600-page biography made sure of it.
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

        {/* what I actually do — craft and leadership, type only */}
        <div
          className="hairline-top"
          style={{
            gridColumn: '1 / -1',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: 'clamp(32px, 5vw, 80px)',
            paddingTop: 'clamp(28px, 4vw, 48px)',
          }}
        >
          <Reveal>
            <p className="caption" style={{ color: 'var(--turquoise)', marginBottom: 20 }}>
              The craft
            </p>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 10 }}>
              {[
                'UX Strategy',
                'Benchmarking',
                'User Interviews',
                'Persona Mapping',
                'Wireframing',
                'Client Pitches',
                'Design Direction',
              ].map((s) => (
                <li key={s} style={{ fontWeight: 500, color: 'var(--bone)' }}>
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="caption" style={{ color: 'var(--turquoise)', marginBottom: 20 }}>
              The leadership
            </p>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 14 }}>
              {[
                'Running design operations for a 25+ designer team',
                'Leading a team of UX specialists',
                'Aligning stakeholders at every altitude',
                'Carrying products from design to go-live',
              ].map((s) => (
                <li
                  key={s}
                  style={{ fontWeight: 500, color: 'var(--bone)', maxWidth: '40ch' }}
                >
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}

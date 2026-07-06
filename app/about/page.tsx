'use client';

import Wordmark from '@/components/Wordmark';
import Reveal from '@/components/Reveal';
import { withBase } from '@/lib/site';

const sparks = [
  {
    index: '01',
    title: 'The workshop',
    color: 'var(--wine)',
    text: 'A one-day design thinking workshop at Broadcom — my first company — was supposed to be a box to tick. Instead, I watched a room full of strangers argue passionately about the placement of a single button — and realised that behind every screen is a hundred deliberate decisions. I wanted to be the one making them.',
    artifact: {
      src: '/sparks/broadcom.svg',
      alt: 'Broadcom logo',
      caption: 'Where it started',
      fit: 'logo' as const,
    },
  },
  {
    index: '02',
    title: 'Dad & GPay',
    color: 'var(--turquoise)',
    text: 'My father — a man who once asked me to "open the Google" — sent money on GPay on his first try. No manual, no fear, no phone call to me. I sat there quietly amazed. Great design doesn’t teach people technology; it makes technology irrelevant. That’s the standard I hold every product to.',
    artifact: {
      src: '/sparks/gpay.svg',
      alt: 'Google Pay logo',
      caption: 'Dad-approved UX',
      fit: 'logo' as const,
    },
  },
  {
    index: '03',
    title: 'The biography',
    color: 'var(--orchid)',
    text: 'Walter Isaacson’s Steve Jobs kept me up for a week. Not the genius mythology — the obsession. Fonts on a dropout’s calligraphy bench becoming the Mac’s typography. The idea that taste is a discipline, that technology alone is not enough — it has to marry the liberal arts. I never unread that.',
    artifact: {
      src: '/sparks/jobs-book.jpg',
      alt: 'Steve Jobs by Walter Isaacson — book cover',
      caption: '600 pages, one week',
      fit: 'cover' as const,
    },
  },
];

const capabilities = [
  'UX Strategy',
  'Benchmarking',
  'User Interviews',
  'Persona Mapping',
  'Google Analytics',
  'Hotjar Analysis',
  'Wireframing',
  'Client Pitches',
  'Design Direction',
  'Design Operations',
  'Team Leadership',
];

export default function About() {
  return (
    <>
      {/* ——— header ————————————————————————— */}
      <section
        style={{
          paddingTop: 'clamp(120px, 18vh, 200px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '0 var(--gutter)', marginBottom: 16 }}>
          <Reveal>
            <p className="caption">Profile — Doha, Qatar</p>
          </Reveal>
        </div>
        <div style={{ padding: '0 8px' }}>
          <Wordmark text="CURIOUS" color="var(--bone)" delay={0.2} />
        </div>
      </section>

      {/* ——— the ink figure + intro ——————————————— */}
      <section
        className="section"
        style={{
          background: 'var(--jet-2)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(40px, 6vw, 96px)',
          alignItems: 'center',
        }}
      >
        <Reveal>
          {/* recolored ink illustration — the portrait moment */}
          <div
            className="glass"
            style={{
              padding: 'clamp(24px, 4vw, 56px)',
              background: 'rgba(157, 107, 128, 0.07)',
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
            <p className="caption" style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
              <span>Fig. 01 — The designer at work</span>
              <span style={{ color: 'var(--muted)' }}>Ink on jet</span>
            </p>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="body-lg" style={{ marginBottom: 24 }}>
              I’m Sanya Munam — a UX Lead based in Doha. For the past several
              years I’ve shaped UX strategy and design direction for sports
              federations, cultural institutions and universities across Qatar.
            </p>
          </Reveal>

          {/* the road here — colophon-style biography rows */}
          <Reveal delay={0.08}>
            <div
              className="hairline-top"
              style={{ display: 'grid', gap: 10, padding: '18px 0 22px' }}
            >
              {[
                ['Raised in', 'India'],
                ['Studied', 'Computer Science Engineering'],
                ['First role', 'R&D Engineer — Broadcom'],
                ['Then', 'Curiosity won. UX ever since.'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 20 }}>
                  <span className="caption" style={{ width: 84, flexShrink: 0, paddingTop: 2 }}>
                    {k}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--bone)' }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <p style={{ color: 'var(--muted)', maxWidth: '52ch', marginBottom: 18 }}>
              Engineering taught me how products are built — but design kept
              stealing my attention. Google Pay making money movement
              invisible. Myntra making a thousand choices feel effortless. I
              crossed over to UX out of sheer curiosity about experiences like
              those, and never looked back. Three moments made the decision
              for me — they’re just below.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p
              className="caption"
              style={{ color: 'var(--muted)', marginBottom: 24, lineHeight: 1.8 }}
            >
              Off the clock — deep in Awwwards, Medium and Muzli, collecting
              other people’s good decisions.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {capabilities.map((c) => (
                <span
                  key={c}
                  className="caption glass"
                  style={{ padding: '8px 14px', color: 'var(--bone)' }}
                >
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— three sparks ————————————————————— */}
      <section className="section">
        <Reveal>
          <h2
            className="display"
            style={{ fontSize: 'var(--text-display)', marginBottom: 'clamp(40px, 6vw, 80px)' }}
          >
            Three sparks
          </h2>
        </Reveal>

        <div style={{ display: 'grid', gap: 'clamp(32px, 5vw, 56px)' }}>
          {sparks.map((s, i) => (
            <Reveal key={s.index} delay={i * 0.08}>
              <article
                className="hairline-top spark-row"
                style={{
                  paddingTop: 'clamp(24px, 4vw, 48px)',
                  /* alternating editorial indent */
                  marginLeft: i === 1 ? 'clamp(0px, 8vw, 160px)' : 0,
                  marginRight: i === 2 ? 'clamp(0px, 8vw, 160px)' : 0,
                }}
              >
                <span
                  className="display"
                  style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', color: s.color }}
                >
                  {s.index}
                </span>
                <div>
                  <h3
                    className="display"
                    style={{
                      fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
                      textTransform: 'none',
                      marginBottom: 16,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p style={{ color: 'var(--muted)', maxWidth: '58ch', lineHeight: 1.7 }}>
                    {s.text}
                  </p>
                </div>

                {/* the artifact — the actual object that lit the spark */}
                <figure className="spark-artifact">
                  <div className="spark-plate">
                    <img
                      src={withBase(s.artifact.src)}
                      alt={s.artifact.alt}
                      loading="lazy"
                      style={
                        s.artifact.fit === 'cover'
                          ? { height: '100%', width: 'auto', display: 'block' }
                          : { width: '80%', maxHeight: 52, objectFit: 'contain' }
                      }
                    />
                  </div>
                  <figcaption
                    className="caption"
                    style={{ marginTop: 10, color: 'var(--muted)', textAlign: 'center' }}
                  >
                    {s.artifact.caption}
                  </figcaption>
                </figure>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

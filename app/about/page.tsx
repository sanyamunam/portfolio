'use client';

import Wordmark from '@/components/Wordmark';
import Reveal from '@/components/Reveal';
import { withBase } from '@/lib/site';

const sparks = [
  {
    index: '01',
    title: 'The workshop',
    color: 'var(--wine)',
    text: 'A two-week design thinking workshop at Broadcom — my first company — changed what I thought actually matters when building products: users, and the problems they need solving. Coming from an engineering background, I never saw it coming. That workshop was my foothold into the world of UX.',
    artifact: {
      src: '/sparks/broadcom.svg',
      alt: 'Broadcom logo',
      caption: 'Where it started',
      fit: 'logo' as const,
    },
  },
  {
    index: '02',
    title: 'Dad & Google Pay',
    color: 'var(--turquoise)',
    text: 'My father — a man who once asked me to "open the Google" — sent money on Google Pay on his first try. No manual, no fear, no phone call to me. I sat there quietly amazed. Great design doesn’t teach people technology; it makes technology irrelevant. That’s the standard I hold every product to.',
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
    text: 'Walter Isaacson’s Steve Jobs kept me up for two weeks. Not the genius mythology — the obsession. Fonts on a dropout’s calligraphy bench becoming the Mac’s typography. The idea that taste is a discipline, that technology alone is not enough — it has to marry the liberal arts. I never unread that.',
    artifact: {
      src: '/sparks/jobs-book.jpg',
      alt: 'Steve Jobs by Walter Isaacson — book cover',
      caption: '600 pages, two weeks',
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
              background: 'color-mix(in srgb, var(--wine) 7%, transparent)',
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
              I’m Sanya Munam — a UX Lead and Project Manager based in Doha
              with 7+ years of experience, shaping UX strategy, design
              direction and delivery for government, private and enterprise
              institutions across Qatar and Kuwait.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <p style={{ color: 'var(--muted)', maxWidth: '52ch', marginBottom: 24 }}>
              I didn’t arrive at UX through a job posting. I arrived through
              curiosity — three moments, spread across a few unremarkable
              months, that quietly rewired what I wanted to do with my life.
              They still shape how I work: observe closely, respect people’s
              time, and sweat the details nobody will ever consciously notice.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
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

      {/* ——— the basics — a slim colophon band ——————————— */}
      <section
        style={{
          padding: 'clamp(36px, 5vw, 64px) var(--gutter)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <Reveal>
          <p className="caption" style={{ color: 'var(--turquoise)', marginBottom: 28 }}>
            The basics
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(210px, 100%), 1fr))',
              gap: 'clamp(20px, 3vw, 40px)',
            }}
          >
            {[
              { label: 'Raised in', value: 'India' },
              { label: 'Studied', value: 'Computer Science Engineering' },
              {
                label: 'First role',
                value: 'R&D Engineer — Broadcom',
                href: 'https://www.broadcom.com',
              },
              {
                label: 'Now',
                value: 'Leading UX at Applab, Doha',
                href: 'https://applab.qa',
              },
            ].map((row) => (
              <div key={row.label}>
                <p className="caption" style={{ color: 'var(--muted)', marginBottom: 8 }}>
                  {row.label}
                </p>
                {row.href ? (
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-line"
                    data-cursor-label="Visit"
                    style={{ fontWeight: 600, fontSize: 15, color: 'var(--bone)' }}
                  >
                    {row.value} ↗
                  </a>
                ) : (
                  <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--bone)' }}>
                    {row.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* things that keep me curious */}
        <Reveal delay={0.12}>
          <div
            className="hairline-top"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 14,
              marginTop: 'clamp(24px, 3.5vw, 40px)',
              paddingTop: 'clamp(18px, 2.5vw, 28px)',
            }}
          >
            <span className="caption" style={{ color: 'var(--muted)' }}>
              Product crushes — Google Pay & Myntra, for making hard things effortless
            </span>
            <a
              href="https://www.youtube.com/watch?v=MnrJzXM7a6o&t=463s"
              target="_blank"
              rel="noopener noreferrer"
              className="caption link-line"
              data-cursor-label="Watch keynote"
              style={{ color: 'var(--turquoise)' }}
            >
              On repeat — Steve Jobs’ 2007 iPhone launch, a masterclass in
              product & presentation ↗
            </a>
            <span className="caption" style={{ color: 'var(--muted)' }}>
              Off the clock — Awwwards, Medium, Muzli
            </span>
          </div>
        </Reveal>
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

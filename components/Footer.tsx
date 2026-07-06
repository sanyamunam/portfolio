'use client';

import Reveal from './Reveal';

const EMAIL = 'sanyamunam95@gmail.com';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--jet-3)', position: 'relative' }}>
      {/* running marquee strip */}
      <div
        className="marquee hairline-top"
        style={{ padding: '14px 0', borderBottom: '1px solid var(--line)' }}
        aria-hidden
      >
        {[0, 1].map((i) => (
          <div key={i} className="marquee-inner">
            {Array.from({ length: 6 }).map((_, j) => (
              <span
                key={j}
                className="caption"
                style={{ padding: '0 28px', color: 'var(--muted)' }}
              >
                Sanya Munam — UX Lead ✺ Doha, Qatar ✺ Curiosity as an operating system ✺
              </span>
            ))}
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
              maxWidth: '18ch',
              lineHeight: 1.05,
            }}
          >
            Have a product that should disappear into people’s lives?
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

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 'clamp(48px, 7vw, 100px)',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <span className="caption">©2026 Sanya Munam — All rights reserved</span>
          <span className="caption" style={{ color: 'var(--muted)' }}>
            Designed & hand-coded by Sanya Munam. No template in sight.
          </span>
        </div>
      </div>
    </footer>
  );
}

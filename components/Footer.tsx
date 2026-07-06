'use client';

import Reveal from './Reveal';

const EMAIL = 'sanyamunam95@gmail.com';

const SKILLS = [
  'UX Strategy',
  'Benchmarking',
  'User Interviews',
  'Persona Mapping',
  'Wireframing',
  'Client Pitches',
  'Design Direction',
  'Stakeholder Alignment',
  'Design Operations',
  'Team Leadership',
];

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
          <div key={i} className="marquee-inner" style={{ alignItems: 'center' }}>
            {SKILLS.map((s, j) => {
              const accents = ['var(--turquoise)', 'var(--orchid)', 'var(--sienna)'];
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
                            color: accents[Math.floor(j / 2) % accents.length],
                          }
                        : { color: 'var(--bone)' }
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

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginTop: 'clamp(48px, 7vw, 96px)',
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

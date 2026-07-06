'use client';

import Link from 'next/link';
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
                UX Lead — Doha, Qatar ✺ Curiosity as an operating system ✺
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
          <a
            href={`mailto:${EMAIL}`}
            className="display link-line"
            data-cursor-label="Say hi"
            style={{
              fontSize: 'clamp(1.4rem, 4.5vw, 3.6rem)',
              color: 'var(--bone)',
              textTransform: 'lowercase',
            }}
          >
            {EMAIL}
          </a>
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
          <span className="caption">©2026 Sanya — All rights reserved</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="https://www.linkedin.com" className="caption link-line">LinkedIn</a>
            <a href="https://www.behance.net" className="caption link-line">Behance</a>
            <Link href="/contact" className="caption link-line">Contact</Link>
          </div>
          <span className="caption" style={{ color: 'var(--muted)' }}>
            Set in Ranade & Switzer
          </span>
        </div>
      </div>
    </footer>
  );
}

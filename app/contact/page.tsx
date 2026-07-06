'use client';

import Wordmark from '@/components/Wordmark';
import Reveal from '@/components/Reveal';

const EMAIL = 'sanyamunam95@gmail.com';

export default function Contact() {
  return (
    <section
      style={{
        minHeight: '88svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        position: 'relative',
        background: `
          radial-gradient(55% 45% at 20% 20%, rgba(229,189,223,0.10) 0%, transparent 60%),
          radial-gradient(50% 40% at 85% 70%, rgba(153,225,217,0.08) 0%, transparent 60%),
          var(--jet)`,
      }}
    >
      <div
        style={{
          padding: '0 var(--gutter)',
          marginBottom: 'clamp(24px, 4vw, 48px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 24,
        }}
      >
        <Reveal>
          <div>
            <p className="caption" style={{ marginBottom: 16 }}>
              Have a product that should disappear into people’s lives?
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="body-lg link-line"
              data-cursor-label="Write"
              style={{ color: 'var(--turquoise)' }}
            >
              {EMAIL}
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="https://www.linkedin.com" className="caption link-line">LinkedIn</a>
            <a href="https://www.behance.net" className="caption link-line">Behance</a>
          </div>
        </Reveal>
      </div>

      <div style={{ padding: '0 8px' }}>
        <Wordmark text="TALK" color="var(--orchid)" delay={0.15} />
      </div>
    </section>
  );
}

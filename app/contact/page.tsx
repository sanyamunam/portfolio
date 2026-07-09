'use client';

import Wordmark from '@/components/Wordmark';
import Reveal from '@/components/Reveal';

const EMAIL = 'sanyamunam95@gmail.com';

export default function Contact() {
  return (
    <section
      className="surface-contact"
      style={{
        minHeight: '88svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        position: 'relative',
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
            <p className="caption" style={{ marginBottom: 12 }}>
              Sanya Munam — UX Lead & Project Manager
            </p>
            <p
              className="body-lg"
              style={{ maxWidth: '32ch', marginBottom: 24, textWrap: 'balance' }}
            >
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
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <span className="caption" style={{ color: 'var(--muted)' }}>
            Doha, Qatar — GMT+3
          </span>
        </Reveal>
      </div>

      <div style={{ padding: '0 8px' }}>
        <Wordmark text="TALK" color="var(--orchid)" delay={0.15} />
      </div>
    </section>
  );
}

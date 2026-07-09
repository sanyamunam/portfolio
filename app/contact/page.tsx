'use client';

import { motion } from 'framer-motion';
import Wordmark from '@/components/Wordmark';
import Reveal from '@/components/Reveal';
import { mix } from '@/lib/site';

const EMAIL = 'sanyamunam95@gmail.com';

/* Ways in — each row opens a pre-addressed email with the subject
   already written. The archive's index grammar, pointed at the inbox. */
const OPENERS = [
  {
    title: 'A project brief',
    note: 'Something to build, fix or completely rethink',
    token: 'turquoise',
  },
  {
    title: 'A UX audit',
    note: 'A second pair of eyes on a product that underperforms',
    token: 'orchid',
  },
  {
    title: 'A talk or a workshop',
    note: 'Design thinking, UX strategy, building design teams',
    token: 'sienna',
  },
  {
    title: 'Unreasonably good design',
    note: 'No agenda — enthusiasm is a valid subject line',
    token: 'wine',
  },
];

const STEPS = [
  {
    label: 'You write',
    text: 'A line is enough. No deck, no formalities, no pitch voice.',
  },
  {
    label: 'We talk',
    text: 'Thirty minutes on your problem — a conversation, not a sales call.',
  },
  {
    label: 'You get a point of view',
    text: 'Honest direction, realistic scope and clear next steps.',
  },
];

const ESSENTIALS = [
  { label: 'Location', value: 'Doha, Qatar' },
  { label: 'Timezone', value: 'GMT+3' },
  { label: 'Write about', value: 'Anything UX — strategy to pixels' },
  { label: 'First reply', value: 'Within a day' },
];

export default function Contact() {
  return (
    <>
      {/* ——— header — same grammar as WORK and CURIOUS ————— */}
      <section
        style={{
          paddingTop: 'clamp(120px, 18vh, 200px)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '0 var(--gutter)', marginBottom: 16 }}>
          <Reveal>
            <p className="caption">Correspondence — Doha, Qatar</p>
          </Reveal>
        </div>
        <div style={{ padding: '0 8px' }}>
          <Wordmark text="TALK" color="var(--orchid)" delay={0.2} />
        </div>
      </section>

      {/* ——— the invitation + essentials plate ————————
           Composed like a case-study overview: statement on the left,
           a specimen plate on the right. */}
      <section
        className="section surface-contact"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))',
          gap: 'clamp(40px, 6vw, 96px)',
          alignItems: 'center',
        }}
      >
        <div>
          <Reveal>
            <p className="caption" style={{ marginBottom: 24 }}>
              The invitation
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <p
              className="display"
              style={{
                fontSize: 'clamp(1.8rem, 3.6vw, 3.4rem)',
                textTransform: 'none',
                maxWidth: '20ch',
                lineHeight: 1.05,
                textWrap: 'balance',
              }}
            >
              Always up for a conversation about UX and unreasonably good
              design.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <a
              href={`mailto:${EMAIL}`}
              className="cta"
              data-cursor-label="Write to Sanya"
              style={{ color: 'var(--turquoise)', marginTop: 36, display: 'inline-flex' }}
            >
              Say hello ↗
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div
            className="glass"
            style={{
              padding: 'clamp(28px, 4vw, 48px)',
              background: mix('orchid', 8),
              borderColor: mix('orchid', 35),
            }}
          >
            <h2
              className="display"
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)',
                textTransform: 'none',
                marginBottom: 28,
              }}
            >
              The essentials
            </h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {ESSENTIALS.map((row) => (
                <div key={row.label} style={{ display: 'flex', gap: 24 }}>
                  <span className="caption" style={{ width: 88, flexShrink: 0 }}>
                    {row.label}
                  </span>
                  <span className="caption" style={{ color: 'var(--bone)' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <div
              aria-hidden
              style={{
                height: 4,
                marginTop: 28,
                background: 'linear-gradient(90deg, var(--orchid), transparent)',
              }}
            />
          </div>
        </Reveal>
      </section>

      {/* ——— where to start — the index, pointed at the inbox ——— */}
      <section className="section">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 'clamp(36px, 5vw, 64px)',
          }}
        >
          <Reveal>
            <h2 className="display" style={{ fontSize: 'var(--text-display)' }}>
              Where to start
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <span className="caption" style={{ color: 'var(--muted)' }}>
              Pick one — it opens a pre-addressed email
            </span>
          </Reveal>
        </div>

        <div>
          {OPENERS.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.06}>
              <motion.a
                href={`mailto:${EMAIL}?subject=${encodeURIComponent(o.title)}`}
                data-cursor-label="Write this"
                whileHover="hover"
                initial="rest"
                animate="rest"
                style={{ display: 'block' }}
              >
                <div
                  className="hairline-top"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'clamp(40px, 6vw, 80px) 1fr auto',
                    gap: 'clamp(12px, 3vw, 40px)',
                    alignItems: 'center',
                    padding: 'clamp(18px, 3vw, 34px) 0',
                  }}
                >
                  <span
                    className="display"
                    style={{
                      fontSize: 'clamp(1.4rem, 3vw, 2.6rem)',
                      color: `var(--${o.token})`,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <motion.h3
                      className="display"
                      variants={{ rest: { x: 0 }, hover: { x: 16 } }}
                      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                      style={{
                        fontSize: 'clamp(1.5rem, 3.6vw, 2.8rem)',
                        textTransform: 'none',
                        color: 'var(--bone)',
                      }}
                    >
                      {o.title}
                    </motion.h3>
                    <span className="caption" style={{ color: 'var(--muted)' }}>
                      {o.note}
                    </span>
                  </div>
                  <span className="caption" style={{ color: `var(--${o.token})` }}>
                    Write →
                  </span>
                </div>
              </motion.a>
            </Reveal>
          ))}
          <div className="hairline-top" />
        </div>
      </section>

      {/* ——— what happens next — a slim colophon band ————— */}
      <section
        style={{
          padding: 'clamp(36px, 5vw, 64px) var(--gutter)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <Reveal>
          <p className="caption" style={{ color: 'var(--orchid)', marginBottom: 28 }}>
            What happens next
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
              gap: 'clamp(20px, 3vw, 40px)',
            }}
          >
            {STEPS.map((s, i) => (
              <div key={s.label}>
                <p className="caption" style={{ color: 'var(--muted)', marginBottom: 8 }}>
                  {String(i + 1).padStart(2, '0')} — {s.label}
                </p>
                <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--bone)' }}>
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}

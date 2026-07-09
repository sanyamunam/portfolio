'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import Wordmark from '@/components/Wordmark';
import Reveal from '@/components/Reveal';
import { withBase } from '@/lib/site';

const EMAIL = 'sanyamunam95@gmail.com';

/* The fun stuff — not case studies, but the personality of the archive:
   the ink self-portrait, the 600-page obsession, Dad's favourite app,
   a loose color specimen and the maker's seal. */
type Plate = {
  kind: 'ink' | 'img' | 'logo' | 'chip' | 'glyph';
  src?: string;
  pos: React.CSSProperties;
  rotate: number;
  keep?: boolean;
};

const PLATES: Plate[] = [
  {
    kind: 'ink',
    pos: { top: '10%', left: '5%', width: 'clamp(130px, 15vw, 225px)' },
    rotate: -2,
    keep: true,
  },
  {
    kind: 'img',
    src: '/sparks/jobs-book.jpg',
    pos: { top: '13%', right: '7%', width: 'clamp(100px, 11vw, 165px)' },
    rotate: 1.6,
    keep: true,
  },
  {
    kind: 'logo',
    src: '/sparks/gpay.svg',
    pos: { bottom: '18%', left: '8%', width: 'clamp(120px, 14vw, 205px)' },
    rotate: -1.2,
  },
  {
    kind: 'chip',
    pos: { bottom: '7%', left: '42%', width: 'clamp(110px, 12vw, 185px)' },
    rotate: 2,
  },
  {
    kind: 'glyph',
    pos: { bottom: '20%', right: '7%', width: 'clamp(105px, 12vw, 180px)' },
    rotate: -1.6,
  },
];

function PlateContent({ plate }: { plate: Plate }) {
  switch (plate.kind) {
    case 'ink':
      return (
        <div
          className="ink-illustration"
          style={{
            color: 'var(--turquoise)',
            WebkitMask: `url(${withBase('/illustration.svg')}) center / contain no-repeat`,
            mask: `url(${withBase('/illustration.svg')}) center / contain no-repeat`,
          }}
        />
      );
    case 'img':
      return (
        <img
          src={withBase(plate.src!)}
          alt=""
          loading="lazy"
          style={{ width: '100%', display: 'block' }}
        />
      );
    case 'logo':
      return (
        <div
          style={{
            aspectRatio: '4 / 3',
            background: '#e4ddd0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 14,
          }}
        >
          <img
            src={withBase(plate.src!)}
            alt=""
            loading="lazy"
            style={{ width: '68%', display: 'block' }}
          />
        </div>
      );
    case 'chip':
      return (
        <div
          style={{
            aspectRatio: '4 / 3',
            background: 'var(--orchid)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: 10,
          }}
        >
          <span
            className="caption"
            style={{ color: 'var(--jet)', fontSize: 10 }}
          >
            Orchid — specimen 02
          </span>
        </div>
      );
    case 'glyph':
      return (
        <div
          style={{
            aspectRatio: '1 / 1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            className="stamp-mark"
            style={{
              color: 'var(--sienna)',
              fontSize: 'clamp(3rem, 5vw, 4.6rem)',
              lineHeight: 1,
            }}
          >
            ✺
          </span>
        </div>
      );
  }
}

function DeskClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Qatar',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {time ?? '––:––'}
    </span>
  );
}

export default function Contact() {
  const reduced = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start end', 'end start'],
  });

  /* each plate drifts at its own pace — the room has depth */
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const y5 = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const drift = [y1, y2, y3, y4, y5];

  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const send = () => {
    const subject = name.trim() ? `Hello from ${name.trim()}` : 'Hello';
    const body = [msg.trim(), name.trim() ? `— ${name.trim()}` : '']
      .filter(Boolean)
      .join('\n\n');
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject,
    )}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
  };

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

      {/* ——— the invitation, among the keepsakes ————————
           One warm sentence at center; the archive's personality —
           self-portrait, book, specimen, seal — floating around it. */}
      <section
        ref={heroRef}
        style={{
          minHeight: '88svh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(64px, 10vh, 120px) var(--gutter)',
        }}
      >
        {PLATES.map((p, i) => (
          <motion.figure
            key={p.kind}
            className={`glass talk-plate${p.keep ? ' talk-plate-keep' : ''}`}
            aria-hidden
            initial={{
              opacity: 0,
              filter:
                p.kind === 'img' || p.kind === 'logo'
                  ? 'grayscale(0.85)'
                  : 'none',
            }}
            animate={{ opacity: 1 }}
            whileHover={{ filter: 'grayscale(0)', scale: 1.04 }}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.12 }}
            style={{
              position: 'absolute',
              ...p.pos,
              y: reduced ? 0 : drift[i],
              rotate: p.rotate,
              padding: 8,
              margin: 0,
              zIndex: 0,
            }}
          >
            <PlateContent plate={p} />
          </motion.figure>
        ))}

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Reveal>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(2.4rem, 6vw, 5.2rem)',
                textTransform: 'none',
                lineHeight: 1.04,
                maxWidth: '16ch',
                textWrap: 'balance',
              }}
            >
              Let&#8217;s talk{' '}
              <span
                className="stamp-mark"
                aria-hidden
                style={{ color: 'var(--orchid)', fontSize: '0.7em' }}
              >
                ✺
              </span>{' '}
              and make something effortless.
            </h2>
          </Reveal>
        </div>

        <motion.span
          className="caption"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{
            position: 'absolute',
            bottom: 'clamp(20px, 3.5vh, 36px)',
            color: 'var(--muted)',
          }}
        >
          Scroll to get in touch ↓
        </motion.span>
      </section>

      {/* ——— THE DESK — presence on the left, a note on the right ——— */}
      <section
        className="section surface-contact"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))',
          gap: 'clamp(48px, 7vw, 120px)',
          alignItems: 'start',
        }}
      >
        {/* presence — there's a person at this desk, at this hour */}
        <div>
          <Reveal>
            <p className="caption" style={{ marginBottom: 24 }}>
              At my desk
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <p
              className="display"
              style={{
                fontSize: 'clamp(3.4rem, 8vw, 7rem)',
                lineHeight: 1,
                color: 'var(--bone)',
              }}
            >
              <DeskClock />
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="caption" style={{ marginTop: 12, color: 'var(--muted)' }}>
              Doha, Qatar — GMT+3
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <div style={{ marginTop: 'clamp(28px, 4vw, 44px)', display: 'grid', gap: 18 }}>
              {[
                ['Good hours', 'Sunday to Thursday, 9am — 6pm'],
                ['First reply', 'Within a day — usually faster'],
                ['Open to', 'Projects, audits, talks, and good design chatter'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="hairline-top"
                  style={{ paddingTop: 14, display: 'flex', gap: 24 }}
                >
                  <span className="caption" style={{ width: 88, flexShrink: 0 }}>
                    {k}
                  </span>
                  <span className="caption" style={{ color: 'var(--bone)' }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* the note — a form with no backend: it opens their mail app */}
        <div>
          <Reveal>
            <p className="caption" style={{ marginBottom: 24 }}>
              Leave a note
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(1.7rem, 3vw, 2.7rem)',
                textTransform: 'none',
                lineHeight: 1.08,
                marginBottom: 'clamp(28px, 4vw, 40px)',
                maxWidth: '18ch',
              }}
            >
              Tell me what you&#8217;re building.
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <div style={{ display: 'grid', gap: 'clamp(24px, 3vw, 36px)' }}>
              <div>
                <label className="caption" htmlFor="note-name" style={{ color: 'var(--muted)' }}>
                  Your name
                </label>
                <input
                  id="note-name"
                  className="note-field"
                  type="text"
                  autoComplete="name"
                  placeholder="What should I call you?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="caption" htmlFor="note-msg" style={{ color: 'var(--muted)' }}>
                  The gist of it
                </label>
                <textarea
                  id="note-msg"
                  className="note-field"
                  rows={4}
                  placeholder="A project, an audit, a question — a line is enough."
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={send}
                  className="cta"
                  data-cursor-label="Write to Sanya"
                  style={{
                    color: 'var(--turquoise)',
                    background: 'none',
                  }}
                >
                  Send it ↗
                </button>
                <p className="caption" style={{ marginTop: 16, color: 'var(--muted)' }}>
                  Opens in your own mail app — nothing stored, no forms, no
                  databases. Just email.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

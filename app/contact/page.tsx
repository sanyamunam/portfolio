'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import Reveal from '@/components/Reveal';
import { withBase } from '@/lib/site';

const EMAIL = 'sanyamunam95@gmail.com';

/* Fragments of the working life, floated around the invitation —
   boards, builds and the odd obsession. The archive, loose-leaf. */
const PLATES = [
  {
    src: '/process/board.png',
    alt: 'QBF FigJam war room',
    style: { top: '9%', left: '5%', width: 'clamp(140px, 16vw, 250px)' },
    rotate: -2,
    keep: true,
  },
  {
    src: '/cards/qbf-card.jpg',
    alt: 'Qatar Basketball Federation platform',
    style: { top: '11%', right: '6%', width: 'clamp(150px, 17vw, 265px)' },
    rotate: 1.6,
    keep: false,
  },
  {
    src: '/process-am/hall.jpg',
    alt: 'AlMujadilah prayer hall',
    style: { bottom: '17%', left: '8%', width: 'clamp(120px, 14vw, 215px)' },
    rotate: -1.2,
    keep: false,
  },
  {
    src: '/cards/am-card.jpg',
    alt: 'AlMujadilah platform',
    style: { bottom: '7%', left: '41%', width: 'clamp(130px, 15vw, 230px)' },
    rotate: 2,
    keep: false,
  },
  {
    src: '/process-qoc/concept-home.jpg',
    alt: 'Qatar Olympic Committee concept',
    style: { bottom: '19%', right: '7%', width: 'clamp(130px, 15vw, 235px)' },
    rotate: -1.6,
    keep: true,
  },
];

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
    offset: ['start start', 'end start'],
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
      {/* ——— HERO — the invitation, among the archive ————
           One warm sentence at center; fragments of real work floating
           around it, developing on hover like everything else here. */}
      <section
        ref={heroRef}
        style={{
          minHeight: '100svh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(110px, 15vh, 170px) var(--gutter) clamp(64px, 9vh, 110px)',
        }}
      >
        {PLATES.map((p, i) => (
          <motion.figure
            key={p.src}
            className={`glass talk-plate${p.keep ? ' talk-plate-keep' : ''}`}
            aria-hidden
            initial={{ opacity: 0, filter: 'grayscale(0.85)' }}
            animate={{ opacity: 1 }}
            whileHover={{ filter: 'grayscale(0)', scale: 1.04 }}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.12 }}
            style={{
              position: 'absolute',
              ...p.style,
              y: reduced ? 0 : drift[i],
              rotate: p.rotate,
              padding: 8,
              margin: 0,
              zIndex: 0,
            }}
          >
            <img
              src={withBase(p.src)}
              alt=""
              loading="lazy"
              style={{ width: '100%', display: 'block' }}
            />
          </motion.figure>
        ))}

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Reveal>
            <p className="caption" style={{ marginBottom: 'clamp(20px, 3vh, 32px)' }}>
              Sanya Munam — Correspondence
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              className="display"
              style={{
                fontSize: 'clamp(2.6rem, 6.5vw, 5.6rem)',
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
            </h1>
          </Reveal>
        </div>

        <motion.span
          className="caption"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
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

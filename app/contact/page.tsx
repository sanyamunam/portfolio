'use client';

import { useEffect, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import Reveal from '@/components/Reveal';
import { mix } from '@/lib/site';

const EMAIL = 'sanyamunam95@gmail.com';

/* Conversation starters — each prefills the subject line, so every
   email arrives pre-sorted and nobody stares at a blank compose window. */
const OPENERS = [
  { label: 'A project brief', token: 'turquoise' },
  { label: 'A UX audit', token: 'orchid' },
  { label: 'A pitch that needs rescuing', token: 'sienna' },
  { label: 'Unreasonably good design, generally', token: 'wine' },
];

/* TALK — four letters, four specimen inks. Hover to see them. */
const LETTER_TOKENS = ['turquoise', 'orchid', 'sienna', 'wine'];

function DohaClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Qatar',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {time ?? '––:––:––'}
    </span>
  );
}

/* The centerpiece — an invitation that leans toward the cursor. */
function MagneticHello({ reduced }: { reduced: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 16 });
  const sy = useSpring(y, { stiffness: 140, damping: 16 });

  return (
    <motion.a
      href={`mailto:${EMAIL}`}
      className="display"
      data-cursor-label="Write to Sanya"
      onMouseMove={(e) => {
        if (reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.32);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={{ color: 'var(--turquoise)' }}
      style={{
        x: sx,
        y: sy,
        fontSize: 'clamp(2.8rem, 9vw, 7.5rem)',
        textTransform: 'none',
        color: 'var(--bone)',
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'clamp(12px, 2.5vw, 32px)',
      }}
    >
      <span className="stamp-mark" aria-hidden style={{ fontSize: '0.42em' }}>
        ✺
      </span>
      Say hello
      <span aria-hidden style={{ fontSize: '0.72em' }}>
        ↗
      </span>
    </motion.a>
  );
}

function TalkWordmark({ reduced }: { reduced: boolean }) {
  return (
    <h1
      className="display"
      aria-label="Talk"
      style={{
        fontSize: 'var(--text-wordmark)',
        color: 'var(--orchid)',
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {'TALK'.split('').map((ch, i) => (
        <span
          key={i}
          aria-hidden
          style={{ display: 'inline-block', overflow: 'hidden' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: reduced ? 0 : '110%' }}
            animate={{ y: 0 }}
            transition={{
              duration: 1,
              delay: 0.35 + i * 0.055,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <motion.span
              whileHover={{ y: -16, color: `var(--${LETTER_TOKENS[i]})` }}
              transition={{ type: 'spring', stiffness: 320, damping: 17 }}
              style={{ display: 'inline-block' }}
            >
              {ch}
            </motion.span>
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

export default function Contact() {
  const reduced = useReducedMotion() ?? false;

  /* reactive atmosphere — a plum wash that drifts after the cursor */
  const mx = useMotionValue(50);
  const my = useMotionValue(35);
  const smx = useSpring(mx, { stiffness: 40, damping: 18 });
  const smy = useSpring(my, { stiffness: 40, damping: 18 });
  const atmosphere = useMotionTemplate`radial-gradient(42% 38% at ${smx}% ${smy}%, color-mix(in srgb, var(--orchid) calc(13% * var(--wash-boost, 1)), transparent) 0%, transparent 70%)`;

  return (
    <section
      className="surface-contact"
      onMouseMove={(e) => {
        if (reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: atmosphere,
        }}
      />

      {/* kicker */}
      <div
        style={{
          padding: 'clamp(110px, 15vh, 170px) var(--gutter) 0',
          position: 'relative',
        }}
      >
        <Reveal>
          <p className="caption">Sanya Munam — UX Lead & Project Manager</p>
        </Reveal>
      </div>

      {/* the invitation */}
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 'clamp(26px, 4vh, 44px)',
          padding: 'clamp(40px, 6vh, 72px) var(--gutter)',
          position: 'relative',
        }}
      >
        <Reveal>
          <p
            className="body-lg"
            style={{ maxWidth: '30ch', textWrap: 'balance' }}
          >
            Always up for a conversation about UX and unreasonably good
            design.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <MagneticHello reduced={reduced} />
        </Reveal>

        <Reveal delay={0.16}>
          <div>
            <p className="caption" style={{ marginBottom: 14, color: 'var(--muted)' }}>
              In a hurry? Pick an opener — it writes the subject line for you
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              {OPENERS.map((o) => (
                <motion.a
                  key={o.label}
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent(o.label)}`}
                  className="caption"
                  data-cursor-label="Start here"
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                  style={{
                    padding: '10px 16px',
                    border: `1px solid ${mix(o.token, 50)}`,
                    color: `var(--${o.token})`,
                    background: mix(o.token, 6),
                  }}
                >
                  {o.label}
                </motion.a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* presence strip — proof there's a person on the other end */}
      <Reveal delay={0.2}>
        <div
          className="hairline-top"
          style={{
            margin: '0 var(--gutter)',
            padding: 'clamp(20px, 3vh, 32px) 0 clamp(26px, 4vh, 40px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
            gap: 24,
            position: 'relative',
          }}
        >
          <div>
            <p className="caption" style={{ color: 'var(--muted)', marginBottom: 8 }}>
              Local time — Doha, GMT+3
            </p>
            <p
              className="display"
              style={{ fontSize: 'clamp(1.1rem, 1.7vw, 1.45rem)', textTransform: 'none' }}
            >
              <DohaClock />
            </p>
          </div>
          <div>
            <p className="caption" style={{ color: 'var(--muted)', marginBottom: 8 }}>
              Availability
            </p>
            <p
              className="display"
              style={{
                fontSize: 'clamp(1.1rem, 1.7vw, 1.45rem)',
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span
                className="pulse-dot"
                aria-hidden
                style={{
                  width: 9,
                  height: 9,
                  flexShrink: 0,
                  background: 'var(--turquoise)',
                  display: 'inline-block',
                }}
              />
              Taking on new work
            </p>
          </div>
          <div>
            <p className="caption" style={{ color: 'var(--muted)', marginBottom: 8 }}>
              Response time
            </p>
            <p
              className="display"
              style={{ fontSize: 'clamp(1.1rem, 1.7vw, 1.45rem)', textTransform: 'none' }}
            >
              Within a day — usually faster
            </p>
          </div>
        </div>
      </Reveal>

      {/* TALK — hover the letters */}
      <div style={{ padding: '0 8px', position: 'relative' }}>
        <TalkWordmark reduced={reduced} />
      </div>
    </section>
  );
}

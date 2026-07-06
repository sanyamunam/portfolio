'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '@/lib/projects';
import { withBase } from '@/lib/site';

function tint(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* Looping platform snippet — plays via JS so blocked autoplay stays silent */
function CardMedia({ media, alt }: { media: NonNullable<Project['cardMedia']>; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <div className="card-media" style={{ height: 'clamp(180px, 22vw, 250px)', overflow: 'hidden' }}>
      {media.type === 'video' ? (
        <video
          ref={ref}
          src={withBase(media.src)}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
        />
      ) : (
        <img
          src={withBase(media.src)}
          alt={alt}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
        />
      )}
    </div>
  );
}

/* Work-grid card: a platform snippet on top, the archival plate below.
   Placeholder projects keep the color-specimen identity; disabled ones
   are listed but not open for reading yet. */
export default function SpecimenCard({ project }: { project: Project }) {
  const { specimen } = project;

  const card = (
    <motion.article
      className="specimen-card"
      whileHover={project.disabled ? undefined : 'hover'}
      initial="rest"
      animate="rest"
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--glass-border)',
        background: `
          radial-gradient(120% 90% at 80% 0%, ${tint(specimen.hex, 0.22)} 0%, transparent 60%),
          radial-gradient(100% 80% at 10% 100%, ${tint(specimen.hex, 0.12)} 0%, transparent 55%),
          var(--jet-2)`,
        minHeight: 'clamp(340px, 40vw, 460px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        opacity: project.disabled ? 0.5 : 1,
        filter: project.disabled ? 'grayscale(0.7)' : 'none',
      }}
    >
      {/* index + client — whispering metadata */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
        }}
      >
        <span className="caption" style={{ color: tint(specimen.hex, 0.9) }}>
          {project.index} / {project.year}
        </span>
        {project.clientLogo ? (
          <img
            src={withBase(project.clientLogo)}
            alt={project.client}
            style={{ height: 44, width: 'auto', opacity: 0.95 }}
          />
        ) : (
          <span className="caption">{project.client}</span>
        )}
      </div>

      {/* the platform itself */}
      {project.cardMedia && (
        <CardMedia media={project.cardMedia} alt={`${project.client} — platform snippet`} />
      )}

      {/* frosted plate */}
      <motion.div
        className="glass"
        variants={{
          rest: { y: 0, rotate: 0 },
          hover: { y: -8, rotate: -0.4 },
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        style={{
          margin: project.cardMedia ? '16px 20px 20px' : '0 20px 20px',
          padding: project.cardMedia ? 'clamp(16px, 2vw, 24px)' : 'clamp(20px, 3vw, 32px)',
          background: tint(specimen.hex, 0.08),
          borderColor: tint(specimen.hex, 0.3),
        }}
      >
        <h3
          className="display"
          style={{
            fontSize: project.snapshot
              ? 'clamp(1.3rem, 2.2vw, 1.9rem)'
              : 'clamp(1.9rem, 3.4vw, 3rem)',
            color: 'var(--bone)',
            marginBottom: project.cardMedia ? 12 : 'clamp(20px, 3vw, 36px)',
            textTransform: 'none',
          }}
        >
          {project.snapshot ? project.title : specimen.name}
        </h3>

        {!project.cardMedia && (
          <div style={{ display: 'grid', gap: 6 }}>
            {(
              project.snapshot?.slice(0, 3) ?? [
                { label: 'CMYK', value: specimen.cmyk },
                { label: 'RGB', value: specimen.rgb },
                { label: 'HEX', value: specimen.hex },
              ]
            ).map((row) => (
              <div key={row.label} style={{ display: 'flex', gap: 20 }}>
                <span
                  className="caption"
                  style={{ width: project.snapshot ? 66 : 44, flexShrink: 0 }}
                >
                  {row.label}
                </span>
                <span
                  className="caption"
                  style={{ color: 'var(--bone)', letterSpacing: '0.08em' }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: project.cardMedia ? 12 : 'clamp(20px, 3vw, 32px)',
            gap: 12,
          }}
        >
          <span className="caption" style={{ color: 'var(--muted)' }}>
            {project.role} · {project.sector}
          </span>
          <span
            className="caption"
            style={{
              border: `1px solid ${tint(specimen.hex, 0.5)}`,
              color: tint(specimen.hex, 1),
              padding: '5px 10px',
              whiteSpace: 'nowrap',
            }}
          >
            {project.disabled ? 'Case study soon' : 'Read the case'}
          </span>
        </div>
      </motion.div>
    </motion.article>
  );

  if (project.disabled) {
    return <div aria-label={`${project.client} — case study coming soon`}>{card}</div>;
  }

  return (
    <Link href={`/work/${project.slug}`} data-cursor-label="Open case">
      {card}
    </Link>
  );
}

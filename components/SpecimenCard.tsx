'use client';

import Link from 'next/link';
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

/* Work-grid card — one consistent anatomy for all four:
   a 16:10 media zone (platform still, or a specimen-color tile),
   then a flat editorial info block. No floating plates. */
export default function SpecimenCard({ project }: { project: Project }) {
  const { specimen } = project;

  const card = (
    <motion.article
      className="specimen-card"
      whileHover={project.disabled ? undefined : { y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      style={{
        border: '1px solid var(--line)',
        background: 'var(--jet-2)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        opacity: project.disabled ? 0.55 : 1,
        filter: project.disabled ? 'grayscale(0.6)' : 'none',
      }}
    >
      {/* media zone — the platform, or the color specimen */}
      <div
        className="card-media"
        style={{
          aspectRatio: '16 / 10',
          overflow: 'hidden',
          borderBottom: '1px solid var(--line)',
          position: 'relative',
        }}
      >
        {project.cardMedia ? (
          <img
            src={withBase(project.cardMedia.src)}
            alt={`${project.client} — platform snippet`}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `
                radial-gradient(120% 100% at 80% 0%, ${tint(specimen.hex, 0.3)} 0%, transparent 65%),
                radial-gradient(100% 90% at 15% 100%, ${tint(specimen.hex, 0.16)} 0%, transparent 60%),
                var(--jet-3)`,
            }}
          >
            <span
              className="display"
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                color: tint(specimen.hex, 0.9),
                textTransform: 'none',
              }}
            >
              {project.disabled
                ? 'In progress'
                : project.comingSoon
                  ? 'In the works'
                  : specimen.name}
            </span>
          </div>
        )}
      </div>

      {/* info block */}
      <div
        style={{
          padding: 'clamp(18px, 2.5vw, 28px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          flexGrow: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span className="caption" style={{ color: tint(specimen.hex, 0.9) }}>
            {project.index} / {project.year}
          </span>
          {project.clientLogo ? (
            <img
              src={withBase(project.clientLogo)}
              alt={project.client}
              style={{ height: 34, width: 'auto', opacity: 0.95 }}
            />
          ) : (
            <span className="caption">{project.client}</span>
          )}
        </div>

        <h3
          className="display"
          style={{
            fontSize: 'clamp(1.4rem, 2.3vw, 2rem)',
            color: 'var(--bone)',
            textTransform: 'none',
            lineHeight: 1.05,
          }}
        >
          {project.title}
        </h3>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            marginTop: 'auto',
          }}
        >
          <span className="caption" style={{ color: 'var(--muted)' }}>
            {project.disabled
              ? 'Content on its way'
              : `${project.role} · ${project.sector}`}
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
            {project.disabled ? 'Case study in progress' : 'Read the case'}
          </span>
        </div>
      </div>
    </motion.article>
  );

  if (project.disabled) {
    return <div aria-label={`${project.client} — case study in progress`}>{card}</div>;
  }

  return (
    <Link href={`/work/${project.slug}`} data-cursor-label="Open case">
      {card}
    </Link>
  );
}

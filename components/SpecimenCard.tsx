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

/* The color-specimen glass card — each case study is archived
   like an ink swatch: name, CMYK / RGB / HEX, provenance. */
export default function SpecimenCard({ project }: { project: Project }) {
  const { specimen } = project;

  return (
    <Link href={`/work/${project.slug}`} data-cursor-label="Open case">
      <motion.article
        whileHover="hover"
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
        }}
      >
        {/* index + client — whispering metadata */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px',
          }}
        >
          <span className="caption" style={{ color: tint(specimen.hex, 0.9) }}>
            {project.index} / {project.year}
          </span>
          {project.clientLogo ? (
            <img
              src={withBase(project.clientLogo)}
              alt={project.client}
              style={{ height: 52, width: 'auto', opacity: 0.95 }}
            />
          ) : (
            <span className="caption">{project.client}</span>
          )}
        </div>

        {/* frosted specimen plate */}
        <motion.div
          className="glass"
          variants={{
            rest: { y: 0, rotate: 0 },
            hover: { y: -10, rotate: -0.6 },
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          style={{
            margin: '0 20px 20px',
            padding: 'clamp(20px, 3vw, 32px)',
            background: tint(specimen.hex, 0.08),
            borderColor: tint(specimen.hex, 0.3),
          }}
        >
          <h3
            className="display"
            style={{
              fontSize: project.snapshot
                ? 'clamp(1.5rem, 2.6vw, 2.3rem)'
                : 'clamp(1.9rem, 3.4vw, 3rem)',
              color: 'var(--bone)',
              marginBottom: 'clamp(20px, 3vw, 36px)',
              textTransform: 'none',
            }}
          >
            {project.snapshot ? project.title : specimen.name}
          </h3>

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

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'clamp(20px, 3vw, 32px)',
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
              }}
            >
              sanya.design
            </span>
          </div>
        </motion.div>
      </motion.article>
    </Link>
  );
}

'use client';

import Wordmark from '@/components/Wordmark';
import Reveal from '@/components/Reveal';
import SpecimenCard from '@/components/SpecimenCard';
import { projects } from '@/lib/projects';

export default function Work() {
  return (
    <>
      <section
        style={{
          paddingTop: 'clamp(120px, 18vh, 200px)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '0 var(--gutter)', marginBottom: 16 }}>
          <Reveal>
            <p className="caption">
              Index — {projects.length} case studies, archived as ink specimens
            </p>
          </Reveal>
        </div>
        <div style={{ padding: '0 8px' }}>
          <Wordmark text="WORK" color="var(--bone)" delay={0.2} />
        </div>
      </section>

      <section
        className="section"
        style={{
          background: 'var(--jet-2)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(420px, 100%), 1fr))',
          gap: 'clamp(20px, 3vw, 40px)',
        }}
      >
        {projects.map((p, i) => (
          <Reveal
            key={p.slug}
            delay={i * 0.08}
            /* stagger the grid vertically — magazine spread rhythm */
            style={{ marginTop: i % 2 === 1 ? 'clamp(0px, 4vw, 72px)' : 0 }}
          >
            <SpecimenCard project={p} />
          </Reveal>
        ))}
      </section>
    </>
  );
}

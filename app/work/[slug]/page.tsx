import Link from 'next/link';
import { notFound } from 'next/navigation';
import Reveal from '@/components/Reveal';
import ShowcaseVideo from '@/components/ShowcaseVideo';
import { projects, getProject } from '@/lib/projects';
import { withBase } from '@/lib/site';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

function tint(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next =
    projects[(projects.findIndex((p) => p.slug === slug) + 1) % projects.length];
  const { specimen } = project;

  return (
    <>
      {/* ——— hero ————————————————————————— */}
      <section
        style={{
          paddingTop: 'clamp(140px, 22vh, 240px)',
          paddingBottom: 'clamp(48px, 8vw, 120px)',
          paddingLeft: 'var(--gutter)',
          paddingRight: 'var(--gutter)',
          position: 'relative',
          overflow: 'hidden',
          background: `radial-gradient(70% 60% at 70% 0%, ${tint(specimen.hex, 0.14)} 0%, transparent 65%), var(--jet)`,
        }}
      >
        {project.clientLogo && (
          <Reveal>
            <img
              src={withBase(project.clientLogo)}
              alt={`${project.client} logo`}
              style={{
                height: 'clamp(56px, 7vw, 76px)',
                width: 'auto',
                marginBottom: 'clamp(20px, 3vw, 32px)',
              }}
            />
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <p className="caption" style={{ marginBottom: 20, color: tint(specimen.hex, 1) }}>
            Case {project.index} — {project.client}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1
            className="display"
            style={{
              fontSize: 'var(--text-display-lg)',
              textTransform: 'none',
              maxWidth: '12ch',
              marginBottom: 'clamp(32px, 5vw, 64px)',
            }}
          >
            {project.title}
          </h1>
        </Reveal>

        {/* meta row — colophon */}
        <Reveal delay={0.16}>
          <div
            className="hairline-top"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 20,
              paddingTop: 20,
            }}
          >
            {[
              ['Client', project.client],
              ['Year', project.year],
              ['Role', project.role],
              ['Sector', project.sector],
              ...(project.partner ? [['Collaboration', project.partner.name]] : []),
              ...(project.snapshot ? [] : [['Specimen', `${specimen.name} ${specimen.hex}`]]),
            ].map(([k, v]) => (
              <div key={k}>
                <p className="caption" style={{ color: 'var(--muted)', marginBottom: 6 }}>
                  {k}
                </p>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{v}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ——— overview + specimen plate ———————————— */}
      <section
        className="section"
        style={{
          background: 'var(--jet-2)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))',
          gap: 'clamp(40px, 6vw, 96px)',
          alignItems: 'start',
        }}
      >
        <Reveal>
          <p className="caption" style={{ marginBottom: 20 }}>Overview</p>
          {project.overviewHeading && (
            <h2
              className="display"
              style={{
                fontSize: 'clamp(1.9rem, 3.6vw, 3.2rem)',
                textTransform: 'none',
                maxWidth: '16ch',
                marginBottom: 24,
              }}
            >
              {project.overviewHeading}
            </h2>
          )}
          <p
            className={project.overviewHeading ? undefined : 'body-lg'}
            style={{
              maxWidth: '48ch',
              color: project.overviewHeading ? 'var(--muted)' : undefined,
              lineHeight: 1.7,
            }}
          >
            {project.overview}
          </p>
        </Reveal>

        {/* frosted plate — for real cases: the brief at a glance;
            for placeholders: the color-specimen identity card */}
        <Reveal delay={0.12}>
          <div
            className="glass"
            style={{
              padding: 'clamp(28px, 4vw, 48px)',
              background: tint(specimen.hex, 0.08),
              borderColor: tint(specimen.hex, 0.35),
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
              {project.snapshot ? 'The brief — at a glance' : specimen.name}
            </h2>
            <div style={{ display: 'grid', gap: project.snapshot ? 12 : 8 }}>
              {(project.snapshot ?? [
                { label: 'CMYK', value: specimen.cmyk },
                { label: 'RGB', value: specimen.rgb },
                { label: 'HEX', value: specimen.hex },
              ]).map((row) => (
                <div key={row.label} style={{ display: 'flex', gap: 24 }}>
                  <span
                    className="caption"
                    style={{ width: project.snapshot ? 88 : 44, flexShrink: 0 }}
                  >
                    {row.label}
                  </span>
                  <span className="caption" style={{ color: 'var(--bone)' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            {project.liveUrl && (
              <a
                className="cta"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="qatarbasketball.qa"
                style={{ marginTop: 32, color: tint(specimen.hex, 1) }}
              >
                Visit the live website ↗
              </a>
            )}
            <div
              aria-hidden
              style={{
                height: 4,
                marginTop: 28,
                background: `linear-gradient(90deg, ${specimen.hex}, transparent)`,
              }}
            />
          </div>
        </Reveal>
      </section>

      {/* ——— showcase — the real thing —————————————— */}
      {project.video && (
        <section
          style={{
            background: 'var(--jet-2)',
            padding: '0 var(--gutter) var(--section-gap)',
          }}
        >
          <Reveal>
            <div
              className="glass"
              style={{
                padding: 'clamp(10px, 1.5vw, 18px)',
                background: tint(specimen.hex, 0.05),
                borderColor: tint(specimen.hex, 0.3),
              }}
            >
              <ShowcaseVideo
                src={withBase(project.video)}
                label={`${project.client} website walkthrough`}
              />
            </div>
            <p
              className="caption"
              style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', gap: 12 }}
            >
              <span>{project.videoCaption}</span>
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line"
                  data-cursor-label="qatarbasketball.qa"
                  style={{ color: tint(specimen.hex, 1) }}
                >
                  See it live ↗
                </a>
              ) : (
                <span style={{ color: 'var(--muted)' }}>Screen capture</span>
              )}
            </p>
          </Reveal>
        </section>
      )}

      {/* ——— the messy middle — process artifacts ————— */}
      {project.process && (
        <section
          className="section"
          style={{ paddingLeft: 0, paddingRight: 0, overflow: 'hidden' }}
        >
          <div
            style={{
              padding: '0 var(--gutter)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 'clamp(28px, 4vw, 48px)',
            }}
          >
            <Reveal>
              <h2 className="display" style={{ fontSize: 'var(--text-display)' }}>
                The messy middle
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <span className="caption" style={{ color: 'var(--muted)' }}>
                Inside the FigJam war room — hover to develop
              </span>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="filmstrip" data-cursor-label="Scroll">
              {project.process.map((p, i) => (
                <figure
                  key={p.src}
                  className="artifact glass"
                  style={{
                    transform: `rotate(${i % 2 ? 0.9 : -1.1}deg)`,
                    borderColor: tint(specimen.hex, 0.22),
                  }}
                >
                  <div style={{ width: p.w, maxWidth: '78vw', height: 320, overflow: 'hidden' }}>
                    <img
                      src={withBase(p.src)}
                      alt={p.caption}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                      }}
                    />
                  </div>
                  <figcaption
                    className="caption"
                    style={{
                      paddingTop: 10,
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <span style={{ color: tint(specimen.hex, 0.9) }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{p.caption}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* ——— chapters ————————————————————————— */}
      <section className="section">
        <div style={{ display: 'grid', gap: 'clamp(40px, 6vw, 72px)' }}>
          {project.chapters.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.05}>
              <div className="chapter-row hairline-top">
                <div>
                  <span
                    className="display"
                    style={{
                      fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
                      color: tint(specimen.hex, 1),
                      display: 'block',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="caption" style={{ marginTop: 10 }}>{c.label}</p>
                </div>
                <h3
                  className="display"
                  style={{
                    fontSize: 'clamp(1.5rem, 2.7vw, 2.4rem)',
                    textTransform: 'none',
                    lineHeight: 1.08,
                    color: 'var(--bone)',
                  }}
                >
                  {c.lead}
                </h3>
                <p
                  style={{
                    fontSize: '1.04rem',
                    lineHeight: 1.75,
                    color: 'var(--muted)',
                  }}
                >
                  {c.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* stats */}
        <Reveal delay={0.1}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 'clamp(16px, 2vw, 24px)',
              marginTop: 'clamp(56px, 8vw, 100px)',
            }}
          >
            {project.stats.map((s) => (
              <div
                key={s.label}
                className="glass"
                style={{ padding: 'clamp(20px, 3vw, 32px)' }}
              >
                <p
                  className="display"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: tint(specimen.hex, 1) }}
                >
                  {s.value}
                </p>
                <p className="caption" style={{ marginTop: 10 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* partner credit */}
        {project.partner && (
          <Reveal delay={0.15}>
            <div
              className="hairline-top"
              style={{
                marginTop: 'clamp(40px, 6vw, 72px)',
                paddingTop: 'clamp(20px, 3vw, 32px)',
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                flexWrap: 'wrap',
              }}
            >
              <span className="caption" style={{ color: 'var(--muted)' }}>
                In collaboration with
              </span>
              <img
                src={withBase(project.partner.logo)}
                alt={project.partner.name}
                style={{ height: 22, width: 'auto' }}
              />
            </div>
          </Reveal>
        )}
      </section>

      {/* ——— next case ———————————————————————— */}
      <section className="hairline-top" style={{ background: 'var(--jet-2)' }}>
        <Link href={`/work/${next.slug}`} data-cursor-label="Next case">
          <div
            className="section"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              paddingTop: 'clamp(48px, 7vw, 96px)',
              paddingBottom: 'clamp(48px, 7vw, 96px)',
            }}
          >
            <span className="caption" style={{ color: 'var(--muted)' }}>
              Next case — {next.index}
            </span>
            <span
              className="display link-line"
              style={{ fontSize: 'var(--text-display)', textTransform: 'none', alignSelf: 'flex-start' }}
            >
              {next.client} →
            </span>
          </div>
        </Link>
      </section>
    </>
  );
}

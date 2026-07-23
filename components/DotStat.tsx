'use client';

import { useEffect, useRef } from 'react';

/* Dot-matrix stat — ported from theoptimisticdesigner.com's proof
   strip: the number prints itself as a pixel wave sweeping left to
   right, each dot popping on and settling. After it settles, pixels
   under the cursor shimmer — pop and ease back, one by one.
   Real text stays in the DOM for screen readers; the canvas is the
   visual. Reduced motion renders the plain text. */

type Px = { x: number; y: number; j: number; on: number; e: number };

const DUR = 900;

export default function DotStat({ value }: { value: string }) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const cv = cvRef.current;
    if (!host || !cv) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      /* plain text for reduced motion — unhide the fallback */
      cv.style.display = 'none';
      const fb = host.querySelector<HTMLElement>('.dot-fallback');
      if (fb) {
        fb.classList.remove('sr-only');
        fb.style.position = 'static';
      }
      return;
    }

    let px: Px[] = [];
    let tw = 0;
    let th = 0;
    let cell = 3;
    let dpr = 1;
    let raf = 0;
    let t0 = -1;
    let settled = false;
    let started = false;
    let disposed = false;

    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, tw, th);
      ctx.fillStyle = getComputedStyle(host).color;
      const dot = cell * 0.74;
      for (let k = 0; k < px.length; k++) {
        const p = px[k];
        if (!p.on) continue;
        const s = dot * (1 + p.e * 1.15);
        const o = (s - dot) / 2;
        ctx.fillRect(p.x - o, p.y - o, s, s);
      }
    };

    const setup = () => {
      const style = getComputedStyle(host);
      const fontPx = parseFloat(style.fontSize);
      dpr = window.devicePixelRatio || 1;
      cell = Math.max(2, Math.round(fontPx / 16));

      const mc = document.createElement('canvas');
      const mctx = mc.getContext('2d');
      if (!mctx) return false;
      const font = `${style.fontWeight} ${fontPx}px ${style.fontFamily}`;
      mctx.font = font;
      const m = mctx.measureText(value);
      const ascent = m.actualBoundingBoxAscent ?? fontPx * 0.75;
      const descent = m.actualBoundingBoxDescent ?? fontPx * 0.08;
      tw = Math.ceil(m.width) + 2;
      th = Math.ceil(ascent + descent) + 2;

      /* sample the glyphs at grid resolution */
      const gw = Math.ceil(tw / cell);
      const gh = Math.ceil(th / cell);
      const oc = document.createElement('canvas');
      oc.width = gw;
      oc.height = gh;
      const octx = oc.getContext('2d');
      if (!octx) return false;
      octx.font = `${style.fontWeight} ${fontPx / cell}px ${style.fontFamily}`;
      octx.textBaseline = 'alphabetic';
      octx.fillStyle = '#fff';
      octx.fillText(value, 0, ascent / cell);
      const data = octx.getImageData(0, 0, gw, gh).data;

      const preserveOn = settled;
      px = [];
      for (let gy = 0; gy < gh; gy++) {
        for (let gx = 0; gx < gw; gx++) {
          if (data[(gy * gw + gx) * 4 + 3] > 100) {
            px.push({
              x: gx * cell,
              y: gy * cell,
              j: Math.random(),
              on: preserveOn ? 1 : 0,
              e: 0,
            });
          }
        }
      }

      cv.style.width = `${tw}px`;
      cv.style.height = `${th}px`;
      cv.width = Math.round(tw * dpr);
      cv.height = Math.round(th * dpr);
      render();
      return true;
    };

    const tick = (ts: number) => {
      if (disposed) return;
      if (t0 < 0) t0 = ts;
      const wave = (ts - t0) / DUR;
      let pending = 0;
      let easing = 0;
      for (let k = 0; k < px.length; k++) {
        const p = px[k];
        if (!p.on) {
          if (p.x / tw < wave * 1.3 - p.j * 0.3) {
            p.on = 1;
            p.e = 1;
          } else {
            pending++;
            continue;
          }
        }
        p.e *= 0.8;
        if (p.e > 0.03) easing++;
        else p.e = 0;
      }
      render();
      if (pending || easing) {
        raf = requestAnimationFrame(tick);
      } else {
        settled = true;
        raf = 0;
      }
    };

    let shimmerRaf = 0;
    const shimmerTick = () => {
      if (disposed) return;
      let easing = 0;
      for (let k = 0; k < px.length; k++) {
        const p = px[k];
        if (!p.e) continue;
        p.e *= 0.82;
        if (p.e > 0.03) easing++;
        else p.e = 0;
      }
      render();
      shimmerRaf = easing ? requestAnimationFrame(shimmerTick) : 0;
    };

    const onMove = (ev: MouseEvent) => {
      if (!settled) return;
      const r = cv.getBoundingClientRect();
      const hx = ev.clientX - r.left;
      const hy = ev.clientY - r.top;
      const HR = 30 * 30;
      let hit = false;
      for (let k = 0; k < px.length; k++) {
        const p = px[k];
        const dx = p.x - hx;
        const dy = p.y - hy;
        if (dx * dx + dy * dy < HR && p.e < 0.05) {
          p.e = 1;
          hit = true;
        }
      }
      if (hit) {
        render();
        if (!shimmerRaf) shimmerRaf = requestAnimationFrame(shimmerTick);
      }
    };
    cv.addEventListener('mousemove', onMove);

    const settleNow = () => {
      for (let k = 0; k < px.length; k++) {
        px[k].on = 1;
        px[k].e = 0;
      }
      settled = true;
      render();
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting) && !started) {
          started = true;
          raf = requestAnimationFrame(tick);
          /* if rAF is throttled away (background tab), just show the
             settled print rather than an empty stat */
          setTimeout(() => {
            if (!disposed && !settled && t0 < 0) settleNow();
          }, 600);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    let ro: ResizeObserver | null = null;
    let roT: ReturnType<typeof setTimeout> | null = null;

    document.fonts.ready.then(() => {
      if (disposed) return;
      if (!setup()) return;
      io.observe(cv);
      let lastW = window.innerWidth;
      ro = new ResizeObserver(() => {
        if (window.innerWidth === lastW) return;
        lastW = window.innerWidth;
        if (roT) clearTimeout(roT);
        roT = setTimeout(() => {
          if (!disposed && settled) setup();
        }, 200);
      });
      ro.observe(document.body);
    });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      if (shimmerRaf) cancelAnimationFrame(shimmerRaf);
      cv.removeEventListener('mousemove', onMove);
      io.disconnect();
      if (ro) ro.disconnect();
      if (roT) clearTimeout(roT);
    };
  }, [value]);

  return (
    <span ref={hostRef} style={{ display: 'inline-block', lineHeight: 0 }}>
      <span className="sr-only dot-fallback">{value}</span>
      <canvas ref={cvRef} aria-hidden style={{ display: 'block' }} />
    </span>
  );
}

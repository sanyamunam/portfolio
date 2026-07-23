'use client';

import { useEffect, useRef } from 'react';
import { withBase } from '@/lib/site';

/* The ink self-portrait as a field of pixels — ported from
   theoptimisticdesigner.com's hero portrait, where the cursor paints
   the color back in. Here the illustration waits in ghost gray;
   brushing the cursor across it paints the specimen ink, pixel by
   pixel, and it stays painted. Touch and reduced-motion visitors get
   the fully-painted plate. */

type Px = { x: number; y: number; p: number; e: number };

export default function InkPortrait({ token = 'turquoise' }: { token?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const cv = cvRef.current;
    if (!wrap || !cv) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const interactive = fine && !reduced;

    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const cell = 4;
    let px: Px[] = [];
    let W = 0;
    let H = 0;
    let dpr = 1;
    let raf = 0;
    let disposed = false;

    const img = new Image();
    img.src = withBase('/illustration.svg');

    const render = () => {
      const cs = getComputedStyle(cv);
      const ink = cs.getPropertyValue(`--${token}`).trim();
      const ghost = cs.getPropertyValue('--muted').trim();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const dot = cell * 0.78;
      for (let k = 0; k < px.length; k++) {
        const p = px[k];
        const s = dot * (1 + p.e * 1.2);
        const o = (s - dot) / 2;
        if (p.p) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = ink;
        } else {
          ctx.globalAlpha = 0.34;
          ctx.fillStyle = ghost;
        }
        ctx.fillRect(p.x - o, p.y - o, s, s);
      }
      ctx.globalAlpha = 1;
    };

    const setup = () => {
      W = wrap.clientWidth;
      if (!W) return;
      H = Math.round(W * (434 / 571));
      dpr = window.devicePixelRatio || 1;
      cv.style.height = `${H}px`;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);

      const gw = Math.ceil(W / cell);
      const gh = Math.ceil(H / cell);
      const oc = document.createElement('canvas');
      oc.width = gw;
      oc.height = gh;
      const octx = oc.getContext('2d');
      if (!octx) return;
      octx.clearRect(0, 0, gw, gh);
      octx.drawImage(img, 0, 0, gw, gh);
      const data = octx.getImageData(0, 0, gw, gh).data;

      px = [];
      for (let gy = 0; gy < gh; gy++) {
        for (let gx = 0; gx < gw; gx++) {
          if (data[(gy * gw + gx) * 4 + 3] > 110) {
            px.push({
              x: gx * cell,
              y: gy * cell,
              p: interactive ? 0 : 1,
              e: 0,
            });
          }
        }
      }
      render();
    };

    const tick = () => {
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
      raf = easing ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (ev: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      const hx = ev.clientX - r.left;
      const hy = ev.clientY - r.top;
      const R = Math.max(24, W * 0.06);
      const RR = R * R;
      let hit = false;
      for (let k = 0; k < px.length; k++) {
        const p = px[k];
        if (p.p) continue;
        const dx = p.x - hx;
        const dy = p.y - hy;
        if (dx * dx + dy * dy < RR) {
          p.p = 1;
          p.e = 1;
          hit = true;
        }
      }
      if (hit) {
        render();
        if (!raf) raf = requestAnimationFrame(tick);
      }
    };

    if (interactive) cv.addEventListener('mousemove', onMove);

    /* theme flip repaints with the new resolved inks */
    const mo = new MutationObserver(() => render());
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    let roT: ReturnType<typeof setTimeout> | null = null;
    const ro = new ResizeObserver(() => {
      if (roT) clearTimeout(roT);
      roT = setTimeout(() => {
        if (!disposed && img.complete) setup();
      }, 200);
    });

    img.onload = () => {
      if (disposed) return;
      setup();
      ro.observe(wrap);
    };

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      cv.removeEventListener('mousemove', onMove);
      mo.disconnect();
      ro.disconnect();
      if (roT) clearTimeout(roT);
    };
  }, [token]);

  return (
    <div ref={wrapRef} style={{ width: '100%' }}>
      <canvas
        ref={cvRef}
        role="img"
        aria-label="Ink illustration — the designer at work"
        style={{ display: 'block', width: '100%' }}
      />
    </div>
  );
}

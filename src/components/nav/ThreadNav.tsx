"use client";
import { useEffect, useRef, useState } from "react";
import type Lenis from "lenis";
import { BEATS } from "@/content/content";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { proximity } from "@/lib/cursor";

/**
 * A fine vertical thread at the right edge with seven nodes (spec §7).
 * Programmatic jumps go through Lenis (V2 lesson: native smooth scrollTo
 * fights Lenis's rAF loop; lenis.scrollTo is reliable).
 */
export function ThreadNav() {
  const [active, setActive] = useState<string>(BEATS[0].id);
  const reduce = useReducedMotionSafe();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    for (const b of BEATS) {
      const el = document.getElementById(b.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const clear = () =>
      listRef.current
        ?.querySelectorAll<HTMLElement>("[data-node]")
        .forEach((el) => el.style.setProperty("--glow", "0"));
    let wasNear = false;
    const onMove = (e: PointerEvent) => {
      const near = e.clientX >= window.innerWidth - 160;
      if (!near) {
        if (wasNear) clear();
        wasNear = false;
        return;
      }
      wasNear = true;
      listRef.current?.querySelectorAll<HTMLElement>("[data-node]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const d = Math.hypot(
          e.clientX - (r.left + r.width / 2),
          e.clientY - (r.top + r.height / 2)
        );
        el.style.setProperty("--glow", String(proximity(d, 120)));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      clear();
    };
  }, [reduce]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) {
      lenis.scrollTo(el, { duration: 1.2 });
      return;
    }
    // Lenis is absent exactly when prefers-reduced-motion disabled it (see
    // SmoothScroll) — so this fallback must not animate for those users.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView(reduce ? undefined : { behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Conversation"
      className="fixed right-5 top-1/2 z-10 hidden -translate-y-1/2 md:block"
    >
      <ul
        ref={listRef}
        className="relative flex flex-col items-center gap-5 before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-[var(--edge)]"
      >
        {BEATS.map((b) => {
          const current = active === b.id;
          return (
            <li key={b.id} className="group relative">
              <button
                type="button"
                onClick={() => go(b.id)}
                aria-label={b.label}
                aria-current={current ? "true" : undefined}
                data-cursor="nav"
                className="pressable relative block size-6 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <span
                  data-node
                  className={`nav-dot absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
                    current
                      ? "size-2.5 bg-[var(--accent)]"
                      : "size-1.5 bg-[var(--muted)] group-hover:size-2"
                  }`}
                />
              </button>
              <span className="pointer-events-none absolute right-7 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                {b.label}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

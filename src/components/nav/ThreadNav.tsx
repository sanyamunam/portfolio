"use client";
import { useEffect, useState } from "react";
import type Lenis from "lenis";
import { BEATS } from "@/content/content";

/**
 * A fine vertical thread at the right edge with seven nodes (spec §7).
 * Programmatic jumps go through Lenis (V2 lesson: native smooth scrollTo
 * fights Lenis's rAF loop; lenis.scrollTo is reliable).
 */
export function ThreadNav() {
  const [active, setActive] = useState<string>(BEATS[0].id);

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

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(el, { duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Conversation"
      className="fixed right-5 top-1/2 z-10 hidden -translate-y-1/2 md:block"
    >
      <ul className="relative flex flex-col items-center gap-5 before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-[var(--edge)]">
        {BEATS.map((b) => {
          const current = active === b.id;
          return (
            <li key={b.id} className="group relative">
              <button
                type="button"
                onClick={() => go(b.id)}
                aria-label={b.label}
                aria-current={current ? "true" : undefined}
                className="pressable relative block size-4 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <span
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
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

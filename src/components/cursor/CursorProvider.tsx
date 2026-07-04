"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useMotionValue } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import {
  CursorContext,
  type CursorKind,
  type CursorMode,
  type CursorTarget,
} from "@/lib/cursor";
import { EmberCursor } from "./EmberCursor";
import { LensCursor } from "./LensCursor";
import { CursorToggle } from "./CursorToggle";

const FINE_QUERY = "(hover: hover) and (pointer: fine)";

/*
 * Cursor mode lives in localStorage and is read via useSyncExternalStore
 * (same SSR-safe pattern as useReducedMotionSafe) — the lint rule forbids
 * the setState-in-effect alternative. Server/hydration snapshot is "ember";
 * a saved "lens" preference applies right after hydration, mismatch-free.
 */
const MODE_KEY = "cursor-mode";
const modeListeners = new Set<() => void>();
function subscribeMode(onChange: () => void) {
  modeListeners.add(onChange);
  // Cross-tab sync for free.
  window.addEventListener("storage", onChange);
  return () => {
    modeListeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}
function readMode(): CursorMode {
  // Chrome throws on ANY localStorage access when cookies are blocked, and
  // this runs during render (useSyncExternalStore snapshot) — never throw.
  try {
    return localStorage.getItem(MODE_KEY) === "lens" ? "lens" : "ember";
  } catch {
    return "ember";
  }
}
function writeMode(m: CursorMode) {
  try {
    localStorage.setItem(MODE_KEY, m);
  } catch {
    // Storage blocked — the mode just won't persist across reloads.
  }
  modeListeners.forEach((cb) => cb());
}

export function CursorProvider() {
  const reduce = useReducedMotionSafe();
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(FINE_QUERY);
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const active = fine && !reduce;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const pressed = useMotionValue(0);
  const visible = useMotionValue(0);
  const [target, setTarget] = useState<CursorTarget>(null);
  const lastEl = useRef<Element | null>(null);

  const mode = useSyncExternalStore<CursorMode>(
    subscribeMode,
    readMode,
    () => "ember"
  );
  const setMode = writeMode;

  // Ember hides the native cursor; lens keeps it.
  useEffect(() => {
    const on = active && mode === "ember";
    document.documentElement.classList.toggle("cursor-hidden", on);
    return () => document.documentElement.classList.remove("cursor-hidden");
  }, [active, mode]);

  useEffect(() => {
    if (!active) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      visible.set(1);
    };
    const onDown = () => pressed.set(1);
    const onUp = () => pressed.set(0);
    // Delegated target detection — fires on element boundaries, not per move.
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-cursor]") ?? null;
      if (el === lastEl.current) return;
      lastEl.current = el;
      if (!el) {
        setTarget(null);
        return;
      }
      const d = (el as HTMLElement).dataset;
      setTarget({
        kind: (d.cursor as CursorKind) ?? "default",
        label: d.cursorLabel,
        rect: el.getBoundingClientRect(),
      });
    };
    const onOut = (e: PointerEvent) => {
      // relatedTarget null = pointer left the window: hide the bead AND drop
      // the target so the label chip doesn't linger at the exit point.
      if (e.relatedTarget === null) {
        visible.set(0);
        lastEl.current = null;
        setTarget(null);
      }
    };
    // Lenis scrolls the page under a stationary pointer — no pointer events
    // fire, but the target's viewport rect moves. Re-measure so the soft-snap
    // pull (worst for absorb, pull=1) never aims at a phantom point. This is
    // a scroll-frame setTarget, not a pointermove one.
    const onScroll = () => {
      const el = lastEl.current;
      if (!el) return;
      const d = (el as HTMLElement).dataset;
      // Rect is only consumed by snap/absorb kinds (nonzero pull) —
      // case/play/art must not re-render the cursor subtree per scroll frame.
      const kind = d.cursor;
      if (kind !== "link" && kind !== "nav" && kind !== "absorb") return;
      setTarget({
        kind: (d.cursor as CursorKind) ?? "default",
        label: d.cursorLabel,
        rect: el.getBoundingClientRect(),
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      lastEl.current = null;
      setTarget(null);
    };
  }, [active, x, y, pressed, visible]);

  if (!active) return null;

  return (
    <CursorContext.Provider value={{ x, y, pressed, visible, target, mode, setMode }}>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
        {mode === "ember" ? <EmberCursor /> : <LensCursor />}
      </div>
      <CursorToggle />
    </CursorContext.Provider>
  );
}

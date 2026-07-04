"use client";
import { useCursor, type CursorMode } from "@/lib/cursor";

const MODES: CursorMode[] = ["ember", "lens"];

/** Temporary evaluation affordance — deleted once Sanya picks a winner. */
export function CursorToggle() {
  const { mode, setMode } = useCursor();
  return (
    <div
      role="group"
      aria-label="Cursor style (preview)"
      className="glass fixed bottom-5 left-5 z-[60] hidden items-center gap-1 !rounded-full p-1 md:flex"
    >
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          data-cursor="link"
          aria-pressed={mode === m}
          onClick={() => setMode(m)}
          className={`pressable rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
            mode === m ? "bg-[var(--edge)] text-ink" : "text-muted"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

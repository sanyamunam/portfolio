"use client";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { useCursor } from "@/lib/cursor";
import { EASE } from "@/lib/motion";

/** Small glass chip trailing the pointer whenever the target carries a label. */
export function CursorLabel() {
  const { x, y, target } = useCursor();
  const sx = useSpring(x, { stiffness: 400, damping: 35 });
  const sy = useSpring(y, { stiffness: 400, damping: 35 });

  return (
    <AnimatePresence>
      {target?.label ? (
        <motion.div
          key={target.label}
          className="absolute left-0 top-0"
          style={{ x: sx, y: sy }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          transition={{ duration: 0.16, ease: EASE }}
        >
          {/* SR-safe only because CursorProvider unmounts entirely when inactive — keep label rendering inside the provider. */}
          <motion.span
            initial={{ y: 4 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.16, ease: EASE }}
            className="glass block translate-x-[18px] translate-y-[18px] whitespace-nowrap !rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-ink"
          >
            {target.label}
          </motion.span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

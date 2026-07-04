"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function Typewriter({ phrases }: { phrases: string[] }) {
  const reduce = useReducedMotion();
  const [pi, setPi] = useState(0);
  const [len, setLen] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const full = phrases[pi];
    const t = setTimeout(
      () => {
        if (!deleting) {
          if (len < full.length) setLen(len + 1);
          else setTimeout(() => setDeleting(true), 1600);
        } else if (len > 0) setLen(len - 1);
        else {
          setDeleting(false);
          setPi((pi + 1) % phrases.length);
        }
      },
      deleting ? 22 : 45
    );
    return () => clearTimeout(t);
  }, [len, deleting, pi, phrases, reduce]);

  if (reduce) return <span className="text-xs text-muted">{phrases[0]}</span>;
  return (
    <span className="text-xs text-muted">
      {phrases[pi].slice(0, len)}
      <span className="animate-pulse">▍</span>
    </span>
  );
}

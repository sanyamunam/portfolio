"use client";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { EASE } from "@/lib/motion";

/**
 * The interviewer's voice — words arrive one by one, like the question is
 * being asked, not printed. Children must be a plain string (all copy comes
 * from content.ts).
 */
export function QuestionHeading({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const reduce = useReducedMotionSafe();
  const words = children.split(" ");
  return (
    <motion.h2
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: reduce ? 0 : 0.07 }}
      className={`font-display text-4xl leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl ${className}`}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="inline-block whitespace-pre"
          variants={{
            hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 26, filter: "blur(6px)" },
            shown: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.55, ease: EASE },
            },
          }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.h2>
  );
}

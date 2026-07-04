"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";

/** The interviewer's voice. Large Bricolage, blur-rise entrance. */
export function QuestionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.h2
      initial={
        reduce ? { opacity: 0 } : { opacity: 0, y: 44, filter: "blur(8px)" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, ease: EASE }}
      className={`font-display text-4xl leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl ${className}`}
    >
      {children}
    </motion.h2>
  );
}

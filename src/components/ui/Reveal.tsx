"use client";

/**
 * Scroll-reveal primitives built on Framer Motion's in-view detection.
 *
 *   <Reveal>            — a single element that fades + rises when scrolled into
 *                         view (once).
 *   <Stagger><StaggerItem/>…  — a container whose children enter in sequence.
 *
 * All three collapse to a plain, fully-visible element when the user prefers
 * reduced motion, so nothing depends on animation to be readable.
 */

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, fadeUpSm, staggerContainer } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Override the default fade-up variant. */
  variants?: Variants;
  /** Fraction of the element that must be visible before it animates (0–1). */
  amount?: number;
  /** Delay before the entrance, seconds. */
  delay?: number;
}

export function Reveal({
  children,
  className,
  variants = fadeUp,
  amount = 0.2,
  delay = 0,
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** Seconds between each child's entrance. */
  stagger?: number;
  delay?: number;
  amount?: number;
}

export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  amount = 0.2,
}: StaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

/** A child of <Stagger>. Inherits the container's hidden/visible state. */
export function StaggerItem({
  children,
  className,
  variants = fadeUpSm,
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

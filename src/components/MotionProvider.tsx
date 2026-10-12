"use client";

import { MotionConfig } from "motion/react";

// Schaltet für alle Motion-Animationen „Bewegung reduzieren“ des Betriebssystems ein.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

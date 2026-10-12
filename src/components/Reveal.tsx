"use client";

import { motion, useReducedMotion } from "motion/react";

// Sanftes Einblenden: 12 px nach oben und von 0 auf 100 % Deckkraft, 0,5 s.
// Die Bewegung läuft einmal, sobald das Element im Bild ist, und nie in Schleife.
// Mit „Bewegung reduzieren“ ist alles sofort da.
const VON = { opacity: 0, y: 12 };
const NACH = { opacity: 1, y: 0 };
const ZEIT = 0.5;
const EASE = [0.2, 0, 0, 1] as const;

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

// Der Ausgangszustand ist auf Server und Browser gleich (sonst Hydration-Fehler).
// Mit „Bewegung reduzieren“ springt das Element sofort, ohne Dauer, auf sichtbar.
function useAnimation(delay: number) {
  const reduziert = useReducedMotion();
  if (reduziert) {
    return { initial: VON, animate: NACH, transition: { duration: 0 } } as const;
  }
  return {
    initial: VON,
    whileInView: NACH,
    viewport: { once: true, amount: 0.1 },
    transition: { duration: ZEIT, ease: EASE, delay },
  } as const;
}

export function Reveal({ children, className, delay = 0 }: Props) {
  return (
    <motion.div className={className} {...useAnimation(delay)}>
      {children}
    </motion.div>
  );
}

type SectionProps = Props & { id?: string; "aria-labelledby"?: string };

export function RevealSection({ children, className, delay = 0, ...rest }: SectionProps) {
  return (
    <motion.section className={className} {...rest} {...useAnimation(delay)}>
      {children}
    </motion.section>
  );
}

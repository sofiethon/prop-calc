"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

// Sanftes Einblenden: 12 px nach oben und von 0 auf 100 % Deckkraft, 0,5 s.
// Die Bewegung läuft einmal, sobald das Element im Bild ist, und nie in Schleife.
// Mit „Bewegung reduzieren“ blendet es nur ein, ohne Verschiebung.
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
// Mit „Bewegung reduzieren“ lässt MotionConfig die Verschiebung weg, das Einblenden bleibt.
function useAnimation(delay: number) {
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

// Ein Abschnitt blendet erst ein, wenn seine Überschrift beim Scrollen sichtbar wird.
export function RevealSection({ children, className, delay = 0, ...rest }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [sichtbar, setSichtbar] = useState(false);

  useEffect(() => {
    const ziel = ref.current?.querySelector("h1, h2, h3") ?? ref.current;
    if (!ziel) return;
    const beobachter = new IntersectionObserver(
      ([eintrag]) => {
        if (eintrag.isIntersecting) {
          setSichtbar(true);
          beobachter.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    beobachter.observe(ziel);
    return () => beobachter.disconnect();
  }, []);

  return (
    <motion.section
      ref={ref}
      className={className}
      {...rest}
      initial={VON}
      animate={sichtbar ? NACH : VON}
      transition={{ duration: ZEIT, ease: EASE, delay }}
    >
      {children}
    </motion.section>
  );
}

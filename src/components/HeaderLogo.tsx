"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Auf der Startseite zeigt der Hero schon den Namen: Das Logo im Header erscheint erst,
// wenn der Hero (id="hero") aus dem Bild ist. Es bleibt im Layout, damit nichts springt.
// Auf allen anderen Seiten ist es immer sichtbar.
export default function HeaderLogo({ children }: { children: React.ReactNode }) {
  const aufStartseite = usePathname() === "/";
  const [heroSichtbar, setHeroSichtbar] = useState(true);

  useEffect(() => {
    if (!aufStartseite) return;
    const hero = document.getElementById("hero");
    if (!hero) return;
    const beobachter = new IntersectionObserver(([eintrag]) => setHeroSichtbar(eintrag.isIntersecting));
    beobachter.observe(hero);
    return () => beobachter.disconnect();
  }, [aufStartseite]);

  const versteckt = aufStartseite && heroSichtbar;

  return (
    <div
      className={`transition-opacity duration-300 ${versteckt ? "invisible opacity-0" : "visible opacity-100"}`}
    >
      {children}
    </div>
  );
}

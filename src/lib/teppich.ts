/** Gängige Teppichgrößen (lange Seite × kurze Seite) in Zentimetern, aufsteigend. */
const STANDARDGROESSEN = [
  { lang: 230, kurz: 160 },
  { lang: 300, kurz: 200 },
  { lang: 340, kurz: 240 },
] as const;

/** Der Teppich soll auf jeder Seite des Sofas etwa 15 cm (6 Zoll) überstehen. */
export const UEBERSTAND_CM = 15;
/** Annahme von prop-calc (keine Norm): so viel Boden bleibt zwischen Teppich und Wand frei. */
export const WANDABSTAND_CM = 20;
/** Annahme von prop-calc (keine Norm): so weit ragt der Teppich vor dem Sofa in den Raum. */
export const VORNE_CM = 40;

export const TEPPICH_REGEL =
  "The rug extends about 15 cm (6 in) beyond the sofa on both sides and lies at least under the front sofa feet, so that sofa and rug read as one unit.";
export const TEPPICH_QUELLE = {
  name: "Houzz: „11 Area Rug Rules and How to Break Them“ (design principle)",
  url: "https://www.houzz.com/magazine/11-area-rug-rules-and-how-to-break-them-stsetivw-vs~222609",
};

export type TeppichErgebnis =
  | { art: "groesse"; lang: number; kurz: number; mindestBreite: number; mindestTiefe: number; verhaeltnis: number }
  | { art: "hinweis"; grund: string };

/**
 * Empfiehlt die kleinste Standardgröße, die zum Sofa passt und noch in den Raum hineinpasst.
 * Die lange Teppichseite liegt parallel zum Sofa.
 */
export function empfehleTeppich(
  raumLaenge: number,
  raumBreite: number,
  sofaBreite: number,
  sofaTiefe: number,
): TeppichErgebnis {
  const mindestBreite = sofaBreite + 2 * UEBERSTAND_CM;
  // Vordere Füße stehen etwa auf halber Sofatiefe; davor ragt der Teppich noch VORNE_CM in den Raum.
  const mindestTiefe = Math.ceil(sofaTiefe / 2 + VORNE_CM);
  const platzLang = Math.max(raumLaenge, raumBreite) - 2 * WANDABSTAND_CM;
  const platzKurz = Math.min(raumLaenge, raumBreite) - 2 * WANDABSTAND_CM;

  const passendZumSofa = STANDARDGROESSEN.filter((g) => g.lang >= mindestBreite && g.kurz >= mindestTiefe);
  if (passendZumSofa.length === 0) {
    return {
      art: "hinweis",
      grund: `The sofa needs a rug of at least ${mindestBreite} × ${mindestTiefe} cm. That is larger than the common standard sizes, so only a custom-made rug would work.`,
    };
  }
  const treffer = passendZumSofa.find((g) => g.lang <= platzLang && g.kurz <= platzKurz);
  if (!treffer) {
    const kleinste = passendZumSofa[0];
    return {
      art: "hinweis",
      grund: `The room is too small: for this sofa the rug needs at least ${kleinste.lang} × ${kleinste.kurz} cm. With ${WANDABSTAND_CM} cm clearance to the walls, only ${Math.max(platzLang, 0)} × ${Math.max(platzKurz, 0)} cm are available.`,
    };
  }
  return {
    art: "groesse",
    lang: treffer.lang,
    kurz: treffer.kurz,
    mindestBreite,
    mindestTiefe,
    verhaeltnis: treffer.lang / sofaBreite,
  };
}

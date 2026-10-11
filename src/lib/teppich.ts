/** Gängige Teppichgrößen (lange Seite × kurze Seite) in Zentimetern, aufsteigend. */
const STANDARDGROESSEN = [
  { lang: 230, kurz: 160 },
  { lang: 300, kurz: 200 },
  { lang: 340, kurz: 240 },
] as const;

/** Der Teppich soll auf jeder Seite des Sofas etwa 15 cm (6 Zoll) überstehen. */
export const UEBERSTAND_CM = 15;
/** Annahme von Proportio (keine Norm): so viel Boden bleibt zwischen Teppich und Wand frei. */
export const WANDABSTAND_CM = 20;
/** Annahme von Proportio (keine Norm): so weit ragt der Teppich vor dem Sofa in den Raum. */
export const VORNE_CM = 40;

export const TEPPICH_REGEL =
  "Der Teppich ragt auf beiden Seiten etwa 15 cm (6 Zoll) über das Sofa hinaus und liegt mindestens unter den vorderen Sofafüßen, damit Sofa und Teppich als eine Einheit wirken.";
export const TEPPICH_QUELLE = {
  name: "Houzz: „11 Area Rug Rules and How to Break Them“ (Designprinzip)",
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
      grund: `Das Sofa braucht einen Teppich von mindestens ${mindestBreite} × ${mindestTiefe} cm. Das ist größer als die gängigen Standardgrößen – hier käme nur eine Maßanfertigung infrage.`,
    };
  }
  const treffer = passendZumSofa.find((g) => g.lang <= platzLang && g.kurz <= platzKurz);
  if (!treffer) {
    const kleinste = passendZumSofa[0];
    return {
      art: "hinweis",
      grund: `Der Raum ist zu klein: Für dieses Sofa braucht der Teppich mindestens ${kleinste.lang} × ${kleinste.kurz} cm. Mit ${WANDABSTAND_CM} cm Abstand zur Wand stehen nur ${Math.max(platzLang, 0)} × ${Math.max(platzKurz, 0)} cm zur Verfügung.`,
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

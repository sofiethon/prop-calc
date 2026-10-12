import { UEBERSTAND_CM, VORNE_CM, WANDABSTAND_CM } from "@/lib/teppich";

/** Annahme von prop-calc (keine Norm): bis so viele cm neben dem Richtwert gilt ein Maß noch als „grenzwertig“. */
export const TOLERANZ_CM = 10;
/** Quellen nennen für den Überstand der Stange 3 bis 6 Zoll je Seite; wir runden auf 8 bis 15 cm. */
export const STANGE_UEBERSTAND_MIN_CM = 8;
export const STANGE_UEBERSTAND_MAX_CM = 15;

export type Stufe = "passt" | "grenzwertig" | "zu klein" | "zu groß";

export type Bewertung = { stufe: Stufe; grund: string };

function cm(n: number) {
  return n.toLocaleString("en-GB", { maximumFractionDigits: 1 });
}

/**
 * Bewertet einen vorhandenen Teppich. Die längere Seite liegt parallel zum Sofa.
 * Zu groß heißt: er passt mit 20 cm Wandabstand nicht in den Raum; zu klein: er unterschreitet
 * Sofabreite + 2 × 15 cm oder die Tiefe bis 40 cm vor die vorderen Sofafüße.
 */
export function bewerteTeppich(
  seiteA: number,
  seiteB: number,
  raumLaenge: number,
  raumBreite: number,
  sofaBreite: number,
  sofaTiefe: number,
): Bewertung {
  const lang = Math.max(seiteA, seiteB);
  const kurz = Math.min(seiteA, seiteB);
  const mindestBreite = sofaBreite + 2 * UEBERSTAND_CM;
  const mindestTiefe = Math.ceil(sofaTiefe / 2 + VORNE_CM);
  const platzLang = Math.max(raumLaenge, raumBreite) - 2 * WANDABSTAND_CM;
  const platzKurz = Math.min(raumLaenge, raumBreite) - 2 * WANDABSTAND_CM;

  const zuvielLang = lang - platzLang;
  const zuvielKurz = kurz - platzKurz;
  const zuwenigLang = mindestBreite - lang;
  const zuwenigKurz = mindestTiefe - kurz;

  const platzText = `With ${WANDABSTAND_CM} cm clearance to the walls, the room offers ${cm(Math.max(platzLang, 0))} × ${cm(Math.max(platzKurz, 0))} cm.`;
  const sofaText = `The sofa needs at least ${cm(mindestBreite)} × ${cm(mindestTiefe)} cm.`;

  if (Math.max(zuvielLang, zuvielKurz) > TOLERANZ_CM) {
    return { stufe: "zu groß", grund: `The rug (${cm(lang)} × ${cm(kurz)} cm) is too large for the room. ${platzText}` };
  }
  if (Math.max(zuwenigLang, zuwenigKurz) > TOLERANZ_CM) {
    return { stufe: "zu klein", grund: `The rug (${cm(lang)} × ${cm(kurz)} cm) is too small for the sofa. ${sofaText}` };
  }
  if (Math.max(zuvielLang, zuvielKurz) > 0) {
    return {
      stufe: "grenzwertig",
      grund: `The rug (${cm(lang)} × ${cm(kurz)} cm) leaves less than ${WANDABSTAND_CM} cm to the wall. ${platzText}`,
    };
  }
  if (Math.max(zuwenigLang, zuwenigKurz) > 0) {
    return {
      stufe: "grenzwertig",
      grund: `The rug (${cm(lang)} × ${cm(kurz)} cm) is just under the guideline for the sofa. ${sofaText}`,
    };
  }
  return {
    stufe: "passt",
    grund: `The rug (${cm(lang)} × ${cm(kurz)} cm) covers the sofa and leaves room to the wall. ${sofaText}`,
  };
}

/** Bewertet die Breite einer vorhandenen Vorhangstange für ein Fenster. */
export function bewerteStange(stangeBreite: number, fensterBreite: number): Bewertung {
  const von = fensterBreite + 2 * STANGE_UEBERSTAND_MIN_CM;
  const bis = fensterBreite + 2 * STANGE_UEBERSTAND_MAX_CM;
  const richtwert = `For this window (${cm(fensterBreite)} cm wide), ${cm(von)} to ${cm(bis)} cm would be right.`;

  if (stangeBreite < von - TOLERANZ_CM) {
    return { stufe: "zu klein", grund: `The rod (${cm(stangeBreite)} cm) is too short, the curtain would cover the window. ${richtwert}` };
  }
  if (stangeBreite > bis + TOLERANZ_CM) {
    return { stufe: "zu groß", grund: `The rod (${cm(stangeBreite)} cm) is much wider than needed. ${richtwert}` };
  }
  if (stangeBreite < von) {
    return { stufe: "grenzwertig", grund: `The rod (${cm(stangeBreite)} cm) is a little short. ${richtwert}` };
  }
  if (stangeBreite > bis) {
    return { stufe: "grenzwertig", grund: `The rod (${cm(stangeBreite)} cm) is a little long. ${richtwert}` };
  }
  return { stufe: "passt", grund: `The rod (${cm(stangeBreite)} cm) is within the recommended range. ${richtwert}` };
}

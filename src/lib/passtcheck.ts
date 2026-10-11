import { UEBERSTAND_CM, VORNE_CM, WANDABSTAND_CM } from "@/lib/teppich";

/** Annahme von Proportio (keine Norm): bis so viele cm neben dem Richtwert gilt ein Maß noch als „grenzwertig“. */
export const TOLERANZ_CM = 10;
/** Quellen nennen für den Überstand der Stange 3 bis 6 Zoll je Seite; wir runden auf 8 bis 15 cm. */
export const STANGE_UEBERSTAND_MIN_CM = 8;
export const STANGE_UEBERSTAND_MAX_CM = 15;

export type Stufe = "passt" | "grenzwertig" | "zu klein" | "zu groß";

export type Bewertung = { stufe: Stufe; grund: string };

function cm(n: number) {
  return n.toLocaleString("de-DE", { maximumFractionDigits: 1 });
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

  const platzText = `Im Raum stehen mit ${WANDABSTAND_CM} cm Wandabstand ${cm(Math.max(platzLang, 0))} × ${cm(Math.max(platzKurz, 0))} cm zur Verfügung.`;
  const sofaText = `Das Sofa braucht mindestens ${cm(mindestBreite)} × ${cm(mindestTiefe)} cm.`;

  if (Math.max(zuvielLang, zuvielKurz) > TOLERANZ_CM) {
    return { stufe: "zu groß", grund: `Der Teppich (${cm(lang)} × ${cm(kurz)} cm) ist für den Raum zu groß. ${platzText}` };
  }
  if (Math.max(zuwenigLang, zuwenigKurz) > TOLERANZ_CM) {
    return { stufe: "zu klein", grund: `Der Teppich (${cm(lang)} × ${cm(kurz)} cm) ist für das Sofa zu klein. ${sofaText}` };
  }
  if (Math.max(zuvielLang, zuvielKurz) > 0) {
    return {
      stufe: "grenzwertig",
      grund: `Der Teppich (${cm(lang)} × ${cm(kurz)} cm) lässt weniger als ${WANDABSTAND_CM} cm Abstand zur Wand. ${platzText}`,
    };
  }
  if (Math.max(zuwenigLang, zuwenigKurz) > 0) {
    return {
      stufe: "grenzwertig",
      grund: `Der Teppich (${cm(lang)} × ${cm(kurz)} cm) ist knapp unter dem Richtwert für das Sofa. ${sofaText}`,
    };
  }
  return {
    stufe: "passt",
    grund: `Der Teppich (${cm(lang)} × ${cm(kurz)} cm) deckt das Sofa ab und lässt Platz zur Wand. ${sofaText}`,
  };
}

/** Bewertet die Breite einer vorhandenen Vorhangstange für ein Fenster. */
export function bewerteStange(stangeBreite: number, fensterBreite: number): Bewertung {
  const von = fensterBreite + 2 * STANGE_UEBERSTAND_MIN_CM;
  const bis = fensterBreite + 2 * STANGE_UEBERSTAND_MAX_CM;
  const richtwert = `Für dieses Fenster (${cm(fensterBreite)} cm breit) wären ${cm(von)} bis ${cm(bis)} cm richtig.`;

  if (stangeBreite < von - TOLERANZ_CM) {
    return { stufe: "zu klein", grund: `Die Stange (${cm(stangeBreite)} cm) ist zu kurz, der Vorhang würde das Fenster verdecken. ${richtwert}` };
  }
  if (stangeBreite > bis + TOLERANZ_CM) {
    return { stufe: "zu groß", grund: `Die Stange (${cm(stangeBreite)} cm) ist deutlich breiter als nötig. ${richtwert}` };
  }
  if (stangeBreite < von) {
    return { stufe: "grenzwertig", grund: `Die Stange (${cm(stangeBreite)} cm) ist etwas kurz. ${richtwert}` };
  }
  if (stangeBreite > bis) {
    return { stufe: "grenzwertig", grund: `Die Stange (${cm(stangeBreite)} cm) ist etwas lang. ${richtwert}` };
  }
  return { stufe: "passt", grund: `Die Stange (${cm(stangeBreite)} cm) liegt im empfohlenen Bereich. ${richtwert}` };
}

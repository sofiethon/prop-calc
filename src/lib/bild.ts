/** Das Bild ist etwa zwei Drittel bis drei Viertel so breit wie das Sofa. */
export const BILD_MIN_ANTEIL = 2 / 3;
export const BILD_MAX_ANTEIL = 3 / 4;
/** Die Unterkante hängt etwa 20 cm (8 Zoll) über der Sofalehne. */
export const BILD_ABSTAND_SOFA_CM = 20;

export const BILD_REGEL =
  "Das Bild ist zwei Drittel bis drei Viertel so breit wie das Sofa, hängt mittig darüber und seine Unterkante liegt etwa 20 cm (8 Zoll) über der Sofalehne, damit Sofa und Bild als eine Gruppe wirken.";
export const BILD_QUELLE = {
  name: "Fine Art America: „How High to Hang Art Above a Sofa“ (Designprinzip)",
  url: "https://blog.fineartamerica.com/how-high-to-hang-art-above-a-sofa/",
};

export type BildErgebnis =
  | { art: "bild"; breiteVon: number; breiteBis: number; hangHoehe: number; platzBisDecke: number }
  | { art: "hinweis"; grund: string };

/**
 * Bildbreite (Bereich) und Höhe der Bildunterkante über dem Boden.
 * Die Sofahöhe gilt als Höhe der Lehne.
 */
export function empfehleBild(sofaBreite: number, sofaHoehe: number, deckenHoehe: number): BildErgebnis {
  const hangHoehe = sofaHoehe + BILD_ABSTAND_SOFA_CM;
  if (hangHoehe >= deckenHoehe) {
    return {
      art: "hinweis",
      grund: `Über dem Sofa ist kein Platz für ein Bild: Die Unterkante läge bei ${hangHoehe} cm (Sofa ${sofaHoehe} cm + ${BILD_ABSTAND_SOFA_CM} cm Abstand), die Decke ist aber nur ${deckenHoehe} cm hoch.`,
    };
  }
  return {
    art: "bild",
    breiteVon: Math.round(sofaBreite * BILD_MIN_ANTEIL),
    breiteBis: Math.round(sofaBreite * BILD_MAX_ANTEIL),
    hangHoehe,
    platzBisDecke: deckenHoehe - hangHoehe,
  };
}

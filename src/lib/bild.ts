/** Das Bild ist etwa zwei Drittel bis drei Viertel so breit wie das Sofa. */
export const BILD_MIN_ANTEIL = 2 / 3;
export const BILD_MAX_ANTEIL = 3 / 4;
/** Die Unterkante hängt etwa 20 cm (8 Zoll) über der Sofalehne. */
export const BILD_ABSTAND_SOFA_CM = 20;

export const BILD_REGEL =
  "The picture is two thirds to three quarters as wide as the sofa, hangs centred above it and its lower edge sits about 20 cm (8 in) above the sofa back, so that sofa and picture read as one group.";
export const BILD_QUELLE = {
  name: "Fine Art America: „How High to Hang Art Above a Sofa“ (design principle)",
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
      grund: `There is no room for a picture above the sofa: the lower edge would be at ${hangHoehe} cm (sofa ${sofaHoehe} cm + ${BILD_ABSTAND_SOFA_CM} cm gap), but the ceiling is only ${deckenHoehe} cm high.`,
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

/** Abstand Sofakante–Couchtisch: 16 bis 18 Zoll. */
export const COUCHTISCH_VON_CM = 41;
export const COUCHTISCH_BIS_CM = 46;
/** Abstand Sofa–Fernseher: 2,75-mal die Breite des Fernsehers. */
export const FERNSEHER_FAKTOR = 2.75;
/** Breite eines Wegs durch den Raum: 36 Zoll. */
export const LAUFWEG_MIN_CM = 91;

export const ABSTAENDE_REGEL =
  "Zwischen Sofa und Couchtisch bleiben 16 bis 18 Zoll (41 bis 46 cm), der Fernseher steht etwa das 2,75-Fache seiner Breite vom Sofa entfernt, und ein Weg durch den Raum ist mindestens 36 Zoll (91 cm) breit.";
export const ABSTAENDE_QUELLE = {
  name: "Houzz: „How Much Space You Need (and What to Do if You Don’t Have It)“ (Designprinzip)",
  url: "https://www.houzz.com/magazine/how-much-space-you-need-and-what-to-do-if-you-dont-have-it-stsetivw-vs~95713633",
};

export type AbstaendeErgebnis = {
  couchtisch: { von: number; bis: number };
  /** Empfohlener Abstand Sofa–Fernseher in cm, oder null ohne Fernseher. */
  fernseher: number | null;
  /** Der empfohlene Fernsehabstand passt nicht mehr hinter das Sofa in den Raum. */
  fernseherZuWeit: boolean;
  /** Frei bleibender Weg vor dem Sofa (hinter dem Couchtisch), in cm; null ohne Raum. */
  laufweg: { frei: number; fehlt: number; platzVorSofa: number; ohneTischtiefe: boolean } | null;
};

/**
 * Annahme von Proportio: Das Sofa steht mit dem Rücken an einer Wand der langen Seite,
 * davor liegt die kurze Raumseite. Vom Platz davor gehen Sofatiefe, Abstand zum Couchtisch
 * (kleinster empfohlener Wert) und Tischtiefe ab; der Rest ist der Laufweg.
 */
export function empfehleAbstaende(
  raum: { laenge: number; breite: number } | null,
  sofaTiefe: number,
  couchtischTiefe: number | null,
  couchtischVorhanden: boolean,
  fernseherBreite: number | null,
): AbstaendeErgebnis {
  const fernseher = fernseherBreite === null ? null : Math.round(fernseherBreite * FERNSEHER_FAKTOR);
  let laufweg: AbstaendeErgebnis["laufweg"] = null;
  let fernseherZuWeit = false;
  if (raum) {
    const platzVorSofa = Math.min(raum.laenge, raum.breite) - sofaTiefe;
    const belegt = couchtischVorhanden ? COUCHTISCH_VON_CM + (couchtischTiefe ?? 0) : 0;
    const frei = platzVorSofa - belegt;
    laufweg = {
      frei,
      fehlt: Math.max(0, LAUFWEG_MIN_CM - frei),
      platzVorSofa,
      ohneTischtiefe: couchtischVorhanden && couchtischTiefe === null,
    };
    if (fernseher !== null) {
      fernseherZuWeit = fernseher > Math.max(raum.laenge, raum.breite) - sofaTiefe;
    }
  }
  return {
    couchtisch: { von: COUCHTISCH_VON_CM, bis: COUCHTISCH_BIS_CM },
    fernseher,
    fernseherZuWeit,
    laufweg,
  };
}

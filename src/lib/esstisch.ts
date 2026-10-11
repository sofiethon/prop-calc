/** Freiraum zwischen Tischkante und Wand oder Möbel: mindestens 36 Zoll. */
export const PLATZ_MIN_CM = 90;
/** Mit Durchgang hinter den Stühlen: 42 bis 48 Zoll (gerundet). */
export const PLATZ_DURCHGANG_VON_CM = 105;
export const PLATZ_DURCHGANG_BIS_CM = 120;
/** Tischkante je Person: 24 bis 30 Zoll (gerundet auf 60 bis 75 cm). */
export const PERSON_VON_CM = 60;
export const PERSON_BIS_CM = 75;
/** Leuchte: Unterkante 30 bis 36 Zoll über der Tischplatte (bei 2,40 m Decke). */
export const LEUCHTE_HOEHE_VON_CM = 76;
export const LEUCHTE_HOEHE_BIS_CM = 91;
/** Je 30 cm Deckenhöhe über 2,40 m kommen etwa 7,5 cm (3 Zoll) dazu. */
export const LEUCHTE_BASIS_DECKE_CM = 240;
export const LEUCHTE_ZUSCHLAG_JE_30_CM = 7.5;
/** Leuchtendurchmesser: die Hälfte bis zwei Drittel der Tischbreite. */
export const LEUCHTE_MIN_ANTEIL = 1 / 2;
export const LEUCHTE_MAX_ANTEIL = 2 / 3;
/** Standardhöhe eines Esstischs, wenn nichts eingetragen ist. */
export const TISCH_HOEHE_STANDARD_CM = 75;

export const PLATZ_REGEL =
  "Zwischen Tischkante und Wand oder Möbel bleiben mindestens 36 Zoll (90 cm), damit man den Stuhl zurückziehen kann; geht jemand hinter den Stühlen vorbei, sind es 42 bis 48 Zoll (105 bis 120 cm).";
export const PLATZ_QUELLEN = [
  {
    name: "Wakefit: „Dining Table Size Guide“ (Designprinzip)",
    url: "https://www.wakefit.co/blog/dining-table-size-guide-4-6-8-seater-dimensions/",
  },
  {
    name: "Arcedior: „Chair Clearance Behind Dining Tables“ (Designprinzip)",
    url: "https://arcedior.com/blog/chair-clearance-behind-dining-tables",
  },
];

export const PERSONEN_REGEL =
  "Jede Person braucht 24 bis 30 Zoll (60 bis 75 cm) Tischkante. Beim rechteckigen Tisch zählen die langen Seiten, dazu kommt eine Person je Kopfende.";
export const PERSONEN_QUELLEN = [
  {
    name: "WoodWeb: „Round Dining Table Dimensions“ (Designprinzip)",
    url: "https://woodweb.com/knowledge_base/Round_Dining_Table_Dimensions.html",
  },
  {
    name: "PopMaison: „Dining Table Size“ (Designprinzip)",
    url: "https://www.popmaison.com/blogs/guide/dining-table-size",
  },
];

export const LEUCHTE_REGEL =
  "Die Leuchte ist halb bis zwei Drittel so breit wie der Tisch und hängt mit der Unterkante 30 bis 36 Zoll (76 bis 91 cm) über der Tischplatte; bei Decken über 2,40 m kommen etwa 3 Zoll (7,5 cm) je Fuß (30 cm) Mehrhöhe dazu.";
export const LEUCHTE_QUELLEN = [
  {
    name: "Raymour & Flanigan: „How to Determine Chandelier Height“ (Designprinzip)",
    url: "https://www.raymourflanigan.com/blog/expertise/how-to/how-to-determine-chandelier-height",
  },
  {
    name: "Montreal Lighting: „Chandelier Height Above Table“ (Designprinzip)",
    url: "https://montreallighting.com/blogs/lighting-guides/chandelier-height-above-table",
  },
  {
    name: "Drew & Jonathan: „Chandelier Height Above Dining Table“ (Designprinzip)",
    url: "https://drewandjonathan.com/design-and-decor/chandelier-height-above-dining-table",
  },
  {
    name: "Mod Lighting: „How to Choose a Dining Room Chandelier“ (Designprinzip)",
    url: "https://mod-lighting.com/blogs/read/how-to-choose-a-dining-room-chandelier",
  },
];

export type Esstisch = { form: "rechteckig" | "rund"; breite: number; tiefe: number; hoehe: number };

export type EsstischErgebnis = {
  personen: { von: number; bis: number };
  leuchteDurchmesser: { von: number; bis: number };
  /** Unterkante über der Tischplatte, inkl. Zuschlag für hohe Decken. */
  leuchteHoeheUeberTisch: { von: number; bis: number };
  /** Unterkante über dem Boden, oder ein Hinweis, wenn sie nicht unter die Decke passt; null ohne Raum. */
  leuchteImRaum:
    | { art: "hoehe"; von: number; bis: number; platzBisDecke: number }
    | { art: "hinweis"; grund: string }
    | null;
  /** Platz zwischen Tischkante und Wand je Seite; null ohne Raum. */
  platz: { frei: number; fehlt: number; mindestBreite: number; tischMass: number } | null;
};

/**
 * Annahme von Proportio: Der Tisch steht mittig, die kurze Raumseite liegt quer zu seinem
 * kleineren Maß; links und rechts bleibt je die Hälfte des Rests.
 */
export function empfehleEsstisch(
  tisch: Esstisch,
  raum: { laenge: number; breite: number; hoehe: number } | null,
): EsstischErgebnis {
  const kleineresMass = tisch.form === "rund" ? tisch.breite : Math.min(tisch.breite, tisch.tiefe);
  const laengeresMass = tisch.form === "rund" ? tisch.breite : Math.max(tisch.breite, tisch.tiefe);

  let personen;
  if (tisch.form === "rund") {
    const umfang = Math.PI * tisch.breite;
    personen = { von: Math.floor(umfang / PERSON_BIS_CM), bis: Math.floor(umfang / PERSON_VON_CM) };
  } else {
    personen = {
      von: 2 * Math.floor(laengeresMass / PERSON_BIS_CM) + 2,
      bis: 2 * Math.floor(laengeresMass / PERSON_VON_CM) + 2,
    };
  }

  const leuchteDurchmesser = {
    von: Math.round(kleineresMass * LEUCHTE_MIN_ANTEIL),
    bis: Math.round(kleineresMass * LEUCHTE_MAX_ANTEIL),
  };

  const zuschlag = raum
    ? Math.max(0, ((raum.hoehe - LEUCHTE_BASIS_DECKE_CM) / 30) * LEUCHTE_ZUSCHLAG_JE_30_CM)
    : 0;
  const leuchteHoeheUeberTisch = {
    von: Math.round(LEUCHTE_HOEHE_VON_CM + zuschlag),
    bis: Math.round(LEUCHTE_HOEHE_BIS_CM + zuschlag),
  };

  let leuchteImRaum: EsstischErgebnis["leuchteImRaum"] = null;
  let platz: EsstischErgebnis["platz"] = null;
  if (raum) {
    const von = tisch.hoehe + leuchteHoeheUeberTisch.von;
    const bis = tisch.hoehe + leuchteHoeheUeberTisch.bis;
    leuchteImRaum =
      von >= raum.hoehe
        ? {
            art: "hinweis",
            grund: `Über dem Tisch ist kein Platz für die Leuchte: Die Unterkante läge bei mindestens ${von} cm (Tisch ${tisch.hoehe} cm + ${leuchteHoeheUeberTisch.von} cm), die Decke ist aber nur ${raum.hoehe} cm hoch.`,
          }
        : { art: "hoehe", von, bis: Math.min(bis, raum.hoehe), platzBisDecke: Math.max(0, raum.hoehe - bis) };

    const frei = Math.round((Math.min(raum.laenge, raum.breite) - kleineresMass) / 2);
    platz = {
      frei,
      fehlt: Math.max(0, PLATZ_MIN_CM - frei),
      mindestBreite: Math.round(kleineresMass + 2 * PLATZ_MIN_CM),
      tischMass: kleineresMass,
    };
  }

  return { personen, leuchteDurchmesser, leuchteHoeheUeberTisch, leuchteImRaum, platz };
}

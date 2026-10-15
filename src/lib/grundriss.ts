import { COUCHTISCH_BIS_CM, COUCHTISCH_VON_CM, LAUFWEG_MIN_CM } from "@/lib/abstaende";
import { BETT_PLATZ_MIN_CM } from "@/lib/bett";
import { PLATZ_MIN_CM } from "@/lib/esstisch";

/** Drehung im Uhrzeigersinn. Bei 0° zeigt die Vorderseite eines Sofas nach unten. */
export type Drehung = 0 | 90 | 180 | 270;
export const DREHUNGEN: readonly Drehung[] = [0, 90, 180, 270];

export type PlanArt = "Sofa" | "Couchtisch" | "Esstisch" | "Bett";

export function istPlanArt(art: string): art is PlanArt {
  return art === "Sofa" || art === "Couchtisch" || art === "Esstisch" || art === "Bett";
}

/** Ein Möbelstück mit Tiefe. x und y (linke obere Ecke in cm) fehlen, solange es nie bewegt wurde. */
export type PlanMoebel = {
  id: number;
  art: PlanArt;
  breite: number;
  tiefe: number;
  rund: boolean;
  x?: number;
  y?: number;
  drehung?: Drehung;
};

/** Fläche im Raum in cm: linke obere Ecke, Breite w (waagerecht), Tiefe d (senkrecht). */
export type Rechteck = { x: number; y: number; w: number; d: number };

export type Platziert = {
  id: number;
  art: PlanArt;
  rund: boolean;
  breite: number;
  tiefe: number;
  drehung: Drehung;
  rect: Rechteck;
  /** Die Lage wurde von der Person gesetzt (verschoben oder gedreht), sonst gilt der Standardplatz. */
  gesetzt: boolean;
};

type Raum = { laenge: number; breite: number };
type Lage = { x: number; y: number; drehung: Drehung };

export type Blickrichtung = "unten" | "links" | "oben" | "rechts";
export const BLICKRICHTUNG: Record<Drehung, Blickrichtung> = {
  0: "unten",
  90: "links",
  180: "oben",
  270: "rechts",
};

/** Länge liegt waagerecht, Breite senkrecht. */
function fussabdruck(breite: number, tiefe: number, rund: boolean, drehung: Drehung) {
  const quer = !rund && (drehung === 90 || drehung === 270);
  return quer ? { w: tiefe, d: breite } : { w: breite, d: tiefe };
}

function begrenze(x: number, y: number, w: number, d: number, raum: Raum) {
  return {
    x: Math.min(Math.max(0, x), Math.max(0, raum.laenge - w)),
    y: Math.min(Math.max(0, y), Math.max(0, raum.breite - d)),
  };
}

function groesstes<T>(liste: T[], wert: (t: T) => number): T | null {
  return liste.reduce<T | null>((max, t) => (max === null || wert(t) > wert(max) ? t : max), null);
}

/**
 * Standardplatz nach den Annahmen von prop-calc: Das größte Sofa steht mit dem Rücken an einer
 * Wand der langen Seite, davor liegt der Couchtisch im empfohlenen Abstand, der größte Esstisch
 * steht mittig und mit seinem kleineren Maß quer zur kurzen Raumseite. Weitere Möbel stehen
 * leicht versetzt in der Ecke und warten darauf, verschoben zu werden.
 */
function standardLagen(raum: Raum, moebel: PlanMoebel[]): Map<number, Lage> {
  const lagen = new Map<number, Lage>();
  const sofa = groesstes(
    moebel.filter((m) => m.art === "Sofa"),
    (m) => m.breite,
  );
  const tisch = groesstes(
    moebel.filter((m) => m.art === "Couchtisch"),
    (m) => m.tiefe,
  );
  const esstisch = groesstes(
    moebel.filter((m) => m.art === "Esstisch"),
    (m) => Math.max(m.breite, m.tiefe),
  );
  const bett = groesstes(
    moebel.filter((m) => m.art === "Bett"),
    (m) => m.breite * m.tiefe,
  );
  const kurzeSeiteSenkrecht = raum.laenge >= raum.breite;

  // Das Kopfende steht an der oberen Wand, mittig; fürs Fußende zeigt die Vorderseite nach unten.
  if (bett) {
    lagen.set(bett.id, { x: (raum.laenge - bett.breite) / 2, y: 0, drehung: 0 });
  }

  let sofaFlaeche: Rechteck | null = null;
  let sofaDrehung: Drehung = 0;
  if (sofa) {
    sofaDrehung = kurzeSeiteSenkrecht ? 0 : 270;
    const fp = fussabdruck(sofa.breite, sofa.tiefe, false, sofaDrehung);
    const x = kurzeSeiteSenkrecht ? (raum.laenge - fp.w) / 2 : 0;
    const y = kurzeSeiteSenkrecht ? 0 : (raum.breite - fp.d) / 2;
    sofaFlaeche = { x, y, ...fp };
    lagen.set(sofa.id, { x, y, drehung: sofaDrehung });
  }

  if (tisch) {
    const drehung = sofaFlaeche ? sofaDrehung : 0;
    const fp = fussabdruck(tisch.breite, tisch.tiefe, false, drehung);
    let x = (raum.laenge - fp.w) / 2;
    let y = (raum.breite - fp.d) / 2;
    if (sofaFlaeche) {
      if (drehung === 0) {
        x = sofaFlaeche.x + sofaFlaeche.w / 2 - fp.w / 2;
        y = sofaFlaeche.y + sofaFlaeche.d + COUCHTISCH_VON_CM;
      } else {
        x = sofaFlaeche.x + sofaFlaeche.w + COUCHTISCH_VON_CM;
        y = sofaFlaeche.y + sofaFlaeche.d / 2 - fp.d / 2;
      }
    }
    lagen.set(tisch.id, { x, y, drehung });
  }

  if (esstisch) {
    // Das kleinere Maß liegt quer zur kurzen Raumseite (wie in der Rechnung ohne Lage).
    const kleineresIstBreite = esstisch.breite <= esstisch.tiefe;
    const drehung: Drehung =
      esstisch.rund || kurzeSeiteSenkrecht !== kleineresIstBreite ? 0 : 90;
    const fp = fussabdruck(esstisch.breite, esstisch.tiefe, esstisch.rund, drehung);
    lagen.set(esstisch.id, {
      x: (raum.laenge - fp.w) / 2,
      y: (raum.breite - fp.d) / 2,
      drehung,
    });
  }

  let versatz = 0;
  for (const m of moebel) {
    if (lagen.has(m.id)) continue;
    lagen.set(m.id, { x: versatz, y: versatz, drehung: 0 });
    versatz += 16;
  }
  return lagen;
}

/** Legt alle Möbel in den Raum: gesetzte Lage, sonst Standardplatz; immer innerhalb der Wände. */
export function lagenBerechnen(raum: Raum, moebel: PlanMoebel[]): Platziert[] {
  const standard = standardLagen(raum, moebel);
  return moebel.map((m) => {
    const gesetzt = typeof m.x === "number" && typeof m.y === "number";
    const lage: Lage = gesetzt
      ? { x: m.x as number, y: m.y as number, drehung: m.drehung ?? 0 }
      : (standard.get(m.id) as Lage);
    const fp = fussabdruck(m.breite, m.tiefe, m.rund, lage.drehung);
    const { x, y } = begrenze(lage.x, lage.y, fp.w, fp.d, raum);
    return {
      id: m.id,
      art: m.art,
      rund: m.rund,
      breite: m.breite,
      tiefe: m.tiefe,
      drehung: lage.drehung,
      rect: { x, y, ...fp },
      gesetzt,
    };
  });
}

/** Neue linke obere Ecke, wenn ein Möbelstück um die Mitte weiter gedreht wird. */
export function drehenUmMitte(p: Platziert, raum: Raum): Lage {
  const drehung = ((p.drehung + 90) % 360) as Drehung;
  const fp = fussabdruck(p.breite, p.tiefe, p.rund, drehung);
  const mitteX = p.rect.x + p.rect.w / 2;
  const mitteY = p.rect.y + p.rect.d / 2;
  const { x, y } = begrenze(Math.round(mitteX - fp.w / 2), Math.round(mitteY - fp.d / 2), fp.w, fp.d, raum);
  return { x, y, drehung };
}

export function begrenzeLage(x: number, y: number, rect: Rechteck, raum: Raum) {
  return begrenze(x, y, rect.w, rect.d, raum);
}

/** Kürzester Abstand der Kanten zweier Flächen; 0, wenn sie sich berühren oder überlappen. */
export function abstandZwischen(a: Rechteck, b: Rechteck) {
  const dx = Math.max(0, a.x - (b.x + b.w), b.x - (a.x + a.w));
  const dy = Math.max(0, a.y - (b.y + b.d), b.y - (a.y + a.d));
  return Math.hypot(dx, dy);
}

function ueberlappt(a0: number, a1: number, b0: number, b1: number) {
  return Math.min(a1, b1) - Math.max(a0, b0) > 0;
}

/** Übersetzt eine Fläche in ein Bild, in dem das Sofa nach „unten“ blickt: u quer, v nach vorn. */
function insVorwaerts(r: Rechteck, drehung: Drehung, raum: Raum) {
  switch (drehung) {
    case 0:
      return { u: r.x, v: r.y, w: r.w, d: r.d };
    case 180:
      return { u: r.x, v: raum.breite - (r.y + r.d), w: r.w, d: r.d };
    case 90:
      return { u: r.y, v: raum.laenge - (r.x + r.w), w: r.d, d: r.w };
    case 270:
      return { u: r.y, v: r.x, w: r.d, d: r.w };
  }
}

export type AbstaendeAusLage = {
  blickrichtung: Blickrichtung;
  /** Platz zwischen der Vorderkante des Sofas und der Wand davor, in cm. */
  platzVorSofa: number;
  /** Freier Weg bis zur Wand, hinter einem Couchtisch vor dem Sofa, in cm. */
  frei: number;
  fehlt: number;
  /** Ein Couchtisch steht vor dem Sofa und liegt auf dem Weg. */
  tischImWeg: boolean;
  /** Nächster Couchtisch: Kantenabstand zum Sofa in cm. */
  tisch: { abstand: number; fehlt: number; zuWeit: number } | null;
};

/**
 * Laufweg und Tischabstand aus der echten Lage: Der Weg ist der Raum zwischen der Wand vor dem
 * Sofa und der Vorderkante des Sofas, bei einem Couchtisch davor gemessen ab dessen Hinterkante.
 */
export function abstaendeAusLage(raum: Raum, sofa: Platziert, tische: Platziert[]): AbstaendeAusLage {
  const s = insVorwaerts(sofa.rect, sofa.drehung, raum);
  const richtungsLaenge = sofa.drehung === 0 || sofa.drehung === 180 ? raum.breite : raum.laenge;
  const vorderkante = s.v + s.d;

  let ende = vorderkante;
  let tischImWeg = false;
  for (const t of tische) {
    const l = insVorwaerts(t.rect, sofa.drehung, raum);
    if (ueberlappt(s.u, s.u + s.w, l.u, l.u + l.w) && l.v + l.d > vorderkante) {
      tischImWeg = true;
      ende = Math.max(ende, l.v + l.d);
    }
  }

  const frei = Math.round(richtungsLaenge - ende);
  let tisch: AbstaendeAusLage["tisch"] = null;
  for (const t of tische) {
    const abstand = Math.round(abstandZwischen(sofa.rect, t.rect));
    if (tisch === null || abstand < tisch.abstand) {
      tisch = {
        abstand,
        fehlt: Math.max(0, COUCHTISCH_VON_CM - abstand),
        zuWeit: Math.max(0, abstand - COUCHTISCH_BIS_CM),
      };
    }
  }

  return {
    blickrichtung: BLICKRICHTUNG[sofa.drehung],
    platzVorSofa: Math.round(richtungsLaenge - vorderkante),
    frei,
    fehlt: Math.max(0, LAUFWEG_MIN_CM - frei),
    tischImWeg,
    tisch,
  };
}

export type Seite = "links" | "rechts" | "oben" | "unten";

export type FreiraumAusLage = {
  /** Kleinster Abstand der Tischkante zu einer Wand oder einem anderen Möbelstück, in cm. */
  frei: number;
  fehlt: number;
  seite: Seite;
  /** Was dort steht: die Wand oder die Art des Möbelstücks. */
  hindernis: "Wand" | PlanArt;
  /** Der Tisch überlappt ein anderes Möbelstück. */
  ueberlappt: boolean;
};

/** Freiraum um den Tisch aus der echten Lage: kleinster Abstand zu Wänden und Möbeln der vier Seiten. */
export function freiraumAusLage(raum: Raum, tisch: Platziert, alle: Platziert[]): FreiraumAusLage {
  const r = tisch.rect;
  const andere = alle.filter((p) => p.id !== tisch.id);

  for (const o of andere) {
    if (ueberlappt(r.x, r.x + r.w, o.rect.x, o.rect.x + o.rect.w) && ueberlappt(r.y, r.y + r.d, o.rect.y, o.rect.y + o.rect.d)) {
      return { frei: 0, fehlt: PLATZ_MIN_CM, seite: "links", hindernis: o.art, ueberlappt: true };
    }
  }

  let best: FreiraumAusLage = {
    frei: r.x,
    fehlt: 0,
    seite: "links",
    hindernis: "Wand",
    ueberlappt: false,
  };
  const pruefe = (frei: number, seite: Seite, hindernis: FreiraumAusLage["hindernis"]) => {
    if (frei < best.frei) best = { frei, fehlt: 0, seite, hindernis, ueberlappt: false };
  };
  pruefe(raum.laenge - (r.x + r.w), "rechts", "Wand");
  pruefe(r.y, "oben", "Wand");
  pruefe(raum.breite - (r.y + r.d), "unten", "Wand");
  for (const o of andere) {
    const q = o.rect;
    const gleicheHoehe = ueberlappt(r.y, r.y + r.d, q.y, q.y + q.d);
    const gleicheBreite = ueberlappt(r.x, r.x + r.w, q.x, q.x + q.w);
    if (gleicheHoehe && q.x + q.w <= r.x) pruefe(r.x - (q.x + q.w), "links", o.art);
    if (gleicheHoehe && q.x >= r.x + r.w) pruefe(q.x - (r.x + r.w), "rechts", o.art);
    if (gleicheBreite && q.y + q.d <= r.y) pruefe(r.y - (q.y + q.d), "oben", o.art);
    if (gleicheBreite && q.y >= r.y + r.d) pruefe(q.y - (r.y + r.d), "unten", o.art);
  }

  const frei = Math.round(best.frei);
  return { ...best, frei, fehlt: Math.max(0, PLATZ_MIN_CM - frei) };
}

export type BettSeite = { seite: "left" | "right" | "foot"; frei: number; fehlt: number; hindernis: "Wand" | PlanArt };

export type BettFreiraumAusLage = {
  /** Ein anderes Möbelstück überlappt das Bett. */
  ueberlappt: boolean;
  seiten: BettSeite[];
};

/** Freie Strecke von einer Kante des Bettes bis zur Wand oder zum nächsten Möbelstück davor. */
function freiVor(r: Rechteck, richtung: Blickrichtung, raum: Raum, andere: Platziert[]) {
  let frei = 0;
  let hindernis: BettSeite["hindernis"] = "Wand";
  const quer = richtung === "unten" || richtung === "oben";
  if (richtung === "unten") frei = raum.breite - (r.y + r.d);
  if (richtung === "oben") frei = r.y;
  if (richtung === "links") frei = r.x;
  if (richtung === "rechts") frei = raum.laenge - (r.x + r.w);
  for (const o of andere) {
    const q = o.rect;
    const daneben = quer
      ? ueberlappt(r.x, r.x + r.w, q.x, q.x + q.w)
      : ueberlappt(r.y, r.y + r.d, q.y, q.y + q.d);
    if (!daneben) continue;
    let abstand = Infinity;
    if (richtung === "unten" && q.y >= r.y + r.d) abstand = q.y - (r.y + r.d);
    if (richtung === "oben" && q.y + q.d <= r.y) abstand = r.y - (q.y + q.d);
    if (richtung === "links" && q.x + q.w <= r.x) abstand = r.x - (q.x + q.w);
    if (richtung === "rechts" && q.x >= r.x + r.w) abstand = q.x - (r.x + r.w);
    if (abstand < frei) {
      frei = abstand;
      hindernis = o.art;
    }
  }
  return { frei: Math.round(frei), hindernis };
}

/**
 * Freiraum an den beiden Längsseiten und am Fußende des Bettes aus seiner Lage. Das Kopfende
 * zählt nicht. Bei 0° liegt das Fußende unten, bei 90° links, 180° oben, 270° rechts.
 */
export function bettFreiraumAusLage(raum: Raum, bett: Platziert, alle: Platziert[]): BettFreiraumAusLage {
  const r = bett.rect;
  const andere = alle.filter((p) => p.id !== bett.id);
  const ueberlappend = andere.some(
    (o) => ueberlappt(r.x, r.x + r.w, o.rect.x, o.rect.x + o.rect.w) && ueberlappt(r.y, r.y + r.d, o.rect.y, o.rect.y + o.rect.d),
  );
  const fuss = BLICKRICHTUNG[bett.drehung];
  const links = { unten: "links", links: "oben", oben: "rechts", rechts: "unten" } as const;
  const rechts = { unten: "rechts", links: "unten", oben: "links", rechts: "oben" } as const;
  const messe = (seite: BettSeite["seite"], richtung: Blickrichtung): BettSeite => {
    const { frei, hindernis } = freiVor(r, richtung, raum, andere);
    return { seite, frei, fehlt: Math.max(0, BETT_PLATZ_MIN_CM - frei), hindernis };
  };
  return {
    ueberlappt: ueberlappend,
    seiten: [messe("left", links[fuss]), messe("right", rechts[fuss]), messe("foot", fuss)],
  };
}

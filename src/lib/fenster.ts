import { leseAbstand } from "@/lib/zentimeter";

/** Die vier Wände im Grundriss von oben gesehen. */
export type Wand = "oben" | "unten" | "links" | "rechts";
export const WAENDE: readonly Wand[] = ["oben", "unten", "links", "rechts"];

export function istWand(x: unknown): x is Wand {
  return typeof x === "string" && (WAENDE as readonly string[]).includes(x);
}

export const WAND_NAME: Record<Wand, string> = {
  oben: "obere Wand",
  unten: "untere Wand",
  links: "linke Wand",
  rechts: "rechte Wand",
};

/** Dieselben Namen im Dativ („an der oberen Wand“). */
export const WAND_NAME_DATIV: Record<Wand, string> = {
  oben: "oberen Wand",
  unten: "unteren Wand",
  links: "linken Wand",
  rechts: "rechten Wand",
};

/** Der Abstand wird von dieser Ecke aus gemessen: bei oben und unten von links, bei links und rechts von oben. */
export const WAND_VON: Record<Wand, string> = {
  oben: "linken Ecke",
  unten: "linken Ecke",
  links: "oberen Ecke",
  rechts: "oberen Ecke",
};

type Raum = { laenge: number; breite: number };

/** Oben und unten verlaufen entlang der Raumlänge, links und rechts entlang der Raumbreite. */
export function wandLaenge(wand: Wand, raum: Raum) {
  return wand === "oben" || wand === "unten" ? raum.laenge : raum.breite;
}

function zahl(n: number) {
  return n.toLocaleString("de-DE", { maximumFractionDigits: 1 });
}

/** Meldung, wenn das Fenster mit diesem Abstand nicht auf die Wand passt; sonst null. */
export function pruefeFensterLage(wand: Wand, abstand: number, breite: number, raum: Raum): string | null {
  const laenge = wandLaenge(wand, raum);
  if (breite > laenge) {
    return `Das Fenster ist ${zahl(breite)} cm breit, die ${WAND_NAME[wand]} ist nur ${zahl(laenge)} cm lang.`;
  }
  if (abstand + breite > laenge) {
    return `Das Fenster ist ${zahl(breite)} cm breit. Mit ${zahl(abstand)} cm Abstand ragt es über das Ende der ${WAND_NAME_DATIV[wand]} hinaus (${zahl(laenge)} cm lang). Der Abstand darf höchstens ${zahl(laenge - breite)} cm sein.`;
  }
  return null;
}

/** Liest Wand und Abstand aus einem Formular. Ohne gewählte Wand ist das Ergebnis leer (Fenster ohne Wand). */
export function leseFensterLage(
  daten: FormData,
  breite: number,
  raum: Raum | null,
): { wand?: Wand; abstand?: number } | { fehler: { abstand: string } } {
  const wand = daten.get("wand");
  if (!istWand(wand)) return {};
  const abstand = leseAbstand(String(daten.get("abstand") ?? ""));
  if ("fehler" in abstand) return { fehler: { abstand: abstand.fehler } };
  if (!raum) {
    return { fehler: { abstand: "Trag zuerst den Raum ein, damit ich die Länge der Wand kenne." } };
  }
  const meldung = pruefeFensterLage(wand, abstand.wert, breite, raum);
  if (meldung) return { fehler: { abstand: meldung } };
  return { wand, abstand: abstand.wert };
}

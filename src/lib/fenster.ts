import { leseAbstand } from "@/lib/zentimeter";

/** Die vier Wände im Grundriss von oben gesehen. */
export type Wand = "oben" | "unten" | "links" | "rechts";
export const WAENDE: readonly Wand[] = ["oben", "unten", "links", "rechts"];

export function istWand(x: unknown): x is Wand {
  return typeof x === "string" && (WAENDE as readonly string[]).includes(x);
}

export const WAND_NAME: Record<Wand, string> = {
  oben: "top wall",
  unten: "bottom wall",
  links: "left wall",
  rechts: "right wall",
};

/** Same names, used after a preposition ("on the top wall"); identical in English. */
export const WAND_NAME_DATIV: Record<Wand, string> = {
  oben: "top wall",
  unten: "bottom wall",
  links: "left wall",
  rechts: "right wall",
};

/** Der Abstand wird von dieser Ecke aus gemessen: bei oben und unten von links, bei links und rechts von oben. */
export const WAND_VON: Record<Wand, string> = {
  oben: "left corner",
  unten: "left corner",
  links: "top corner",
  rechts: "top corner",
};

type Raum = { laenge: number; breite: number };

/** Oben und unten verlaufen entlang der Raumlänge, links und rechts entlang der Raumbreite. */
export function wandLaenge(wand: Wand, raum: Raum) {
  return wand === "oben" || wand === "unten" ? raum.laenge : raum.breite;
}

function zahl(n: number) {
  return n.toLocaleString("en-GB", { maximumFractionDigits: 1 });
}

/** Meldung, wenn das Fenster mit diesem Abstand nicht auf die Wand passt; sonst null. */
export function pruefeFensterLage(wand: Wand, abstand: number, breite: number, raum: Raum): string | null {
  const laenge = wandLaenge(wand, raum);
  if (breite > laenge) {
    return `The window is ${zahl(breite)} cm wide, but the ${WAND_NAME[wand]} is only ${zahl(laenge)} cm long.`;
  }
  if (abstand + breite > laenge) {
    return `The window is ${zahl(breite)} cm wide. With a distance of ${zahl(abstand)} cm it extends past the end of the ${WAND_NAME_DATIV[wand]} (${zahl(laenge)} cm long). The distance may be at most ${zahl(laenge - breite)} cm.`;
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
    return { fehler: { abstand: "Enter the room first so the length of the wall is known." } };
  }
  const meldung = pruefeFensterLage(wand, abstand.wert, breite, raum);
  if (meldung) return { fehler: { abstand: meldung } };
  return { wand, abstand: abstand.wert };
}

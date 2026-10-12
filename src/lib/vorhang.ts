import { WAND_NAME_DATIV, WAND_VON, wandLaenge } from "@/lib/fenster";
import type { Wand } from "@/lib/fenster";

/** Die Stange sitzt etwa 10 cm (4 Zoll) über dem Fensterrahmen. */
export const STANGE_ABSTAND_OBEN_CM = 10;
/** Die Stange ragt auf jeder Seite etwa 10 cm über den Fensterrahmen hinaus (Quellen nennen 3–6 Zoll). */
export const STANGE_UEBERSTAND_CM = 10;

export const VORHANG_REGEL =
  "The rod sits about 10 cm above the window frame and extends about 10 cm beyond it on each side, so the window looks larger and the curtain leaves the glass clear during the day.";
export const VORHANG_QUELLE = {
  name: "TaskRabbit: „How High to Hang Curtains“ (design principle)",
  url: "https://www.taskrabbit.com/blog/how-high-to-hang-curtains",
};

export type VorhangErgebnis =
  | { art: "stange"; breite: number; abstandOben: number; ueberstand: number }
  | { art: "hinweis"; grund: string };

/**
 * Stangenbreite und Abstand der Stange über dem Fensterrahmen.
 * Wo das Fenster über dem Boden beginnt, wissen wir nicht; deshalb prüfen wir vorsichtig,
 * ob das Fenster samt Stange auch dann noch unter die Decke passt, wenn es am Boden beginnt.
 */
export function empfehleVorhang(fensterBreite: number, fensterHoehe: number, deckenHoehe: number): VorhangErgebnis {
  const benoetigt = fensterHoehe + STANGE_ABSTAND_OBEN_CM;
  if (benoetigt > deckenHoehe) {
    return {
      art: "hinweis",
      grund: `The window is ${fensterHoehe} cm high. With ${STANGE_ABSTAND_OBEN_CM} cm for the rod, that makes ${benoetigt} cm, which is higher than the ceiling height of ${deckenHoehe} cm. No rod height can be recommended here; the rod would have to go directly under the ceiling or inside the window reveal.`,
    };
  }
  return {
    art: "stange",
    breite: fensterBreite + 2 * STANGE_UEBERSTAND_CM,
    abstandOben: STANGE_ABSTAND_OBEN_CM,
    ueberstand: STANGE_UEBERSTAND_CM,
  };
}

/**
 * Hinweise, wenn die Stange an der Wand nicht auf beiden Seiten ihren Überstand hat.
 * Gemessen wird der Platz zwischen Fensterrahmen und Wandende (Ecke).
 */
export function stangePlatzHinweise(
  wand: Wand,
  abstand: number,
  fensterBreite: number,
  raum: { laenge: number; breite: number },
): string[] {
  const zahl = (n: number) => n.toLocaleString("en-GB", { maximumFractionDigits: 1 });
  const hinweise: string[] = [];
  const rest = wandLaenge(wand, raum) - abstand - fensterBreite;
  if (abstand < STANGE_UEBERSTAND_CM) {
    hinweise.push(
      `It is only ${zahl(abstand)} cm to the ${WAND_VON[wand]} of the ${WAND_NAME_DATIV[wand]}, but the rod extends ${STANGE_UEBERSTAND_CM} cm beyond the window. It does not quite fit there.`,
    );
  }
  if (rest < STANGE_UEBERSTAND_CM) {
    hinweise.push(
      `At the other end of the ${WAND_NAME_DATIV[wand]} it is only ${zahl(rest)} cm to the corner, but the rod extends ${STANGE_UEBERSTAND_CM} cm beyond the window. It does not quite fit there.`,
    );
  }
  return hinweise;
}

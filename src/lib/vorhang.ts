/** Die Stange sitzt etwa 10 cm (4 Zoll) über dem Fensterrahmen. */
export const STANGE_ABSTAND_OBEN_CM = 10;
/** Die Stange ragt auf jeder Seite etwa 10 cm über den Fensterrahmen hinaus (Quellen nennen 3–6 Zoll). */
export const STANGE_UEBERSTAND_CM = 10;

export const VORHANG_REGEL =
  "Die Stange sitzt etwa 10 cm über dem Fensterrahmen und ragt auf jeder Seite etwa 10 cm über ihn hinaus, damit das Fenster größer wirkt und der Vorhang tagsüber die Scheibe freigibt.";
export const VORHANG_QUELLE = {
  name: "TaskRabbit: „How High to Hang Curtains“ (Designprinzip)",
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
      grund: `Das Fenster ist ${fensterHoehe} cm hoch. Mit ${STANGE_ABSTAND_OBEN_CM} cm Abstand für die Stange wären das ${benoetigt} cm – das ist höher als die Deckenhöhe von ${deckenHoehe} cm. Hier lässt sich keine Stangenhöhe empfehlen; die Stange müsste direkt unter die Decke oder in die Fensterlaibung.`,
    };
  }
  return {
    art: "stange",
    breite: fensterBreite + 2 * STANGE_UEBERSTAND_CM,
    abstandOben: STANGE_ABSTAND_OBEN_CM,
    ueberstand: STANGE_UEBERSTAND_CM,
  };
}

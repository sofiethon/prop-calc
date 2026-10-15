/** Freiraum seitlich und am Fußende: mindestens 30 Zoll (gerundet 76 cm), bequem 36 Zoll (91 cm). */
export const BETT_PLATZ_MIN_CM = 76;
export const BETT_PLATZ_KOMFORT_CM = 91;
/** Nachttisch: Oberfläche auf Höhe der Matratzenoberkante bis etwa 2 Zoll (5 cm) darüber. */
export const NACHTTISCH_ZUSCHLAG_MAX_CM = 5;

export const BETT_PLATZ_REGEL =
  "Leave at least 30 in (76 cm) of clear space on each open side of the bed and at the foot; 36 in (91 cm) is comfortable. The headboard stands against a wall and needs no clearance.";
export const BETT_PLATZ_QUELLEN = [
  {
    name: "Dimensions.com: „Queen Bedroom Layouts“ (design principle)",
    url: "https://www.dimensions.com/element/queen-bedroom-layouts",
  },
  {
    name: "Dimensions.com: „King Bedroom Layouts“ (design principle)",
    url: "https://www.dimensions.com/element/king-bedroom-layouts",
  },
];

export const NACHTTISCH_REGEL =
  "The top of the nightstand is level with the top of the mattress or up to about 2 in (5 cm) higher, so a glass or lamp can be reached without lifting the arm.";
export const NACHTTISCH_QUELLEN = [
  {
    name: "Flowyline: „How Tall Should a Nightstand Be?“ (design principle)",
    url: "https://flowyline.com/blogs/for-diy-ers/how-tall-should-a-nightstand-be",
  },
  {
    name: "Carla Aston: „How Tall Should Your Nightstand Be“ (design principle)",
    url: "https://carlaaston.com/designed/how-tall-should-your-nightstand-be",
  },
];

/** Höhe der Nachttisch-Oberfläche über dem Boden als Bereich (cm). */
export function nachttischHoehe(matratzeOberkante: number) {
  return { von: Math.round(matratzeOberkante), bis: Math.round(matratzeOberkante + NACHTTISCH_ZUSCHLAG_MAX_CM) };
}

import { CircleAlert } from "lucide-react";
import {
  empfehleTeppich,
  TEPPICH_QUELLE,
  TEPPICH_REGEL,
  WANDABSTAND_CM,
} from "@/lib/teppich";

type Props = {
  raum: { laenge: number; breite: number } | null;
  sofas: { breite: number; tiefe?: number }[];
};

const linkKlasse = "inline-flex min-h-11 items-center font-normal text-foreground underline underline-offset-4";

export default function TeppichEmpfehlung({ raum, sofas }: Props) {
  // With several sofas, the widest one counts; if the depth is missing (old entry), 90 cm is used.
  const sofa = sofas.reduce<(typeof sofas)[number] | null>(
    (max, s) => (max === null || s.breite > max.breite ? s : max),
    null,
  );
  const sofaBreite = sofa ? sofa.breite : null;

  let inhalt;
  if (sofaBreite === null || raum === null) {
    inhalt = (
      <p className="text-muted">
        For the recommendation I need {raum === null ? "a room" : ""}
        {raum === null && sofaBreite === null ? " and " : ""}
        {sofaBreite === null ? "a sofa" : ""}.{" "}
        <a href={raum === null ? "#raum-formular" : "#moebel-formular"} className={linkKlasse}>
          Back to input
        </a>
        .
      </p>
    );
  } else {
    const ergebnis = empfehleTeppich(raum.laenge, raum.breite, sofaBreite, sofa?.tiefe ?? 90);
    if (ergebnis.art === "hinweis") {
      inhalt = (
        <p className="flex items-start gap-2 font-medium text-foreground">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
          {ergebnis.grund}
        </p>
      );
    } else {
      inhalt = (
        <>
          <p className="text-2xl font-normal">
            {ergebnis.lang} × {ergebnis.kurz} cm
          </p>
          <p className="mt-2 text-muted">
            The long side runs parallel to the sofa (sofa: {sofaBreite} cm wide, rug at least{" "}
            {ergebnis.mindestBreite} × {ergebnis.mindestTiefe} cm; {WANDABSTAND_CM} cm clearance to the wall
            included).
          </p>
          <h3 className="mt-6 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Proportion</h3>
          <p>
            The rug is {ergebnis.verhaeltnis.toLocaleString("en-GB", { maximumFractionDigits: 2 })} times as
            wide as the sofa.
          </p>
          <h3 className="mt-6 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Rule</h3>
          <p>{TEPPICH_REGEL}</p>
          <h3 className="mt-6 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Source</h3>
          <p>
            <a href={TEPPICH_QUELLE.url} className={linkKlasse} target="_blank" rel="noopener noreferrer">
              {TEPPICH_QUELLE.name}
            </a>
          </p>
        </>
      );
    }
  }

  return (
    <details className="border-t border-foreground pt-2">
      <summary className="flex min-h-11 cursor-pointer items-center font-display text-h3 font-normal tracking-heading">
        Rug recommendation
      </summary>
      <div className="mt-4" aria-live="polite">
        {inhalt}
      </div>
    </details>
  );
}

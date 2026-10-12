import { CircleAlert } from "lucide-react";
import { BILD_QUELLE, BILD_REGEL, empfehleBild } from "@/lib/bild";

type Props = {
  raum: { hoehe: number } | null;
  sofas: { breite: number; hoehe: number }[];
};

const linkKlasse = "inline-flex min-h-11 items-center font-normal text-foreground underline underline-offset-4";

export default function BildEmpfehlung({ raum, sofas }: Props) {
  // With several sofas, the widest one counts.
  const sofa = sofas.reduce<(typeof sofas)[number] | null>(
    (max, s) => (max === null || s.breite > max.breite ? s : max),
    null,
  );

  let inhalt;
  if (sofa === null || raum === null) {
    inhalt = (
      <p className="text-muted">
        For the recommendation I need {raum === null ? "a room" : ""}
        {raum === null && sofa === null ? " and " : ""}
        {sofa === null ? "a sofa" : ""}.{" "}
        <a href={raum === null ? "#raum-formular" : "#moebel-formular"} className={linkKlasse}>
          Back to input
        </a>
        .
      </p>
    );
  } else {
    const e = empfehleBild(sofa.breite, sofa.hoehe, raum.hoehe);
    if (e.art === "hinweis") {
      inhalt = (
        <p className="flex items-start gap-2 font-medium text-foreground">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
          {e.grund}
        </p>
      );
    } else {
      inhalt = (
        <>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <dt className="text-muted">Picture width</dt>
            <dd className="text-lg font-medium">
              {e.breiteVon}–{e.breiteBis} cm
            </dd>
            <dt className="text-muted">Hanging height</dt>
            <dd className="text-lg font-medium">Lower edge at {e.hangHoehe} cm</dd>
          </dl>
          <p className="mt-2 text-muted">
            {e.platzBisDecke} cm remain up to the ceiling for the picture (sofa: {sofa.breite} cm wide, {sofa.hoehe} cm
            high).
          </p>
          <h3 className="mt-6 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Rule</h3>
          <p>{BILD_REGEL}</p>
          <h3 className="mt-6 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Source</h3>
          <p>
            <a href={BILD_QUELLE.url} className={linkKlasse} target="_blank" rel="noopener noreferrer">
              {BILD_QUELLE.name}
            </a>
          </p>
        </>
      );
    }
  }

  return (
    <details className="border-t border-foreground pt-2">
      <summary className="flex min-h-11 cursor-pointer items-center font-display text-h3 font-normal tracking-heading">
        Picture recommendation
      </summary>
      <div className="mt-4" aria-live="polite">
        {inhalt}
      </div>
    </details>
  );
}

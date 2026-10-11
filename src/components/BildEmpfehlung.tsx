import { CircleAlert } from "lucide-react";
import { BILD_QUELLE, BILD_REGEL, empfehleBild } from "@/lib/bild";

type Props = {
  raum: { hoehe: number } | null;
  sofas: { breite: number; hoehe: number }[];
};

const linkKlasse = "inline-block font-medium text-foreground underline";

export default function BildEmpfehlung({ raum, sofas }: Props) {
  // Bei mehreren Sofas zählt das breiteste.
  const sofa = sofas.reduce<(typeof sofas)[number] | null>(
    (max, s) => (max === null || s.breite > max.breite ? s : max),
    null,
  );

  let inhalt;
  if (sofa === null || raum === null) {
    inhalt = (
      <p className="text-muted">
        Für die Empfehlung brauche ich {raum === null ? "einen Raum" : ""}
        {raum === null && sofa === null ? " und " : ""}
        {sofa === null ? "ein Sofa" : ""}.{" "}
        <a href={raum === null ? "#raum-formular" : "#moebel-formular"} className={linkKlasse}>
          Zurück zur Eingabe
        </a>
        .
      </p>
    );
  } else {
    const e = empfehleBild(sofa.breite, sofa.hoehe, raum.hoehe);
    if (e.art === "hinweis") {
      inhalt = (
        <p className="flex items-start gap-1.5 font-medium text-accent">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {e.grund}
        </p>
      );
    } else {
      inhalt = (
        <>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
            <dt className="text-muted">Bildbreite</dt>
            <dd className="text-lg font-bold">
              {e.breiteVon}–{e.breiteBis} cm
            </dd>
            <dt className="text-muted">Hängehöhe</dt>
            <dd className="text-lg font-bold">Unterkante bei {e.hangHoehe} cm</dd>
          </dl>
          <p className="mt-1 text-muted">
            Bis zur Decke bleiben {e.platzBisDecke} cm für das Bild (Sofa: {sofa.breite} cm breit, {sofa.hoehe} cm
            hoch).
          </p>
          <h3 className="mt-4 font-semibold">Regel</h3>
          <p>{BILD_REGEL}</p>
          <h3 className="mt-4 font-semibold">Quelle</h3>
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
    <details className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <summary className="flex min-h-11 cursor-pointer items-center text-xl font-semibold">
        Bildempfehlung
      </summary>
      <div className="mt-4" aria-live="polite">
        {inhalt}
      </div>
    </details>
  );
}

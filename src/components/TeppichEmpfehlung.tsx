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

const linkKlasse = "inline-block font-medium text-foreground underline";

export default function TeppichEmpfehlung({ raum, sofas }: Props) {
  // Bei mehreren Sofas zählt das breiteste; fehlt die Tiefe (alter Eintrag), rechnen wir mit 90 cm.
  const sofa = sofas.reduce<(typeof sofas)[number] | null>(
    (max, s) => (max === null || s.breite > max.breite ? s : max),
    null,
  );
  const sofaBreite = sofa ? sofa.breite : null;

  let inhalt;
  if (sofaBreite === null || raum === null) {
    inhalt = (
      <p className="text-muted">
        Für die Empfehlung brauche ich {raum === null ? "einen Raum" : ""}
        {raum === null && sofaBreite === null ? " und " : ""}
        {sofaBreite === null ? "ein Sofa" : ""}.{" "}
        <a href={raum === null ? "#raum-formular" : "#moebel-formular"} className={linkKlasse}>
          Zurück zur Eingabe
        </a>
        .
      </p>
    );
  } else {
    const ergebnis = empfehleTeppich(raum.laenge, raum.breite, sofaBreite, sofa?.tiefe ?? 90);
    if (ergebnis.art === "hinweis") {
      inhalt = (
        <p className="flex items-start gap-1.5 font-medium text-accent">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {ergebnis.grund}
        </p>
      );
    } else {
      inhalt = (
        <>
          <p className="text-2xl font-bold">
            {ergebnis.lang} × {ergebnis.kurz} cm
          </p>
          <p className="mt-1 text-muted">
            Die lange Seite liegt parallel zum Sofa (Sofa: {sofaBreite} cm breit, Teppich mindestens{" "}
            {ergebnis.mindestBreite} × {ergebnis.mindestTiefe} cm; {WANDABSTAND_CM} cm Abstand zur Wand
            eingerechnet).
          </p>
          <h3 className="mt-4 font-semibold">Verhältnis</h3>
          <p>
            Der Teppich ist {ergebnis.verhaeltnis.toLocaleString("de-DE", { maximumFractionDigits: 2 })}-mal so
            breit wie das Sofa.
          </p>
          <h3 className="mt-4 font-semibold">Regel</h3>
          <p>{TEPPICH_REGEL}</p>
          <h3 className="mt-4 font-semibold">Quelle</h3>
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
    <details className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <summary className="flex min-h-11 cursor-pointer items-center text-xl font-semibold">
        Teppichempfehlung
      </summary>
      <div className="mt-4" aria-live="polite">
        {inhalt}
      </div>
    </details>
  );
}

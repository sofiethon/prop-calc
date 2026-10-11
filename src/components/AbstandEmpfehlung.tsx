import { CircleAlert } from "lucide-react";
import { ABSTAENDE_QUELLE, ABSTAENDE_REGEL, empfehleAbstaende, LAUFWEG_MIN_CM } from "@/lib/abstaende";

type Props = {
  raum: { laenge: number; breite: number } | null;
  sofas: { breite: number; tiefe?: number }[];
  couchtische: { tiefe?: number }[];
  fernseher: { breite: number }[];
};

const linkKlasse = "inline-block font-medium text-foreground underline";
const warnKlasse = "mt-1 flex items-start gap-1.5 font-medium text-accent";

export default function AbstandEmpfehlung({ raum, sofas, couchtische, fernseher }: Props) {
  // Bei mehreren Sofas zählt das breiteste, beim Couchtisch der tiefste, beim Fernseher der breiteste.
  // Fehlt die Sofatiefe (alter Eintrag), rechnen wir wie bei der Teppichempfehlung mit 90 cm.
  const sofa = sofas.reduce<(typeof sofas)[number] | null>(
    (max, s) => (max === null || s.breite > max.breite ? s : max),
    null,
  );
  const tischTiefen = couchtische.flatMap((c) => (c.tiefe ? [c.tiefe] : []));
  const tischTiefe = tischTiefen.length > 0 ? Math.max(...tischTiefen) : null;
  const tvBreite = fernseher.length > 0 ? Math.max(...fernseher.map((f) => f.breite)) : null;

  let inhalt;
  if (sofa === null) {
    inhalt = (
      <p className="text-muted">
        Für die Abstände brauche ich ein Sofa.{" "}
        <a href="#moebel-formular" className={linkKlasse}>
          Zurück zur Eingabe
        </a>
        .
      </p>
    );
  } else {
    const sofaTiefe = sofa.tiefe ?? 90;
    const e = empfehleAbstaende(raum, sofaTiefe, tischTiefe, couchtische.length > 0, tvBreite);
    inhalt = (
      <>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
          <dt className="text-muted">Sofa – Couchtisch</dt>
          <dd className="text-lg font-bold">
            {e.couchtisch.von}–{e.couchtisch.bis} cm
          </dd>
          <dt className="text-muted">Sofa – Fernseher</dt>
          <dd className="text-lg font-bold">{e.fernseher === null ? "–" : `etwa ${e.fernseher} cm`}</dd>
          <dt className="text-muted">Freier Laufweg</dt>
          <dd className="text-lg font-bold">{e.laufweg === null ? "–" : `${e.laufweg.frei} cm`}</dd>
        </dl>

        {e.fernseher === null && (
          <p className="mt-3 text-muted">
            Für den Fernsehabstand brauche ich einen Fernseher.{" "}
            <a href="#moebel-formular" className={linkKlasse}>
              Zurück zur Eingabe
            </a>
            .
          </p>
        )}
        {e.fernseherZuWeit && e.fernseher !== null && (
          <p className={warnKlasse}>
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Der empfohlene Fernsehabstand von {e.fernseher} cm passt nicht in den Raum. Ein kleinerer Fernseher
            würde näher ans Sofa passen.
          </p>
        )}

        {e.laufweg === null ? (
          <p className="mt-3 text-muted">
            Für den Laufweg brauche ich einen Raum.{" "}
            <a href="#raum-formular" className={linkKlasse}>
              Zurück zur Eingabe
            </a>
            .
          </p>
        ) : e.laufweg.fehlt > 0 ? (
          <p className={warnKlasse}>
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Der Laufweg ist zu schmal: Es bleiben {e.laufweg.frei} cm, empfohlen sind mindestens {LAUFWEG_MIN_CM}{" "}
            cm. Es fehlen {e.laufweg.fehlt} cm.
          </p>
        ) : (
          <p className="mt-3 text-muted">
            Der Laufweg reicht: {e.laufweg.frei} cm bei mindestens {LAUFWEG_MIN_CM} cm.
          </p>
        )}
        {e.laufweg && (
          <p className="mt-1 text-muted">
            Gerechnet mit der kurzen Raumseite vor dem Sofa: {e.laufweg.platzVorSofa} cm nach dem Sofa (
            {sofaTiefe} cm tief)
            {couchtische.length > 0 ? `, davon gehen der Tischabstand von ${e.couchtisch.von} cm` : ""}
            {couchtische.length > 0 && tischTiefe !== null ? ` und der Couchtisch (${tischTiefe} cm tief) ab` : ""}
            {couchtische.length > 0 && tischTiefe === null ? " ab (Tiefe des Couchtischs unbekannt)" : ""}.
          </p>
        )}

        <h3 className="mt-4 font-semibold">Regel</h3>
        <p>{ABSTAENDE_REGEL}</p>
        <h3 className="mt-4 font-semibold">Quelle</h3>
        <p>
          <a href={ABSTAENDE_QUELLE.url} className={linkKlasse} target="_blank" rel="noopener noreferrer">
            {ABSTAENDE_QUELLE.name}
          </a>
        </p>
      </>
    );
  }

  return (
    <details className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <summary className="flex min-h-11 cursor-pointer items-center text-xl font-semibold">
        Abstände und Laufwege
      </summary>
      <div className="mt-4" aria-live="polite">
        {inhalt}
      </div>
    </details>
  );
}

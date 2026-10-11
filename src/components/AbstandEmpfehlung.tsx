import { CircleAlert } from "lucide-react";
import {
  ABSTAENDE_QUELLE,
  ABSTAENDE_REGEL,
  COUCHTISCH_BIS_CM,
  COUCHTISCH_VON_CM,
  empfehleAbstaende,
  LAUFWEG_MIN_CM,
} from "@/lib/abstaende";
import { abstaendeAusLage } from "@/lib/grundriss";
import type { Platziert } from "@/lib/grundriss";

type Props = {
  raum: { laenge: number; breite: number } | null;
  sofas: { id: number; breite: number; tiefe?: number }[];
  couchtische: { id: number; tiefe?: number }[];
  fernseher: { breite: number }[];
  /** Lage jedes Möbelstücks im Grundriss, nach Nummer. Fehlt ein Eintrag, gilt die Annahme. */
  lagen: Record<number, Platziert>;
};

const linkKlasse = "inline-flex min-h-11 items-center font-normal text-foreground underline underline-offset-4";
const warnKlasse = "mt-2 flex items-start gap-2 font-medium text-foreground";

export default function AbstandEmpfehlung({ raum, sofas, couchtische, fernseher, lagen }: Props) {
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

    // Sobald das Sofa oder ein Couchtisch bewegt wurde, rechnen wir mit der Lage im Grundriss.
    const sofaLage = lagen[sofa.id];
    const tischLagen = couchtische.flatMap((c) => (lagen[c.id] ? [lagen[c.id]] : []));
    const ausLage =
      raum && sofaLage && (sofaLage.gesetzt || tischLagen.some((t) => t.gesetzt))
        ? abstaendeAusLage(raum, sofaLage, tischLagen)
        : null;
    const nichtVerschoben = ausLage
      ? [
          ...(sofaLage.gesetzt ? [] : ["das Sofa"]),
          ...(tischLagen.some((t) => !t.gesetzt) ? ["einen Couchtisch"] : []),
        ]
      : [];

    inhalt = (
      <>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
          <dt className="text-muted">Sofa – Couchtisch</dt>
          <dd className="text-lg font-medium">
            {e.couchtisch.von}–{e.couchtisch.bis} cm
          </dd>
          {ausLage?.tisch && (
            <>
              <dt className="text-muted">Im Grundriss</dt>
              <dd className="text-lg font-medium">{ausLage.tisch.abstand} cm</dd>
            </>
          )}
          <dt className="text-muted">Sofa – Fernseher</dt>
          <dd className="text-lg font-medium">{e.fernseher === null ? "–" : `etwa ${e.fernseher} cm`}</dd>
          <dt className="text-muted">Freier Laufweg</dt>
          <dd className="text-lg font-medium">
            {ausLage ? `${ausLage.frei} cm` : e.laufweg === null ? "–" : `${e.laufweg.frei} cm`}
          </dd>
        </dl>

        {ausLage?.tisch && ausLage.tisch.fehlt > 0 && (
          <p className={warnKlasse}>
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
            Der Couchtisch steht zu nah am Sofa: Es sind {ausLage.tisch.abstand} cm, empfohlen sind mindestens{" "}
            {COUCHTISCH_VON_CM} cm. Es fehlen {ausLage.tisch.fehlt} cm.
          </p>
        )}
        {ausLage?.tisch && ausLage.tisch.zuWeit > 0 && (
          <p className="mt-4 text-muted">
            Der Couchtisch steht weiter vom Sofa weg als empfohlen: {ausLage.tisch.abstand} cm statt höchstens{" "}
            {COUCHTISCH_BIS_CM} cm, das sind {ausLage.tisch.zuWeit} cm zu viel.
          </p>
        )}
        {ausLage?.tisch && ausLage.tisch.fehlt === 0 && ausLage.tisch.zuWeit === 0 && (
          <p className="mt-4 text-muted">
            Der Abstand zwischen Sofa und Couchtisch passt: {ausLage.tisch.abstand} cm bei {COUCHTISCH_VON_CM} bis{" "}
            {COUCHTISCH_BIS_CM} cm.
          </p>
        )}

        {e.fernseher === null && (
          <p className="mt-4 text-muted">
            Für den Fernsehabstand brauche ich einen Fernseher.{" "}
            <a href="#moebel-formular" className={linkKlasse}>
              Zurück zur Eingabe
            </a>
            .
          </p>
        )}
        {e.fernseherZuWeit && e.fernseher !== null && (
          <p className={warnKlasse}>
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
            Der empfohlene Fernsehabstand von {e.fernseher} cm passt nicht in den Raum. Ein kleinerer Fernseher
            würde näher ans Sofa passen.
          </p>
        )}

        {ausLage ? (
          ausLage.fehlt > 0 ? (
            <p className={warnKlasse}>
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
              Der Laufweg ist zu schmal: Es bleiben {ausLage.frei} cm, empfohlen sind mindestens {LAUFWEG_MIN_CM}{" "}
              cm. Es fehlen {ausLage.fehlt} cm.
            </p>
          ) : (
            <p className="mt-4 text-muted">
              Der Laufweg reicht: {ausLage.frei} cm bei mindestens {LAUFWEG_MIN_CM} cm.
            </p>
          )
        ) : e.laufweg === null ? (
          <p className="mt-4 text-muted">
            Für den Laufweg brauche ich einen Raum.{" "}
            <a href="#raum-formular" className={linkKlasse}>
              Zurück zur Eingabe
            </a>
            .
          </p>
        ) : e.laufweg.fehlt > 0 ? (
          <p className={warnKlasse}>
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
            Der Laufweg ist zu schmal: Es bleiben {e.laufweg.frei} cm, empfohlen sind mindestens {LAUFWEG_MIN_CM}{" "}
            cm. Es fehlen {e.laufweg.fehlt} cm.
          </p>
        ) : (
          <p className="mt-4 text-muted">
            Der Laufweg reicht: {e.laufweg.frei} cm bei mindestens {LAUFWEG_MIN_CM} cm.
          </p>
        )}
        {ausLage && (
          <>
            <p className="mt-2 text-muted">
              Aus der Lage im Grundriss gerechnet: Das Sofa blickt nach {ausLage.blickrichtung}, davor sind es{" "}
              {ausLage.platzVorSofa} cm bis zur Wand
              {ausLage.tischImWeg ? ", davon gehen Abstand und Tiefe des Couchtischs ab" : ""}.
            </p>
            {nichtVerschoben.length > 0 && (
              <p className="mt-2 text-muted">
                Noch nicht verschoben ist {nichtVerschoben.join(" und ")}; dafür gilt der Standardplatz nach der
                Annahme von prop-calc.
              </p>
            )}
          </>
        )}
        {e.laufweg && !ausLage && (
          <p className="mt-2 text-muted">
            Gerechnet mit der kurzen Raumseite vor dem Sofa: {e.laufweg.platzVorSofa} cm nach dem Sofa (
            {sofaTiefe} cm tief)
            {couchtische.length > 0 ? `, davon gehen der Tischabstand von ${e.couchtisch.von} cm` : ""}
            {couchtische.length > 0 && tischTiefe !== null ? ` und der Couchtisch (${tischTiefe} cm tief) ab` : ""}
            {couchtische.length > 0 && tischTiefe === null ? " ab (Tiefe des Couchtischs unbekannt)" : ""}.
          </p>
        )}

        <h3 className="mt-6 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Regel</h3>
        <p>{ABSTAENDE_REGEL}</p>
        <h3 className="mt-6 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Quelle</h3>
        <p>
          <a href={ABSTAENDE_QUELLE.url} className={linkKlasse} target="_blank" rel="noopener noreferrer">
            {ABSTAENDE_QUELLE.name}
          </a>
        </p>
      </>
    );
  }

  return (
    <details className="border-t border-foreground pt-2">
      <summary className="flex min-h-11 cursor-pointer items-center font-display text-h3 font-normal tracking-heading">
        Abstände und Laufwege
      </summary>
      <div className="mt-4" aria-live="polite">
        {inhalt}
      </div>
    </details>
  );
}

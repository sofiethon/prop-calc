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
const RICHTUNG = { unten: "the bottom", links: "the left", oben: "the top", rechts: "the right" } as const;
const warnKlasse = "mt-2 flex items-start gap-2 font-medium text-foreground";

export default function AbstandEmpfehlung({ raum, sofas, couchtische, fernseher, lagen }: Props) {
  // With several sofas the widest counts, for the coffee table the deepest, for the TV the widest.
  // If the sofa depth is missing (old entry), 90 cm is used, as in the rug recommendation.
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
        For the distances I need a sofa.{" "}
        <a href="#moebel-formular" className={linkKlasse}>
          Back to input
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
          ...(sofaLage.gesetzt ? [] : ["the sofa"]),
          ...(tischLagen.some((t) => !t.gesetzt) ? ["a coffee table"] : []),
        ]
      : [];

    inhalt = (
      <>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
          <dt className="text-muted">Sofa to coffee table</dt>
          <dd className="text-lg font-medium">
            {e.couchtisch.von}–{e.couchtisch.bis} cm
          </dd>
          {ausLage?.tisch && (
            <>
              <dt className="text-muted">In the floor plan</dt>
              <dd className="text-lg font-medium">{ausLage.tisch.abstand} cm</dd>
            </>
          )}
          <dt className="text-muted">Sofa to TV</dt>
          <dd className="text-lg font-medium">{e.fernseher === null ? "–" : `about ${e.fernseher} cm`}</dd>
          <dt className="text-muted">Clear walkway</dt>
          <dd className="text-lg font-medium">
            {ausLage ? `${ausLage.frei} cm` : e.laufweg === null ? "–" : `${e.laufweg.frei} cm`}
          </dd>
        </dl>

        {ausLage?.tisch && ausLage.tisch.fehlt > 0 && (
          <p className={warnKlasse}>
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
            The coffee table is too close to the sofa: it is {ausLage.tisch.abstand} cm, at least{" "}
            {COUCHTISCH_VON_CM} cm is recommended. {ausLage.tisch.fehlt} cm are missing.
          </p>
        )}
        {ausLage?.tisch && ausLage.tisch.zuWeit > 0 && (
          <p className="mt-4 text-muted">
            The coffee table is further from the sofa than recommended: {ausLage.tisch.abstand} cm instead of at most{" "}
            {COUCHTISCH_BIS_CM} cm, which is {ausLage.tisch.zuWeit} cm too much.
          </p>
        )}
        {ausLage?.tisch && ausLage.tisch.fehlt === 0 && ausLage.tisch.zuWeit === 0 && (
          <p className="mt-4 text-muted">
            The distance between sofa and coffee table fits: {ausLage.tisch.abstand} cm within {COUCHTISCH_VON_CM} to{" "}
            {COUCHTISCH_BIS_CM} cm.
          </p>
        )}

        {e.fernseher === null && (
          <p className="mt-4 text-muted">
            For the TV distance I need a TV.{" "}
            <a href="#moebel-formular" className={linkKlasse}>
              Back to input
            </a>
            .
          </p>
        )}
        {e.fernseherZuWeit && e.fernseher !== null && (
          <p className={warnKlasse}>
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
            The recommended TV distance of {e.fernseher} cm does not fit in the room. A smaller TV
            would fit closer to the sofa.
          </p>
        )}

        {ausLage ? (
          ausLage.fehlt > 0 ? (
            <p className={warnKlasse}>
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
              The walkway is too narrow: {ausLage.frei} cm remain, at least {LAUFWEG_MIN_CM}{" "}
              cm is recommended. {ausLage.fehlt} cm are missing.
            </p>
          ) : (
            <p className="mt-4 text-muted">
              The walkway is wide enough: {ausLage.frei} cm, at least {LAUFWEG_MIN_CM} cm needed.
            </p>
          )
        ) : e.laufweg === null ? (
          <p className="mt-4 text-muted">
            For the walkway I need a room.{" "}
            <a href="#raum-formular" className={linkKlasse}>
              Back to input
            </a>
            .
          </p>
        ) : e.laufweg.fehlt > 0 ? (
          <p className={warnKlasse}>
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
            The walkway is too narrow: {e.laufweg.frei} cm remain, at least {LAUFWEG_MIN_CM}{" "}
            cm is recommended. {e.laufweg.fehlt} cm are missing.
          </p>
        ) : (
          <p className="mt-4 text-muted">
            The walkway is wide enough: {e.laufweg.frei} cm, at least {LAUFWEG_MIN_CM} cm needed.
          </p>
        )}
        {ausLage && (
          <>
            <p className="mt-2 text-muted">
              Calculated from the position in the floor plan: the sofa faces {RICHTUNG[ausLage.blickrichtung]}, with{" "}
              {ausLage.platzVorSofa} cm to the wall in front of it
              {ausLage.tischImWeg ? ", of which the distance and depth of the coffee table are deducted" : ""}.
            </p>
            {nichtVerschoben.length > 0 && (
              <p className="mt-2 text-muted">
                Not yet moved: {nichtVerschoben.join(" and ")}; the default position based on the
                prop-calc assumption applies.
              </p>
            )}
          </>
        )}
        {e.laufweg && !ausLage && (
          <p className="mt-2 text-muted">
            Calculated with the short side of the room in front of the sofa: {e.laufweg.platzVorSofa} cm after the sofa (
            {sofaTiefe} cm deep)
            {couchtische.length > 0 ? `, of which the table distance of ${e.couchtisch.von} cm` : ""}
            {couchtische.length > 0 && tischTiefe !== null ? ` and the coffee table (${tischTiefe} cm deep) are deducted` : ""}
            {couchtische.length > 0 && tischTiefe === null ? " are deducted (depth of the coffee table unknown)" : ""}.
          </p>
        )}

        <h3 className="mt-6 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Rule</h3>
        <p>{ABSTAENDE_REGEL}</p>
        <h3 className="mt-6 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Source</h3>
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
        Distances and walkways
      </summary>
      <div className="mt-4" aria-live="polite">
        {inhalt}
      </div>
    </details>
  );
}

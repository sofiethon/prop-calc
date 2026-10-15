import { CircleAlert } from "lucide-react";
import {
  BETT_PLATZ_KOMFORT_CM,
  BETT_PLATZ_MIN_CM,
  BETT_PLATZ_QUELLEN,
  BETT_PLATZ_REGEL,
  NACHTTISCH_QUELLEN,
  NACHTTISCH_REGEL,
  nachttischHoehe,
} from "@/lib/bett";
import { bettFreiraumAusLage } from "@/lib/grundriss";
import type { Platziert } from "@/lib/grundriss";

type Bett = { id: number; breite: number; tiefe: number; hoehe: number };

type Props = {
  raum: { laenge: number; breite: number; hoehe: number } | null;
  betten: Bett[];
  /** Lage jedes Möbelstücks im Grundriss, nach Nummer. */
  lagen: Record<number, Platziert>;
};

const linkKlasse = "inline-flex min-h-11 items-center font-normal text-foreground underline underline-offset-4";
const warnKlasse = "mt-2 flex items-start gap-2 font-medium text-foreground";
const SEITE = { left: "left side", right: "right side", foot: "foot end" } as const;
const BIS_ZU = {
  Wand: "the wall",
  Sofa: "the sofa",
  Couchtisch: "the coffee table",
  Esstisch: "the dining table",
  Bett: "another bed",
} as const;

function Quellen({ regel, quellen }: { regel: string; quellen: { name: string; url: string }[] }) {
  return (
    <>
      <h4 className="mt-4 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Rule</h4>
      <p>{regel}</p>
      <h4 className="mt-4 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">
        {quellen.length > 1 ? "Sources" : "Source"}
      </h4>
      <ul className="list-disc pl-6">
        {quellen.map((q) => (
          <li key={q.url}>
            <a href={q.url} className={linkKlasse} target="_blank" rel="noopener noreferrer">
              {q.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function BettEmpfehlung({ raum, betten, lagen }: Props) {
  // With several beds, the largest one counts.
  const bett = betten.reduce<Bett | null>(
    (max, b) => (max === null || b.breite * b.tiefe > max.breite * max.tiefe ? b : max),
    null,
  );

  let inhalt;
  if (bett === null) {
    inhalt = (
      <p className="text-muted">
        For this recommendation I need a bed.{" "}
        <a href="#moebel-formular" className={linkKlasse}>
          Back to input
        </a>
        .
      </p>
    );
  } else {
    const hoehe = nachttischHoehe(bett.hoehe);
    const lage = raum ? lagen[bett.id] : undefined;
    const e = raum && lage ? bettFreiraumAusLage(raum, lage, Object.values(lagen)) : null;
    const engste = e ? e.seiten.reduce((min, s) => (s.frei < min.frei ? s : min)) : null;

    inhalt = (
      <>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
          <dt className="text-muted">Nightstand, top surface</dt>
          <dd className="text-lg font-medium">
            {hoehe.von}–{hoehe.bis} cm above the floor
          </dd>
          <dt className="text-muted">Clearance, each side and foot</dt>
          <dd className="text-lg font-medium">
            at least {BETT_PLATZ_MIN_CM} cm ({BETT_PLATZ_KOMFORT_CM} cm comfortable)
          </dd>
        </dl>

        {e === null || !engste ? (
          <p className="mt-4 text-muted">
            For the actual clearance around the bed I need a room.{" "}
            <a href="#raum-formular" className={linkKlasse}>
              Back to input
            </a>
            .
          </p>
        ) : (
          <>
            {e.ueberlappt && (
              <p className={warnKlasse}>
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
                The bed overlaps another piece of furniture in the floor plan. There is no clearance there.
              </p>
            )}
            {e.seiten
              .filter((s) => s.fehlt > 0)
              .map((s) => (
                <p key={s.seite} className={warnKlasse}>
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
                  It is too tight at the {SEITE[s.seite]}: {s.frei} cm remain to {BIS_ZU[s.hindernis]}, at least{" "}
                  {BETT_PLATZ_MIN_CM} cm is recommended. {s.fehlt} cm are missing.
                </p>
              ))}
            {!e.ueberlappt && engste.fehlt === 0 && (
              <p className="mt-4 text-muted">
                The clearance is sufficient: it is tightest at the {SEITE[engste.seite]} with {engste.frei} cm to{" "}
                {BIS_ZU[engste.hindernis]}, at least {BETT_PLATZ_MIN_CM} cm needed
                {engste.frei < BETT_PLATZ_KOMFORT_CM ? `; ${BETT_PLATZ_KOMFORT_CM} cm would be comfortable.` : "."}
              </p>
            )}
            <p className="mt-2 text-muted">
              {lage?.gesetzt
                ? "Calculated from the position in the floor plan."
                : "Calculated with the default position (assumption of prop-calc): headboard against the top wall, centred."}{" "}
              Windows and doors are not counted.
            </p>
          </>
        )}

        <h3 className="mt-8 text-lg font-medium">Rules and sources</h3>
        <h4 className="mt-4 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Space around the bed</h4>
        <Quellen regel={BETT_PLATZ_REGEL} quellen={BETT_PLATZ_QUELLEN} />
        <h4 className="mt-6 font-medium">Nightstand height</h4>
        <Quellen regel={NACHTTISCH_REGEL} quellen={NACHTTISCH_QUELLEN} />
      </>
    );
  }

  return (
    <details className="border-t border-foreground pt-2">
      <summary className="flex min-h-11 cursor-pointer items-center font-display text-h3 font-normal tracking-heading">
        Bed and nightstand
      </summary>
      <div className="mt-4" aria-live="polite">
        {inhalt}
      </div>
    </details>
  );
}

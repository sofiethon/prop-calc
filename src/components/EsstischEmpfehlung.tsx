import { CircleAlert } from "lucide-react";
import {
  empfehleEsstisch,
  LEUCHTE_QUELLEN,
  LEUCHTE_REGEL,
  PERSONEN_QUELLEN,
  PERSONEN_REGEL,
  PLATZ_DURCHGANG_BIS_CM,
  PLATZ_DURCHGANG_VON_CM,
  PLATZ_MIN_CM,
  PLATZ_QUELLEN,
  PLATZ_REGEL,
} from "@/lib/esstisch";
import type { Esstisch } from "@/lib/esstisch";
import { freiraumAusLage } from "@/lib/grundriss";
import type { Platziert, Seite } from "@/lib/grundriss";

type EsstischMitNummer = Esstisch & { id: number };

type Props = {
  raum: { laenge: number; breite: number; hoehe: number } | null;
  tische: EsstischMitNummer[];
  /** Lage jedes Möbelstücks im Grundriss, nach Nummer. Fehlt ein Eintrag, gilt die Annahme. */
  lagen: Record<number, Platziert>;
};

const linkKlasse = "inline-flex min-h-11 items-center font-normal text-foreground underline underline-offset-4";
const warnKlasse = "mt-2 flex items-start gap-2 font-medium text-foreground";

const SEITE_ADJEKTIV: Record<Seite, string> = {
  links: "left",
  rechts: "right",
  oben: "top",
  unten: "bottom",
};
const BIS_ZU = { Wand: "the wall", Sofa: "the sofa", Couchtisch: "the coffee table", Esstisch: "the dining table", Bett: "the bed" } as const;

function Quellen({ regel, quellen }: { regel: string; quellen: { name: string; url: string }[] }) {
  return (
    <>
      <h4 className="mt-4 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Rule</h4>
      <p>{regel}</p>
      <h4 className="mt-4 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">{quellen.length > 1 ? "Sources" : "Source"}</h4>
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

export default function EsstischEmpfehlung({ raum, tische, lagen }: Props) {
  // With several dining tables, the largest one counts (by its larger dimension).
  const tisch = tische.reduce<EsstischMitNummer | null>(
    (max, t) => (max === null || Math.max(t.breite, t.tiefe) > Math.max(max.breite, max.tiefe) ? t : max),
    null,
  );

  let inhalt;
  if (tisch === null) {
    inhalt = (
      <p className="text-muted">
        For this recommendation I need a dining table.{" "}
        <a href="#moebel-formular" className={linkKlasse}>
          Back to input
        </a>
        .
      </p>
    );
  } else {
    const e = empfehleEsstisch(tisch, raum);

    // Wurde der Tisch bewegt, rechnen wir den Freiraum aus seiner Lage im Grundriss.
    const tischLage = lagen[tisch.id];
    const ausLage =
      raum && tischLage?.gesetzt ? freiraumAusLage(raum, tischLage, Object.values(lagen)) : null;

    inhalt = (
      <>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
          <dt className="text-muted">Seats</dt>
          <dd className="text-lg font-medium">
            {e.personen.von === e.personen.bis ? e.personen.von : `${e.personen.von}–${e.personen.bis}`} people
          </dd>
          <dt className="text-muted">Light, diameter</dt>
          <dd className="text-lg font-medium">
            {e.leuchteDurchmesser.von}–{e.leuchteDurchmesser.bis} cm
          </dd>
          <dt className="text-muted">Light, lower edge</dt>
          <dd className="text-lg font-medium">
            {e.leuchteHoeheUeberTisch.von}–{e.leuchteHoeheUeberTisch.bis} cm above the tabletop
          </dd>
        </dl>

        {e.leuchteImRaum === null ? (
          <p className="mt-4 text-muted">
            For the height above the floor and the clearance I need a room.{" "}
            <a href="#raum-formular" className={linkKlasse}>
              Back to input
            </a>
            .
          </p>
        ) : e.leuchteImRaum.art === "hinweis" ? (
          <p className={warnKlasse}>
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
            {e.leuchteImRaum.grund}
          </p>
        ) : (
          <p className="mt-4 text-muted">
            The lower edge of the light hangs {e.leuchteImRaum.von}–{e.leuchteImRaum.bis} cm above the floor (table{" "}
            {tisch.hoehe} cm high), at least {e.leuchteImRaum.platzBisDecke} cm remain up to the ceiling.
          </p>
        )}

        {ausLage &&
          (ausLage.ueberlappt ? (
            <p className={warnKlasse}>
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
              The table overlaps {BIS_ZU[ausLage.hindernis]} in the
              floor plan. There is no clearance there, at least {PLATZ_MIN_CM} cm is recommended.
            </p>
          ) : ausLage.fehlt > 0 ? (
            <p className={warnKlasse}>
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
              It is too tight around the table: on the {SEITE_ADJEKTIV[ausLage.seite]} side {ausLage.frei} cm remain to{" "}
              {BIS_ZU[ausLage.hindernis]}, at least {PLATZ_MIN_CM} cm is recommended. {ausLage.fehlt} cm are missing.
            </p>
          ) : (
            <p className="mt-4 text-muted">
              The clearance is sufficient: it is tightest on the {SEITE_ADJEKTIV[ausLage.seite]} side with {ausLage.frei}{" "}
              cm to {BIS_ZU[ausLage.hindernis]}, at least {PLATZ_MIN_CM} cm needed
              {ausLage.frei < PLATZ_DURCHGANG_VON_CM
                ? `; for a passage behind the chairs ${PLATZ_DURCHGANG_VON_CM}–${PLATZ_DURCHGANG_BIS_CM} cm would be needed.`
                : "."}
            </p>
          ))}
        {ausLage && (
          <p className="mt-2 text-muted">
            Calculated from the position in the floor plan: the smallest distance from the table edge to walls and other furniture.
          </p>
        )}
        {!ausLage &&
          e.platz &&
          (e.platz.fehlt > 0 ? (
            <p className={warnKlasse}>
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
              It is too tight around the table: {e.platz.frei} cm remain per side, at least{" "}
              {PLATZ_MIN_CM} cm is recommended. {e.platz.fehlt} cm per side are missing, the room would need to be at least{" "}
              {e.platz.mindestBreite} cm wide.
            </p>
          ) : (
            <p className="mt-4 text-muted">
              The clearance is sufficient: {e.platz.frei} cm per side, at least {PLATZ_MIN_CM} cm needed
              {e.platz.frei < PLATZ_DURCHGANG_VON_CM
                ? `; for a passage behind the chairs ${PLATZ_DURCHGANG_VON_CM}–${PLATZ_DURCHGANG_BIS_CM} cm would be needed.`
                : "."}
            </p>
          ))}
        {!ausLage && e.platz && (
          <p className="mt-2 text-muted">
            Calculated with the short side of the room and the table centred in it: {e.platz.tischMass} cm table size, the rest
            is split between both sides.
          </p>
        )}

        <h3 className="mt-8 text-lg font-medium">Rules and sources</h3>
        <h4 className="mt-4 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Space around the table</h4>
        <Quellen regel={PLATZ_REGEL} quellen={PLATZ_QUELLEN} />
        <h4 className="mt-6 font-medium">People at the table</h4>
        <Quellen regel={PERSONEN_REGEL} quellen={PERSONEN_QUELLEN} />
        <h4 className="mt-6 font-medium">Light</h4>
        <Quellen regel={LEUCHTE_REGEL} quellen={LEUCHTE_QUELLEN} />
      </>
    );
  }

  return (
    <details className="border-t border-foreground pt-2">
      <summary className="flex min-h-11 cursor-pointer items-center font-display text-h3 font-normal tracking-heading">
        Dining table and light
      </summary>
      <div className="mt-4" aria-live="polite">
        {inhalt}
      </div>
    </details>
  );
}

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

type Props = {
  raum: { laenge: number; breite: number; hoehe: number } | null;
  tische: Esstisch[];
};

const linkKlasse = "inline-block font-medium text-foreground underline";
const warnKlasse = "mt-1 flex items-start gap-1.5 font-medium text-accent";

function Quellen({ regel, quellen }: { regel: string; quellen: { name: string; url: string }[] }) {
  return (
    <>
      <h4 className="mt-3 font-semibold">Regel</h4>
      <p>{regel}</p>
      <h4 className="mt-3 font-semibold">{quellen.length > 1 ? "Quellen" : "Quelle"}</h4>
      <ul className="list-disc pl-5">
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

export default function EsstischEmpfehlung({ raum, tische }: Props) {
  // Bei mehreren Esstischen zählt der größte (nach dem größeren Maß).
  const tisch = tische.reduce<Esstisch | null>(
    (max, t) => (max === null || Math.max(t.breite, t.tiefe) > Math.max(max.breite, max.tiefe) ? t : max),
    null,
  );

  let inhalt;
  if (tisch === null) {
    inhalt = (
      <p className="text-muted">
        Für diese Empfehlung brauche ich einen Esstisch.{" "}
        <a href="#moebel-formular" className={linkKlasse}>
          Zurück zur Eingabe
        </a>
        .
      </p>
    );
  } else {
    const e = empfehleEsstisch(tisch, raum);
    inhalt = (
      <>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
          <dt className="text-muted">Platz für</dt>
          <dd className="text-lg font-bold">
            {e.personen.von === e.personen.bis ? e.personen.von : `${e.personen.von}–${e.personen.bis}`} Personen
          </dd>
          <dt className="text-muted">Leuchte, Durchmesser</dt>
          <dd className="text-lg font-bold">
            {e.leuchteDurchmesser.von}–{e.leuchteDurchmesser.bis} cm
          </dd>
          <dt className="text-muted">Leuchte, Unterkante</dt>
          <dd className="text-lg font-bold">
            {e.leuchteHoeheUeberTisch.von}–{e.leuchteHoeheUeberTisch.bis} cm über der Tischplatte
          </dd>
        </dl>

        {e.leuchteImRaum === null ? (
          <p className="mt-3 text-muted">
            Für die Höhe über dem Boden und den Freiraum brauche ich einen Raum.{" "}
            <a href="#raum-formular" className={linkKlasse}>
              Zurück zur Eingabe
            </a>
            .
          </p>
        ) : e.leuchteImRaum.art === "hinweis" ? (
          <p className={warnKlasse}>
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {e.leuchteImRaum.grund}
          </p>
        ) : (
          <p className="mt-3 text-muted">
            Die Unterkante der Leuchte hängt {e.leuchteImRaum.von}–{e.leuchteImRaum.bis} cm über dem Boden (Tisch{" "}
            {tisch.hoehe} cm hoch), bis zur Decke bleiben mindestens {e.leuchteImRaum.platzBisDecke} cm.
          </p>
        )}

        {e.platz &&
          (e.platz.fehlt > 0 ? (
            <p className={warnKlasse}>
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Um den Tisch ist es zu eng: Es bleiben {e.platz.frei} cm je Seite, empfohlen sind mindestens{" "}
              {PLATZ_MIN_CM} cm. Es fehlen {e.platz.fehlt} cm je Seite, der Raum müsste mindestens{" "}
              {e.platz.mindestBreite} cm breit sein.
            </p>
          ) : (
            <p className="mt-3 text-muted">
              Der Freiraum reicht: {e.platz.frei} cm je Seite bei mindestens {PLATZ_MIN_CM} cm
              {e.platz.frei < PLATZ_DURCHGANG_VON_CM
                ? `; für einen Durchgang hinter den Stühlen wären ${PLATZ_DURCHGANG_VON_CM}–${PLATZ_DURCHGANG_BIS_CM} cm nötig.`
                : "."}
            </p>
          ))}
        {e.platz && (
          <p className="mt-1 text-muted">
            Gerechnet mit der kurzen Raumseite und dem Tisch mittig darin: {e.platz.tischMass} cm Tischmaß, der Rest
            teilt sich auf beide Seiten.
          </p>
        )}

        <h3 className="mt-4 text-lg font-semibold">Regeln und Quellen</h3>
        <h4 className="mt-3 font-semibold">Platz um den Tisch</h4>
        <Quellen regel={PLATZ_REGEL} quellen={PLATZ_QUELLEN} />
        <h4 className="mt-4 font-semibold">Personen am Tisch</h4>
        <Quellen regel={PERSONEN_REGEL} quellen={PERSONEN_QUELLEN} />
        <h4 className="mt-4 font-semibold">Leuchte</h4>
        <Quellen regel={LEUCHTE_REGEL} quellen={LEUCHTE_QUELLEN} />
      </>
    );
  }

  return (
    <details className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <summary className="flex min-h-11 cursor-pointer items-center text-xl font-semibold">
        Esstisch und Leuchte
      </summary>
      <div className="mt-4" aria-live="polite">
        {inhalt}
      </div>
    </details>
  );
}

import { CircleAlert } from "lucide-react";
import { empfehleVorhang, VORHANG_QUELLE, VORHANG_REGEL } from "@/lib/vorhang";

type Props = {
  raum: { hoehe: number } | null;
  fenster: { id: number; breite: number; hoehe: number }[];
};

const linkKlasse = "inline-block font-medium text-foreground underline";

function zahl(n: number) {
  return n.toLocaleString("de-DE", { maximumFractionDigits: 1 });
}

export default function VorhangEmpfehlung({ raum, fenster }: Props) {
  let inhalt;
  if (raum === null || fenster.length === 0) {
    inhalt = (
      <p className="text-muted">
        Für die Empfehlung brauche ich {raum === null ? "einen Raum" : ""}
        {raum === null && fenster.length === 0 ? " und " : ""}
        {fenster.length === 0 ? "ein Fenster" : ""}.{" "}
        <a href={raum === null ? "#raum-formular" : "#moebel-formular"} className={linkKlasse}>
          Zurück zur Eingabe
        </a>
        .
      </p>
    );
  } else {
    inhalt = (
      <>
        <ul className="flex flex-col gap-4">
          {fenster.map((f, i) => {
            const e = empfehleVorhang(f.breite, f.hoehe, raum.hoehe);
            return (
              <li key={f.id} className="rounded-lg border border-border p-3">
                <h3 className="font-semibold">
                  Fenster {i + 1} ({zahl(f.breite)} × {zahl(f.hoehe)} cm)
                </h3>
                {e.art === "hinweis" ? (
                  <p className="mt-2 flex items-start gap-1.5 font-medium text-accent">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {e.grund}
                  </p>
                ) : (
                  <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                    <dt className="text-muted">Stangenbreite</dt>
                    <dd className="text-lg font-bold">{zahl(e.breite)} cm</dd>
                    <dt className="text-muted">Stangenhöhe</dt>
                    <dd className="text-lg font-bold">{e.abstandOben} cm über dem Fensterrahmen</dd>
                  </dl>
                )}
              </li>
            );
          })}
        </ul>
        <h3 className="mt-4 font-semibold">Regel</h3>
        <p>{VORHANG_REGEL}</p>
        <h3 className="mt-4 font-semibold">Quelle</h3>
        <p>
          <a href={VORHANG_QUELLE.url} className={linkKlasse} target="_blank" rel="noopener noreferrer">
            {VORHANG_QUELLE.name}
          </a>
        </p>
      </>
    );
  }

  return (
    <details className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <summary className="flex min-h-11 cursor-pointer items-center text-xl font-semibold">
        Vorhangempfehlung
      </summary>
      <div className="mt-4" aria-live="polite">
        {inhalt}
      </div>
    </details>
  );
}

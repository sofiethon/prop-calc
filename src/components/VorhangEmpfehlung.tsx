import { CircleAlert } from "lucide-react";
import type { Wand } from "@/lib/fenster";
import { empfehleVorhang, stangePlatzHinweise, VORHANG_QUELLE, VORHANG_REGEL } from "@/lib/vorhang";

type Props = {
  raum: { laenge: number; breite: number; hoehe: number } | null;
  fenster: { id: number; breite: number; hoehe: number; wand?: Wand; abstand?: number }[];
};

const linkKlasse = "inline-flex min-h-11 items-center font-normal text-foreground underline underline-offset-4";

function zahl(n: number) {
  return n.toLocaleString("en-GB", { maximumFractionDigits: 1 });
}

export default function VorhangEmpfehlung({ raum, fenster }: Props) {
  let inhalt;
  if (raum === null || fenster.length === 0) {
    inhalt = (
      <p className="text-muted">
        For the recommendation I need {raum === null ? "a room" : ""}
        {raum === null && fenster.length === 0 ? " and " : ""}
        {fenster.length === 0 ? "a window" : ""}.{" "}
        <a href={raum === null ? "#raum-formular" : "#moebel-formular"} className={linkKlasse}>
          Back to input
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
            const platz =
              e.art === "stange" && f.wand !== undefined && f.abstand !== undefined
                ? stangePlatzHinweise(f.wand, f.abstand, f.breite, raum)
                : [];
            return (
              <li key={f.id} className="rounded-sm border border-border p-3">
                <h3 className="font-medium">
                  Window {i + 1} ({zahl(f.breite)} × {zahl(f.hoehe)} cm)
                </h3>
                {e.art === "hinweis" ? (
                  <p className="mt-2 flex items-start gap-2 font-medium text-foreground">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
                    {e.grund}
                  </p>
                ) : (
                  <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                    <dt className="text-muted">Rod width</dt>
                    <dd className="text-lg font-medium">{zahl(e.breite)} cm</dd>
                    <dt className="text-muted">Rod height</dt>
                    <dd className="text-lg font-medium">{e.abstandOben} cm above the window frame</dd>
                  </dl>
                )}
                {platz.map((h) => (
                  <p key={h} className="mt-2 flex items-start gap-2 font-medium text-foreground">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
                    {h}
                  </p>
                ))}
              </li>
            );
          })}
        </ul>
        <h3 className="mt-6 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Rule</h3>
        <p>{VORHANG_REGEL}</p>
        <h3 className="mt-6 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Source</h3>
        <p>
          <a href={VORHANG_QUELLE.url} className={linkKlasse} target="_blank" rel="noopener noreferrer">
            {VORHANG_QUELLE.name}
          </a>
        </p>
      </>
    );
  }

  return (
    <details className="border-t border-foreground pt-2">
      <summary className="flex min-h-11 cursor-pointer items-center font-display text-h3 font-normal tracking-heading">
        Curtain recommendation
      </summary>
      <div className="mt-4" aria-live="polite">
        {inhalt}
      </div>
    </details>
  );
}

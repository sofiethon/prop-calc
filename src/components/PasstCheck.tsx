"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { CircleCheck, CircleX, TriangleAlert } from "lucide-react";
import Fehler from "@/components/Fehler";
import { bewerteStange, bewerteTeppich, TOLERANZ_CM } from "@/lib/passtcheck";
import type { Bewertung } from "@/lib/passtcheck";
import { TEPPICH_QUELLE, TEPPICH_REGEL } from "@/lib/teppich";
import { VORHANG_QUELLE, VORHANG_REGEL } from "@/lib/vorhang";
import { leseZentimeter } from "@/lib/zentimeter";

type Props = {
  raum: { laenge: number; breite: number } | null;
  sofas: { breite: number; tiefe?: number }[];
  fenster: { id: number; breite: number; hoehe: number }[];
};

type Gepruefte = { art: "Teppich"; a: number; b: number } | { art: "Stange"; breite: number; fensterId: number };

const linkKlasse = "inline-block font-medium text-foreground underline";
const feldKlasse = "mt-1 block min-h-11 w-full rounded-lg border border-border bg-card px-3 text-base";
const knopfKlasse =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-4 font-semibold text-background";

function zahl(n: number) {
  return n.toLocaleString("de-DE", { maximumFractionDigits: 1 });
}

function Stufe({ bewertung }: { bewertung: Bewertung }) {
  const Icon = bewertung.stufe === "passt" ? CircleCheck : bewertung.stufe === "grenzwertig" ? TriangleAlert : CircleX;
  const farbe = bewertung.stufe === "passt" ? "text-foreground" : "text-accent";
  return (
    <p className={`flex items-center gap-2 text-2xl font-bold ${farbe}`}>
      <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
      {bewertung.stufe === "passt" ? "Passt" : bewertung.stufe === "grenzwertig" ? "Grenzwertig" : bewertung.stufe === "zu klein" ? "Zu klein" : "Zu groß"}
    </p>
  );
}

export default function PasstCheck({ raum, sofas, fenster }: Props) {
  const uid = useId();
  const [art, setArt] = useState<"Teppich" | "Stange">("Teppich");
  const [fehler, setFehler] = useState<Record<string, string>>({});
  const [geprueft, setGeprueft] = useState<Gepruefte | null>(null);

  // Bei mehreren Sofas zählt das breiteste; fehlt die Tiefe (alter Eintrag), rechnen wir mit 90 cm.
  const sofa = sofas.reduce<(typeof sofas)[number] | null>(
    (max, s) => (max === null || s.breite > max.breite ? s : max),
    null,
  );

  function pruefen(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const daten = new FormData(e.currentTarget);
    const neu: Record<string, string> = {};
    if (art === "Teppich") {
      const a = leseZentimeter(String(daten.get("a") ?? ""));
      const b = leseZentimeter(String(daten.get("b") ?? ""));
      if ("fehler" in a) neu.a = a.fehler;
      if ("fehler" in b) neu.b = b.fehler;
      setFehler(neu);
      if ("wert" in a && "wert" in b) setGeprueft({ art: "Teppich", a: a.wert, b: b.wert });
      else setGeprueft(null);
    } else {
      const breite = leseZentimeter(String(daten.get("breite") ?? ""));
      if ("fehler" in breite) neu.breite = breite.fehler;
      setFehler(neu);
      if ("wert" in breite) setGeprueft({ art: "Stange", breite: breite.wert, fensterId: Number(daten.get("fenster")) });
      else setGeprueft(null);
    }
  }

  function artWechseln(neu: "Teppich" | "Stange") {
    setArt(neu);
    setFehler({});
    setGeprueft(null);
  }

  let bewertung: Bewertung | null = null;
  let regel = TEPPICH_REGEL;
  let quelle = TEPPICH_QUELLE;
  if (raum && geprueft) {
    if (geprueft.art === "Teppich" && sofa) {
      bewertung = bewerteTeppich(geprueft.a, geprueft.b, raum.laenge, raum.breite, sofa.breite, sofa.tiefe ?? 90);
    } else if (geprueft.art === "Stange") {
      const f = fenster.find((x) => x.id === geprueft.fensterId);
      if (f) {
        bewertung = bewerteStange(geprueft.breite, f.breite);
        regel = VORHANG_REGEL;
        quelle = VORHANG_QUELLE;
      }
    }
  }

  let inhalt;
  if (raum === null) {
    inhalt = (
      <p className="text-muted">
        Für den Passt-Check brauche ich einen Raum.{" "}
        <a href="#raum-formular" className={linkKlasse}>
          Zurück zur Eingabe
        </a>
        .
      </p>
    );
  } else {
    const fehlt = art === "Teppich" ? sofa === null : fenster.length === 0;
    inhalt = (
      <>
        <form onSubmit={pruefen} noValidate className="flex flex-col gap-4">
          <div>
            <label htmlFor={`${uid}-art`} className="font-medium">
              Was möchtest du prüfen?
            </label>
            <select
              id={`${uid}-art`}
              value={art}
              onChange={(e) => artWechseln(e.target.value as "Teppich" | "Stange")}
              className={feldKlasse}
            >
              <option value="Teppich">Teppich</option>
              <option value="Stange">Vorhangstange</option>
            </select>
          </div>

          {fehlt ? (
            <p className="text-muted">
              Dafür brauche ich {art === "Teppich" ? "ein Sofa" : "ein Fenster"}.{" "}
              <a href="#moebel-formular" className={linkKlasse}>
                Zurück zur Eingabe
              </a>
              .
            </p>
          ) : (
            <>
              {art === "Teppich" ? (
                <>
                  <p className="text-muted">Die längere Seite legen wir parallel zum Sofa, die Reihenfolge ist egal.</p>
                  {(
                    [
                      ["a", "Erste Seite"],
                      ["b", "Zweite Seite"],
                    ] as const
                  ).map(([name, label]) => (
                    <div key={name}>
                      <label htmlFor={`${uid}-${name}`} className="font-medium">
                        {label} <span className="font-normal text-muted">(in cm)</span>
                      </label>
                      <input
                        id={`${uid}-${name}`}
                        name={name}
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        aria-invalid={fehler[name] ? true : undefined}
                        aria-describedby={fehler[name] ? `${uid}-${name}-fehler` : undefined}
                        className={feldKlasse}
                      />
                      <Fehler id={`${uid}-${name}-fehler`} text={fehler[name]} />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor={`${uid}-fenster`} className="font-medium">
                      Für welches Fenster?
                    </label>
                    <select id={`${uid}-fenster`} name="fenster" className={feldKlasse}>
                      {fenster.map((f, i) => (
                        <option key={f.id} value={f.id}>
                          Fenster {i + 1} ({zahl(f.breite)} × {zahl(f.hoehe)} cm)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`${uid}-breite`} className="font-medium">
                      Breite der Stange <span className="font-normal text-muted">(in cm)</span>
                    </label>
                    <input
                      id={`${uid}-breite`}
                      name="breite"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      aria-invalid={fehler.breite ? true : undefined}
                      aria-describedby={fehler.breite ? `${uid}-breite-fehler` : undefined}
                      className={feldKlasse}
                    />
                    <Fehler id={`${uid}-breite-fehler`} text={fehler.breite} />
                  </div>
                </>
              )}
              <button type="submit" className={knopfKlasse}>
                Prüfen
              </button>
            </>
          )}
        </form>

        <div className="mt-4" aria-live="polite">
          {bewertung && (
            <>
              <Stufe bewertung={bewertung} />
              <p className="mt-1">{bewertung.grund}</p>
              <h3 className="mt-4 font-semibold">Regel</h3>
              <p>
                {regel} „Grenzwertig“ heißt: höchstens {TOLERANZ_CM} cm neben dem Richtwert (Annahme von Proportio).
              </p>
              <h3 className="mt-4 font-semibold">Quelle</h3>
              <p>
                <a href={quelle.url} className={linkKlasse} target="_blank" rel="noopener noreferrer">
                  {quelle.name}
                </a>
              </p>
            </>
          )}
        </div>
      </>
    );
  }

  return (
    <details className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <summary className="flex min-h-11 cursor-pointer items-center text-xl font-semibold">Passt-Check</summary>
      <div className="mt-4">{inhalt}</div>
    </details>
  );
}

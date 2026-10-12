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

const linkKlasse = "inline-flex min-h-11 items-center font-normal text-foreground underline underline-offset-4";
const feldKlasse = "mt-2 block min-h-12 w-full rounded-sm border border-dark-600 bg-white px-4 text-base aria-invalid:border-2 aria-invalid:border-foreground";
const knopfKlasse =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-foreground px-6 font-normal text-foreground transition-colors duration-150 hover:bg-subtle";

function zahl(n: number) {
  return n.toLocaleString("en-GB", { maximumFractionDigits: 1 });
}

function Stufe({ bewertung }: { bewertung: Bewertung }) {
  const Icon = bewertung.stufe === "passt" ? CircleCheck : bewertung.stufe === "grenzwertig" ? TriangleAlert : CircleX;
    return (
    <p className="flex items-center gap-2 text-2xl font-normal">
      <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
      {bewertung.stufe === "passt" ? "Fits" : bewertung.stufe === "grenzwertig" ? "Borderline" : bewertung.stufe === "zu klein" ? "Too small" : "Too large"}
    </p>
  );
}

export default function PasstCheck({ raum, sofas, fenster }: Props) {
  const uid = useId();
  const [art, setArt] = useState<"Teppich" | "Stange">("Teppich");
  const [fehler, setFehler] = useState<Record<string, string>>({});
  const [geprueft, setGeprueft] = useState<Gepruefte | null>(null);

  // With several sofas, the widest one counts; if the depth is missing (old entry), 90 cm is used.
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
        For the fit check I need a room.{" "}
        <a href="#raum-formular" className={linkKlasse}>
          Back to input
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
            <label htmlFor={`${uid}-art`} className="text-sm font-normal">
              What do you want to check?
            </label>
            <select
              id={`${uid}-art`}
              value={art}
              onChange={(e) => artWechseln(e.target.value as "Teppich" | "Stange")}
              className={feldKlasse}
            >
              <option value="Teppich">Rug</option>
              <option value="Stange">Curtain rod</option>
            </select>
          </div>

          {fehlt ? (
            <p className="text-muted">
              For that I need {art === "Teppich" ? "a sofa" : "a window"}.{" "}
              <a href="#moebel-formular" className={linkKlasse}>
                Back to input
              </a>
              .
            </p>
          ) : (
            <>
              {art === "Teppich" ? (
                <>
                  <p className="text-muted">The longer side is placed parallel to the sofa, the order does not matter.</p>
                  {(
                    [
                      ["a", "First side"],
                      ["b", "Second side"],
                    ] as const
                  ).map(([name, label]) => (
                    <div key={name}>
                      <label htmlFor={`${uid}-${name}`} className="text-sm font-normal">
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
                    <label htmlFor={`${uid}-fenster`} className="text-sm font-normal">
                      For which window?
                    </label>
                    <select id={`${uid}-fenster`} name="fenster" className={feldKlasse}>
                      {fenster.map((f, i) => (
                        <option key={f.id} value={f.id}>
                          Window {i + 1} ({zahl(f.breite)} × {zahl(f.hoehe)} cm)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`${uid}-breite`} className="text-sm font-normal">
                      Width of the rod <span className="font-normal text-muted">(in cm)</span>
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
                Check
              </button>
            </>
          )}
        </form>

        <div className="mt-4" aria-live="polite">
          {bewertung && (
            <>
              <Stufe bewertung={bewertung} />
              <p className="mt-2">{bewertung.grund}</p>
              <h3 className="mt-6 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Rule</h3>
              <p>
                {regel} “Borderline” means: at most {TOLERANZ_CM} cm off the guideline (assumption by prop-calc).
              </p>
              <h3 className="mt-6 text-eyebrow font-normal uppercase tracking-eyebrow text-muted">Source</h3>
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
    <details className="border-t border-foreground pt-2">
      <summary className="flex min-h-11 cursor-pointer items-center font-display text-h3 font-normal tracking-heading">Fit check</summary>
      <div className="mt-4">{inhalt}</div>
    </details>
  );
}

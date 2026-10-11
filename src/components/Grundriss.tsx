"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { WAND_NAME, WAND_VON } from "@/lib/fenster";
import type { Wand } from "@/lib/fenster";
import { BLICKRICHTUNG, begrenzeLage } from "@/lib/grundriss";
import type { Drehung, Platziert } from "@/lib/grundriss";

export type FensterImPlan = {
  id: number;
  nummer: number;
  breite: number;
  wand?: Wand;
  abstand?: number;
  /** Mit dem aktuellen Raum ragt das Fenster über die Wand hinaus. */
  zuLang: boolean;
};

type Props = {
  raum: { laenge: number; breite: number } | null;
  moebel: Platziert[];
  /** Arten, die noch keine Tiefe haben und deshalb nicht im Grundriss erscheinen. */
  ohneGrundriss: string[];
  fenster: FensterImPlan[];
  onLage: (id: number, lage: { x: number; y: number; drehung: Drehung }) => void;
  onDrehen: (id: number) => void;
};

const linkKlasse = "inline-flex min-h-11 items-center font-normal text-foreground underline underline-offset-4";
const SCHRITT_CM = 10;

function formatZahl(n: number) {
  return n.toLocaleString("de-DE", { maximumFractionDigits: 0 });
}

function begrenzen(wert: number, min: number, max: number) {
  return Math.min(Math.max(wert, min), Math.max(min, max));
}

/** Namen für die Liste: „Sofa“, bei mehreren derselben Art „Sofa 1“, „Sofa 2“. */
function namenVergeben(moebel: Platziert[]) {
  const gesamt: Record<string, number> = {};
  for (const m of moebel) gesamt[m.art] = (gesamt[m.art] ?? 0) + 1;
  const laufend: Record<string, number> = {};
  const namen = new Map<number, string>();
  for (const m of moebel) {
    laufend[m.art] = (laufend[m.art] ?? 0) + 1;
    namen.set(m.id, gesamt[m.art] > 1 ? `${m.art} ${laufend[m.art]}` : m.art);
  }
  return namen;
}

/** Dicke Kante auf der Vorderseite des Sofas. */
const vorderkanteKlasse: Record<Drehung, string> = {
  0: "inset-x-0 bottom-0 h-0.5",
  90: "inset-y-0 left-0 w-0.5",
  180: "inset-x-0 top-0 h-0.5",
  270: "inset-y-0 right-0 w-0.5",
};

export default function Grundriss({ raum, moebel, ohneGrundriss, fenster, onLage, onDrehen }: Props) {
  const flaeche = useRef<HTMLDivElement>(null);
  const start = useRef<{
    id: number;
    px: number;
    py: number;
    x0: number;
    y0: number;
    pxProCm: number;
    x: number;
    y: number;
  } | null>(null);
  const [ziehen, setZiehen] = useState<{ id: number; x: number; y: number } | null>(null);
  const namen = namenVergeben(moebel);

  function runter(e: PointerEvent<HTMLButtonElement>, m: Platziert) {
    if (!raum || !flaeche.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const breitePx = flaeche.current.getBoundingClientRect().width;
    start.current = {
      id: m.id,
      px: e.clientX,
      py: e.clientY,
      x0: m.rect.x,
      y0: m.rect.y,
      pxProCm: breitePx / raum.laenge,
      x: m.rect.x,
      y: m.rect.y,
    };
  }

  function bewegen(e: PointerEvent<HTMLButtonElement>, m: Platziert) {
    const s = start.current;
    if (!raum || !s || s.id !== m.id) return;
    s.x = begrenzen(Math.round(s.x0 + (e.clientX - s.px) / s.pxProCm), 0, raum.laenge - m.rect.w);
    s.y = begrenzen(Math.round(s.y0 + (e.clientY - s.py) / s.pxProCm), 0, raum.breite - m.rect.d);
    setZiehen({ id: m.id, x: s.x, y: s.y });
  }

  function loslassen(m: Platziert) {
    const s = start.current;
    start.current = null;
    setZiehen(null);
    // Ein bloßes Antippen verändert nichts: Das Möbelstück bleibt am Standardplatz.
    if (s && s.id === m.id && (s.x !== s.x0 || s.y !== s.y0)) {
      onLage(m.id, { x: s.x, y: s.y, drehung: m.drehung });
    }
  }

  function abbrechen() {
    start.current = null;
    setZiehen(null);
  }

  function taste(e: KeyboardEvent<HTMLButtonElement>, m: Platziert) {
    if (!raum) return;
    const richtung: Record<string, [number, number]> = {
      ArrowLeft: [-SCHRITT_CM, 0],
      ArrowRight: [SCHRITT_CM, 0],
      ArrowUp: [0, -SCHRITT_CM],
      ArrowDown: [0, SCHRITT_CM],
    };
    const schritt = richtung[e.key];
    if (!schritt) return;
    e.preventDefault();
    const { x, y } = begrenzeLage(m.rect.x + schritt[0], m.rect.y + schritt[1], m.rect, raum);
    onLage(m.id, { x, y, drehung: m.drehung });
  }

  let inhalt;
  if (!raum) {
    inhalt = (
      <p className="text-muted">
        Für den Grundriss brauche ich einen Raum.{" "}
        <a href="#raum-formular" className={linkKlasse}>
          Zurück zur Eingabe
        </a>
        .
      </p>
    );
  } else if (moebel.length === 0 && fenster.length === 0) {
    inhalt = (
      <p className="text-muted">
        Für den Grundriss brauche ich ein Sofa, einen Couchtisch oder einen Esstisch mit Tiefe oder ein Fenster mit Wand.{" "}
        <a href="#moebel-formular" className={linkKlasse}>
          Zurück zur Eingabe
        </a>
        .
      </p>
    );
  } else {
    inhalt = (
      <>
        <p className="text-muted">
          Der Raum von oben, maßstabsgetreu: {formatZahl(raum.laenge)} cm lang und {formatZahl(raum.breite)} cm breit.
          Zieh ein Möbelstück mit dem Finger an seinen Platz oder verschieb es mit den Pfeiltasten. Die dicke Kante
          zeigt die Vorderseite des Sofas. Was du nicht bewegt hast, steht an einem Standardplatz nach den Annahmen
          von prop-calc.
        </p>

        <div
          ref={flaeche}
          className="relative mt-4 w-full overflow-hidden border border-foreground bg-background"
          style={{ aspectRatio: `${raum.laenge} / ${raum.breite}` }}
        >
          {fenster.map((f) => {
            if (f.wand === undefined || f.abstand === undefined || f.zuLang) return null;
            const quer = f.wand === "oben" || f.wand === "unten";
            const laenge = quer ? raum.laenge : raum.breite;
            const stil = quer
              ? {
                  left: `${(f.abstand / laenge) * 100}%`,
                  width: `${(f.breite / laenge) * 100}%`,
                  [f.wand === "oben" ? "top" : "bottom"]: 0,
                }
              : {
                  top: `${(f.abstand / laenge) * 100}%`,
                  height: `${(f.breite / laenge) * 100}%`,
                  [f.wand === "links" ? "left" : "right"]: 0,
                };
            return (
              <div
                key={`fenster-${f.id}`}
                aria-hidden="true"
                className={`absolute bg-foreground ${quer ? "h-2" : "w-2"}`}
                style={stil}
              />
            );
          })}
          {moebel.map((m) => {
            const lage = ziehen && ziehen.id === m.id ? { x: ziehen.x, y: ziehen.y } : m.rect;
            const name = namen.get(m.id) ?? m.art;
            return (
              <button
                key={m.id}
                type="button"
                onPointerDown={(e) => runter(e, m)}
                onPointerMove={(e) => bewegen(e, m)}
                onPointerUp={() => loslassen(m)}
                onPointerCancel={abbrechen}
                onKeyDown={(e) => taste(e, m)}
                aria-label={`${name}, ${formatZahl(m.breite)} mal ${formatZahl(m.tiefe)} Zentimeter. Mit den Pfeiltasten verschieben.`}
                className={`absolute flex cursor-grab touch-none items-center justify-center overflow-hidden border border-foreground p-0 text-caption font-normal text-foreground transition-none before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] active:cursor-grabbing ${
                  m.art === "Sofa" ? "bg-accent" : "bg-subtle"
                } ${m.rund ? "rounded-full" : ""} ${ziehen?.id === m.id ? "z-10" : ""}`}
                style={{
                  left: `${(lage.x / raum.laenge) * 100}%`,
                  top: `${(lage.y / raum.breite) * 100}%`,
                  width: `${(m.rect.w / raum.laenge) * 100}%`,
                  height: `${(m.rect.d / raum.breite) * 100}%`,
                }}
              >
                <span className="truncate px-1">{name}</span>
                {m.art === "Sofa" && (
                  <span aria-hidden="true" className={`absolute bg-foreground ${vorderkanteKlasse[m.drehung]}`} />
                )}
              </button>
            );
          })}
        </div>

        <ul className="mt-6 flex flex-col" aria-live="polite">
          {moebel.map((m) => {
            const name = namen.get(m.id) ?? m.art;
            return (
              <li key={m.id} className="flex items-center justify-between gap-4 border-t border-border py-4">
                <span>
                  <span className="font-medium">{name}</span>
                  <span className="block text-muted">
                    {m.gesetzt
                      ? `${formatZahl(m.rect.x)} cm von links, ${formatZahl(m.rect.y)} cm von oben`
                      : "Standardplatz, noch nicht verschoben"}
                    {m.art === "Sofa" ? `, blickt nach ${BLICKRICHTUNG[m.drehung]}` : ""}
                  </span>
                </span>
                {!m.rund && (
                  <button
                    type="button"
                    onClick={() => onDrehen(m.id)}
                    aria-label={`${name} um 90 Grad drehen`}
                    className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm border border-foreground px-4 font-normal transition-colors duration-150 hover:bg-subtle"
                  >
                    Drehen
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {fenster.length > 0 && (
          <ul className="mt-6 flex flex-col">
            {fenster.map((f) => (
              <li key={f.id} className="border-t border-border py-4">
                <span className="font-medium">Fenster {f.nummer}</span>
                <span className="block text-muted">
                  {f.wand === undefined || f.abstand === undefined
                    ? "Wand fehlt. Lege sie in der Liste „Möbel und Fenster“ fest."
                    : f.zuLang
                      ? `Ragt mit dem jetzigen Raum über die ${WAND_NAME[f.wand]} hinaus. Ändere den Abstand in der Liste „Möbel und Fenster“.`
                      : `${WAND_NAME[f.wand]}, ${formatZahl(f.abstand)} cm von der ${WAND_VON[f.wand]}, ${formatZahl(f.breite)} cm breit`}
                </span>
              </li>
            ))}
          </ul>
        )}

        {ohneGrundriss.length > 0 && (
          <p className="mt-4 text-muted">
            Nicht im Grundriss: {ohneGrundriss.join(", ")}. Dafür ist noch keine Tiefe eingetragen.
          </p>
        )}
      </>
    );
  }

  return (
    <details open className="border-t border-foreground pt-2">
      <summary className="flex min-h-11 cursor-pointer items-center font-display text-h3 font-normal tracking-heading">
        Grundriss
      </summary>
      <div className="mt-4">{inhalt}</div>
    </details>
  );
}

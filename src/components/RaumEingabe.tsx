"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";
import { CircleAlert, Plus, RotateCcw, Trash2 } from "lucide-react";
import BildEmpfehlung from "@/components/BildEmpfehlung";
import TeppichEmpfehlung from "@/components/TeppichEmpfehlung";
import VorhangEmpfehlung from "@/components/VorhangEmpfehlung";

const ARTEN = ["Sofa", "Fenster", "Couchtisch", "Fernseher", "Sideboard"] as const;
type Art = (typeof ARTEN)[number];

type Raum = { laenge: number; breite: number; hoehe: number };
type Eintrag = { id: number; art: Art; breite: number; hoehe: number; tiefe?: number };

const SPEICHER_KEY = "proportio-eingaben";

type FeldFehler = Record<string, string>;

/** Liest eine Zahl in Zentimetern. Gibt entweder den Wert oder eine verständliche Meldung zurück. */
function leseZentimeter(text: string): { wert: number } | { fehler: string } {
  const t = text.trim();
  if (t === "") return { fehler: "Bitte trag einen Wert in Zentimetern ein." };
  if (!/^-?\d+([.,]\d+)?$/.test(t)) {
    return { fehler: "Das ist keine Zahl. Bitte nur Ziffern eingeben, zum Beispiel 420." };
  }
  const wert = Number(t.replace(",", "."));
  if (wert <= 0) return { fehler: "Der Wert muss größer als null sein." };
  return { wert };
}

function formatZahl(n: number, nachkommastellen = 0) {
  return n.toLocaleString("de-DE", { maximumFractionDigits: nachkommastellen });
}

function Fehler({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return (
    <p id={id} className="mt-1 flex items-start gap-1.5 text-base font-medium text-accent">
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {text}
    </p>
  );
}

const feldKlasse =
  "mt-1 block min-h-11 w-full rounded-lg border border-border bg-card px-3 text-base";
const knopfKlasse =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-4 font-semibold text-background";

type Gespeichert = { raum?: Raum; eintraege?: Eintrag[]; naechsteId?: number };

/** Liest die zuletzt gemerkten Eingaben. Ist nichts da oder nicht lesbar, startet die App leer. */
function leseGespeichert(): Gespeichert {
  try {
    const roh = window.localStorage.getItem(SPEICHER_KEY);
    if (!roh) return {};
    const d = JSON.parse(roh);
    return {
      raum: d.raum ?? undefined,
      eintraege: Array.isArray(d.eintraege) ? d.eintraege : undefined,
      naechsteId: typeof d.naechsteId === "number" ? d.naechsteId : undefined,
    };
  } catch {
    return {};
  }
}

const keinAbo = () => () => {};

export default function RaumEingabe() {
  // Auf dem Server gibt es keinen Browser-Speicher; erst im Browser zeigen wir das Formular.
  const imBrowser = useSyncExternalStore(
    keinAbo,
    () => true,
    () => false,
  );
  if (!imBrowser) return <div className="min-h-96" aria-hidden="true" />;
  return <RaumEingabeInhalt />;
}

function RaumEingabeInhalt() {
  const uid = useId();
  const [gespeichert] = useState(leseGespeichert);
  const [raum, setRaum] = useState<Raum | null>(gespeichert.raum ?? null);
  const [raumFehler, setRaumFehler] = useState<FeldFehler>({});
  const [eintraege, setEintraege] = useState<Eintrag[]>(gespeichert.eintraege ?? []);
  const [eintragFehler, setEintragFehler] = useState<FeldFehler>({});
  const [naechsteId, setNaechsteId] = useState(gespeichert.naechsteId ?? 1);
  const [art, setArt] = useState<Art>("Sofa");
  // Wechselt beim Zurücksetzen, damit die Formulare mit leeren Feldern neu aufgebaut werden.
  const [formularNr, setFormularNr] = useState(0);

  // Eingaben für das nächste Neuladen merken (nur im Browser dieses Geräts).
  useEffect(() => {
    try {
      window.localStorage.setItem(SPEICHER_KEY, JSON.stringify({ raum, eintraege, naechsteId }));
    } catch {
      // Speichern nicht möglich (zum Beispiel privates Fenster): die App funktioniert trotzdem.
    }
  }, [raum, eintraege, naechsteId]);

  function raumUebernehmen(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const daten = new FormData(e.currentTarget);
    const felder = ["laenge", "breite", "hoehe"] as const;
    const fehler: FeldFehler = {};
    const werte: Partial<Raum> = {};
    for (const feld of felder) {
      const ergebnis = leseZentimeter(String(daten.get(feld) ?? ""));
      if ("fehler" in ergebnis) fehler[feld] = ergebnis.fehler;
      else werte[feld] = ergebnis.wert;
    }
    setRaumFehler(fehler);
    if (Object.keys(fehler).length === 0) setRaum(werte as Raum);
  }

  function eintragHinzufuegen(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const daten = new FormData(form);
    const fehler: FeldFehler = {};
    const breite = leseZentimeter(String(daten.get("breite") ?? ""));
    const hoehe = leseZentimeter(String(daten.get("hoehe") ?? ""));
    if ("fehler" in breite) fehler.breite = breite.fehler;
    if ("fehler" in hoehe) fehler.hoehe = hoehe.fehler;
    const tiefe = art === "Sofa" ? leseZentimeter(String(daten.get("tiefe") ?? "")) : null;
    if (tiefe && "fehler" in tiefe) fehler.tiefe = tiefe.fehler;
    setEintragFehler(fehler);
    if ("wert" in breite && "wert" in hoehe && (!tiefe || "wert" in tiefe)) {
      const neu: Eintrag = { id: naechsteId, art, breite: breite.wert, hoehe: hoehe.wert };
      if (tiefe && "wert" in tiefe) neu.tiefe = tiefe.wert;
      setEintraege((alt) => [...alt, neu]);
      setNaechsteId((n) => n + 1);
      form.reset();
    }
  }

  function allesZuruecksetzen() {
    if (!window.confirm("Raum und alle Möbel wirklich löschen? Das lässt sich nicht rückgängig machen.")) return;
    setRaum(null);
    setEintraege([]);
    setNaechsteId(1);
    setRaumFehler({});
    setEintragFehler({});
    setArt("Sofa");
    setFormularNr((n) => n + 1);
  }

  function eintragEntfernen(id: number) {
    setEintraege((alt) => alt.filter((x) => x.id !== id));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-8">
        <section
          id="raum-formular"
          aria-labelledby={`${uid}-raum`}
          className="rounded-xl border border-border bg-card p-4 sm:p-6"
        >
          <h2 id={`${uid}-raum`} className="text-xl font-semibold">
            Raum
          </h2>
          <p className="mt-1 text-muted">Alle Maße in Zentimetern.</p>
          <form key={`raum-${formularNr}`} onSubmit={raumUebernehmen} noValidate className="mt-4 flex flex-col gap-4">
            {(
              [
                ["laenge", "Länge", "zum Beispiel 520"],
                ["breite", "Breite", "zum Beispiel 420"],
                ["hoehe", "Deckenhöhe", "zum Beispiel 250"],
              ] as const
            ).map(([name, label, hinweis]) => (
              <div key={name}>
                <label htmlFor={`${uid}-raum-${name}`} className="font-medium">
                  {label} <span className="font-normal text-muted">({hinweis})</span>
                </label>
                <input
                  id={`${uid}-raum-${name}`}
                  name={name}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  aria-invalid={raumFehler[name] ? true : undefined}
                  aria-describedby={raumFehler[name] ? `${uid}-raum-${name}-fehler` : undefined}
                  className={feldKlasse}
                />
                <Fehler id={`${uid}-raum-${name}-fehler`} text={raumFehler[name]} />
              </div>
            ))}
            <button type="submit" className={knopfKlasse}>
              Raum übernehmen
            </button>
          </form>
        </section>

        <section
          id="moebel-formular"
          aria-labelledby={`${uid}-moebel`}
          className="rounded-xl border border-border bg-card p-4 sm:p-6"
        >
          <h2 id={`${uid}-moebel`} className="text-xl font-semibold">
            Möbel oder Fenster hinzufügen
          </h2>
          <form key={`moebel-${formularNr}`} onSubmit={eintragHinzufuegen} noValidate className="mt-4 flex flex-col gap-4">
            <div>
              <label htmlFor={`${uid}-art`} className="font-medium">
                Art
              </label>
              <select
                id={`${uid}-art`}
                name="art"
                value={art}
                onChange={(e) => setArt(e.target.value as Art)}
                className={feldKlasse}
              >
                {ARTEN.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            {(
              [
                ["breite", "Breite"],
                ["hoehe", "Höhe"],
                ...(art === "Sofa" ? [["tiefe", "Tiefe"]] : []),
              ] as const
            ).map(([name, label]) => (
              <div key={name}>
                <label htmlFor={`${uid}-e-${name}`} className="font-medium">
                  {label} <span className="font-normal text-muted">(in cm)</span>
                </label>
                <input
                  id={`${uid}-e-${name}`}
                  name={name}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  aria-invalid={eintragFehler[name] ? true : undefined}
                  aria-describedby={eintragFehler[name] ? `${uid}-e-${name}-fehler` : undefined}
                  className={feldKlasse}
                />
                <Fehler id={`${uid}-e-${name}-fehler`} text={eintragFehler[name]} />
              </div>
            ))}
            <button type="submit" className={knopfKlasse}>
              <Plus className="h-5 w-5" aria-hidden="true" />
              Hinzufügen
            </button>
          </form>
        </section>
      </div>

      <div className="flex flex-col gap-8">
        <section aria-labelledby={`${uid}-zusammenfassung`} className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id={`${uid}-zusammenfassung`} className="text-xl font-semibold">
              Zusammenfassung
            </h2>
            <button
              type="button"
              onClick={allesZuruecksetzen}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-border px-3 font-medium"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Neu beginnen
            </button>
          </div>
          <div aria-live="polite">
            {raum ? (
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                <dt className="text-muted">Länge</dt>
                <dd className="font-semibold">{formatZahl(raum.laenge, 1)} cm</dd>
                <dt className="text-muted">Breite</dt>
                <dd className="font-semibold">{formatZahl(raum.breite, 1)} cm</dd>
                <dt className="text-muted">Deckenhöhe</dt>
                <dd className="font-semibold">{formatZahl(raum.hoehe, 1)} cm</dd>
                <dt className="text-muted">Raumfläche</dt>
                <dd className="font-semibold">{formatZahl((raum.laenge * raum.breite) / 10000, 2)} m²</dd>
              </dl>
            ) : (
              <p className="mt-4 text-muted">
                Noch kein Raum übernommen. Trag Länge, Breite und Deckenhöhe ein und tippe auf „Raum übernehmen“.
              </p>
            )}
          </div>
        </section>

        <section aria-labelledby={`${uid}-liste`} className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <h2 id={`${uid}-liste`} className="text-xl font-semibold">
            Möbel und Fenster
          </h2>
          {eintraege.length === 0 ? (
            <p className="mt-4 text-muted">
              Noch nichts eingetragen.{" "}
              <a href="#moebel-formular" className="inline-block font-medium text-foreground underline">
                Zum Formular, um ein Sofa oder Fenster hinzuzufügen
              </a>
              .
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {eintraege.map((x) => (
                <li
                  key={x.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <span>
                    <span className="font-semibold">{x.art}</span>
                    <span className="block text-muted">
                      {formatZahl(x.breite, 1)} cm breit, {formatZahl(x.hoehe, 1)} cm hoch
                      {x.tiefe ? `, ${formatZahl(x.tiefe, 1)} cm tief` : ""}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => eintragEntfernen(x.id)}
                    aria-label={`${x.art} entfernen`}
                    className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-border px-3 font-medium"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Entfernen
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <TeppichEmpfehlung
          raum={raum}
          sofas={eintraege
            .filter((x) => x.art === "Sofa")
            .map((x) => ({ breite: x.breite, tiefe: x.tiefe }))}
        />

        <VorhangEmpfehlung
          raum={raum}
          fenster={eintraege.filter((x) => x.art === "Fenster")}
        />

        <BildEmpfehlung
          raum={raum}
          sofas={eintraege
            .filter((x) => x.art === "Sofa")
            .map((x) => ({ breite: x.breite, hoehe: x.hoehe }))}
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";
import AbstandEmpfehlung from "@/components/AbstandEmpfehlung";
import BildEmpfehlung from "@/components/BildEmpfehlung";
import Fehler from "@/components/Fehler";
import EsstischEmpfehlung from "@/components/EsstischEmpfehlung";
import PasstCheck from "@/components/PasstCheck";
import TeppichEmpfehlung from "@/components/TeppichEmpfehlung";
import VorhangEmpfehlung from "@/components/VorhangEmpfehlung";
import { TISCH_HOEHE_STANDARD_CM } from "@/lib/esstisch";
import { leseZentimeter } from "@/lib/zentimeter";

const ARTEN = ["Sofa", "Fenster", "Couchtisch", "Fernseher", "Sideboard", "Esstisch"] as const;
type Art = (typeof ARTEN)[number];

type Form = "rechteckig" | "rund";

type Raum = { laenge: number; breite: number; hoehe: number };
type Eintrag = { id: number; art: Art; breite: number; hoehe: number; tiefe?: number; form?: Form };

const SPEICHER_KEY = "proportio-eingaben";

type FeldFehler = Record<string, string>;

function formatZahl(n: number, nachkommastellen = 0) {
  return n.toLocaleString("de-DE", { maximumFractionDigits: nachkommastellen });
}

const feldKlasse =
  "mt-2 block min-h-12 w-full rounded-sm border border-dark-600 bg-white px-4 text-base aria-invalid:border-2 aria-invalid:border-foreground";
const zweitKnopfKlasse =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-foreground px-6 font-normal text-foreground transition-colors duration-150 hover:bg-subtle";
const knopfKlasse =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-foreground px-6 font-normal text-background transition-colors duration-150 hover:bg-dark-800";

type Gespeichert = { raum?: Raum; eintraege?: Eintrag[]; naechsteId?: number };

/** Liest die zuletzt gemerkten Eingaben. Ist nichts da oder nicht lesbar, startet die App leer. */
function leseGespeichert(): Gespeichert {
  try {
    const roh = window.localStorage.getItem(SPEICHER_KEY);
    if (!roh) return {};
    const d = JSON.parse(roh);
    const istZahl = (n: unknown) => typeof n === "number" && Number.isFinite(n) && n > 0;
    const raumOk = d.raum && istZahl(d.raum.laenge) && istZahl(d.raum.breite) && istZahl(d.raum.hoehe);
    const eintraegeOk =
      Array.isArray(d.eintraege) &&
      d.eintraege.every(
        (x: Eintrag) =>
          x && ARTEN.includes(x.art) && typeof x.id === "number" && istZahl(x.breite) && istZahl(x.hoehe),
      );
    return {
      raum: raumOk ? d.raum : undefined,
      eintraege: eintraegeOk ? d.eintraege : undefined,
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
  const [tischForm, setTischForm] = useState<Form>("rechteckig");
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

  const istRunderTisch = art === "Esstisch" && tischForm === "rund";
  const hatTiefe = art === "Sofa" || art === "Couchtisch" || (art === "Esstisch" && !istRunderTisch);

  function eintragHinzufuegen(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const daten = new FormData(form);
    const fehler: FeldFehler = {};
    const breite = leseZentimeter(String(daten.get("breite") ?? ""));
    // Beim Esstisch ist die Höhe freiwillig und gilt ohne Eintrag als 75 cm.
    const hoeheText = String(daten.get("hoehe") ?? "");
    const hoehe =
      art === "Esstisch" && hoeheText.trim() === "" ? { wert: TISCH_HOEHE_STANDARD_CM } : leseZentimeter(hoeheText);
    if ("fehler" in breite) fehler.breite = breite.fehler;
    if ("fehler" in hoehe) fehler.hoehe = hoehe.fehler;
    const tiefe = hatTiefe ? leseZentimeter(String(daten.get("tiefe") ?? "")) : null;
    if (tiefe && "fehler" in tiefe) fehler.tiefe = tiefe.fehler;
    setEintragFehler(fehler);
    if ("wert" in breite && "wert" in hoehe && (!tiefe || "wert" in tiefe)) {
      const neu: Eintrag = { id: naechsteId, art, breite: breite.wert, hoehe: hoehe.wert };
      if (tiefe && "wert" in tiefe) neu.tiefe = tiefe.wert;
      if (art === "Esstisch") {
        neu.form = tischForm;
        if (istRunderTisch) neu.tiefe = breite.wert;
      }
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
    setTischForm("rechteckig");
    setFormularNr((n) => n + 1);
  }

  function eintragEntfernen(id: number) {
    setEintraege((alt) => alt.filter((x) => x.id !== id));
  }

  return (
    <div className="layout-grid gap-y-16">
      <div className="col-span-full flex flex-col gap-16 lg:col-span-5">
        <section
          id="raum-formular"
          aria-labelledby={`${uid}-raum`}
          className="border-t border-foreground pt-6"
        >
          <h2 id={`${uid}-raum`} className="font-display text-h3 font-normal tracking-heading">
            Raum
          </h2>
          <p className="mt-2 text-muted">Alle Maße in Zentimetern.</p>
          <form key={`raum-${formularNr}`} onSubmit={raumUebernehmen} noValidate className="mt-4 flex flex-col gap-4">
            {(
              [
                ["laenge", "Länge", "zum Beispiel 520"],
                ["breite", "Breite", "zum Beispiel 420"],
                ["hoehe", "Deckenhöhe", "zum Beispiel 250"],
              ] as const
            ).map(([name, label, hinweis]) => (
              <div key={name}>
                <label htmlFor={`${uid}-raum-${name}`} className="text-sm font-normal">
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
          className="border-t border-foreground pt-6"
        >
          <h2 id={`${uid}-moebel`} className="font-display text-h3 font-normal tracking-heading">
            Möbel oder Fenster hinzufügen
          </h2>
          <form key={`moebel-${formularNr}`} onSubmit={eintragHinzufuegen} noValidate className="mt-4 flex flex-col gap-4">
            <div>
              <label htmlFor={`${uid}-art`} className="text-sm font-normal">
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
            {art === "Esstisch" && (
              <div>
                <label htmlFor={`${uid}-form`} className="text-sm font-normal">
                  Form
                </label>
                <select
                  id={`${uid}-form`}
                  name="form"
                  value={tischForm}
                  onChange={(e) => setTischForm(e.target.value as Form)}
                  className={feldKlasse}
                >
                  <option value="rechteckig">rechteckig</option>
                  <option value="rund">rund</option>
                </select>
              </div>
            )}
            {(
              [
                ["breite", istRunderTisch ? "Durchmesser" : "Breite"],
                ["hoehe", "Höhe"],
                ...(hatTiefe ? [["tiefe", "Tiefe"]] : []),
              ] as const
            ).map(([name, label]) => (
              <div key={name}>
                <label htmlFor={`${uid}-e-${name}`} className="text-sm font-normal">
                  {label}{" "}
                  <span className="font-normal text-muted">
                    {art === "Esstisch" && name === "hoehe" ? "(in cm, ohne Eintrag 75)" : "(in cm)"}
                  </span>
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
            <button type="submit" className={zweitKnopfKlasse}>
              Hinzufügen
            </button>
          </form>
        </section>
      </div>

      <div className="col-span-full flex flex-col gap-16 lg:col-span-6 lg:col-start-7">
        <section aria-labelledby={`${uid}-zusammenfassung`} className="border-t border-foreground pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id={`${uid}-zusammenfassung`} className="font-display text-h3 font-normal tracking-heading">
              Zusammenfassung
            </h2>
            <button
              type="button"
              onClick={allesZuruecksetzen}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm border border-foreground px-4 font-normal transition-colors duration-150 hover:bg-subtle"
            >
              Neu beginnen
            </button>
          </div>
          <div aria-live="polite">
            {raum ? (
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                <dt className="text-muted">Länge</dt>
                <dd className="font-medium">{formatZahl(raum.laenge, 1)} cm</dd>
                <dt className="text-muted">Breite</dt>
                <dd className="font-medium">{formatZahl(raum.breite, 1)} cm</dd>
                <dt className="text-muted">Deckenhöhe</dt>
                <dd className="font-medium">{formatZahl(raum.hoehe, 1)} cm</dd>
                <dt className="text-muted">Raumfläche</dt>
                <dd className="font-medium">{formatZahl((raum.laenge * raum.breite) / 10000, 2)} m²</dd>
              </dl>
            ) : (
              <p className="mt-4 text-muted">
                Noch kein Raum übernommen. Trag Länge, Breite und Deckenhöhe ein und tippe auf „Raum übernehmen“.
              </p>
            )}
          </div>
        </section>

        <section aria-labelledby={`${uid}-liste`} className="border-t border-foreground pt-6">
          <h2 id={`${uid}-liste`} className="font-display text-h3 font-normal tracking-heading">
            Möbel und Fenster
          </h2>
          {eintraege.length === 0 ? (
            <p className="mt-4 text-muted">
              Noch nichts eingetragen.{" "}
              <a href="#moebel-formular" className="inline-flex min-h-11 items-center font-normal text-foreground underline underline-offset-4">
                Zum Formular, um ein Sofa oder Fenster hinzuzufügen
              </a>
              .
            </p>
          ) : (
            <ul className="mt-4 flex flex-col">
              {eintraege.map((x) => (
                <li
                  key={x.id}
                  className="flex items-center justify-between gap-4 border-t border-border py-4"
                >
                  <span>
                    <span className="font-medium">{x.art}</span>
                    <span className="block text-muted">
                      {x.form === "rund"
                        ? `rund, Durchmesser ${formatZahl(x.breite, 1)} cm, ${formatZahl(x.hoehe, 1)} cm hoch`
                        : `${formatZahl(x.breite, 1)} cm breit, ${formatZahl(x.hoehe, 1)} cm hoch${x.tiefe ? `, ${formatZahl(x.tiefe, 1)} cm tief` : ""}`}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => eintragEntfernen(x.id)}
                    aria-label={`${x.art} entfernen`}
                    className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm border border-foreground px-4 font-normal transition-colors duration-150 hover:bg-subtle"
                  >
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

        <AbstandEmpfehlung
          raum={raum}
          sofas={eintraege.filter((x) => x.art === "Sofa")}
          couchtische={eintraege.filter((x) => x.art === "Couchtisch")}
          fernseher={eintraege.filter((x) => x.art === "Fernseher")}
        />

        <EsstischEmpfehlung
          raum={raum}
          tische={eintraege
            .filter((x) => x.art === "Esstisch")
            .map((x) => ({
              form: x.form ?? "rechteckig",
              breite: x.breite,
              tiefe: x.tiefe ?? x.breite,
              hoehe: x.hoehe,
            }))}
        />

        <PasstCheck
          key={`passt-${formularNr}`}
          raum={raum}
          sofas={eintraege.filter((x) => x.art === "Sofa")}
          fenster={eintraege.filter((x) => x.art === "Fenster")}
        />
      </div>
    </div>
  );
}

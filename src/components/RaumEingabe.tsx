"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";
import BettEmpfehlung from "@/components/BettEmpfehlung";
import AbstandEmpfehlung from "@/components/AbstandEmpfehlung";
import BildEmpfehlung from "@/components/BildEmpfehlung";
import Fehler from "@/components/Fehler";
import EsstischEmpfehlung from "@/components/EsstischEmpfehlung";
import FensterLageFelder from "@/components/FensterLageFelder";
import FensterLageForm from "@/components/FensterLageForm";
import Grundriss from "@/components/Grundriss";
import PasstCheck from "@/components/PasstCheck";
import TeppichEmpfehlung from "@/components/TeppichEmpfehlung";
import VorhangEmpfehlung from "@/components/VorhangEmpfehlung";
import { TISCH_HOEHE_STANDARD_CM } from "@/lib/esstisch";
import { istWand, leseFensterLage, pruefeFensterLage, WAND_NAME, WAND_VON } from "@/lib/fenster";
import type { Wand } from "@/lib/fenster";
import { DREHUNGEN, drehenUmMitte, istPlanArt, lagenBerechnen } from "@/lib/grundriss";
import type { Drehung, PlanMoebel, Platziert } from "@/lib/grundriss";
import { leseZentimeter } from "@/lib/zentimeter";

const ARTEN = ["Sofa", "Fenster", "Couchtisch", "Fernseher", "Sideboard", "Esstisch", "Bett"] as const;
type Art = (typeof ARTEN)[number];

/** Die Arten bleiben intern deutsch (so sind sie gespeichert); angezeigt wird Englisch. */
const ART_LABEL: Record<Art, string> = {
  Sofa: "Sofa",
  Fenster: "Window",
  Couchtisch: "Coffee table",
  Fernseher: "TV",
  Sideboard: "Sideboard",
  Esstisch: "Dining table",
  Bett: "Bed",
};

type Form = "rechteckig" | "rund";

type Raum = { laenge: number; breite: number; hoehe: number };
/** x, y (linke obere Ecke im Raum, cm) und drehung gibt es erst, wenn das Möbelstück bewegt wurde. */
type Eintrag = {
  id: number;
  art: Art;
  breite: number;
  hoehe: number;
  tiefe?: number;
  form?: Form;
  x?: number;
  y?: number;
  drehung?: Drehung;
  /** Nur bei Fenstern: Wand und Abstand von der Ecke (cm), sobald die Person sie gesetzt hat. */
  wand?: Wand;
  abstand?: number;
};

const SPEICHER_KEY = "proportio-eingaben";

type FeldFehler = Record<string, string>;

function formatZahl(n: number, nachkommastellen = 0) {
  return n.toLocaleString("en-GB", { maximumFractionDigits: nachkommastellen });
}

const feldKlasse =
  "mt-2 block min-h-12 w-full rounded-sm border border-dark-600 bg-white px-4 text-base aria-invalid:border-2 aria-invalid:border-foreground";
const zweitKnopfKlasse =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-foreground px-6 font-normal text-foreground transition-colors duration-150 hover:bg-subtle";
const knopfKlasse =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-foreground px-6 font-normal text-background transition-colors duration-150 hover:bg-dark-800";

type Gespeichert = { raum?: Raum; eintraege?: Eintrag[]; naechsteId?: number };

/** Behält Lage und Drehung nur, wenn beide Zahlen brauchbar sind. */
function bereinigeLage(e: Eintrag): Eintrag {
  const { x, y, drehung, wand, abstand, ...ohneLage } = e;
  const wandOk =
    e.art === "Fenster" && istWand(wand) && typeof abstand === "number" && Number.isFinite(abstand) && abstand >= 0;
  const rest: Eintrag = wandOk ? { ...ohneLage, wand, abstand } : ohneLage;
  const lageOk = typeof x === "number" && Number.isFinite(x) && typeof y === "number" && Number.isFinite(y);
  if (!lageOk) return rest;
  const drehungOk = DREHUNGEN.includes(drehung as Drehung);
  return { ...rest, x, y, ...(drehungOk ? { drehung } : {}) };
}

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
      eintraege: eintraegeOk ? (d.eintraege as Eintrag[]).map(bereinigeLage) : undefined,
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
  const [fensterWand, setFensterWand] = useState<Wand | "">("");
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
  const hatTiefe = art === "Sofa" || art === "Couchtisch" || art === "Bett" || (art === "Esstisch" && !istRunderTisch);

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
    // Wand und Abstand gibt es nur beim Fenster und erst, wenn die Breite gültig ist.
    let fensterLage: { wand?: Wand; abstand?: number } = {};
    if (art === "Fenster" && "wert" in breite) {
      const lage = leseFensterLage(daten, breite.wert, raum);
      if ("fehler" in lage) fehler.abstand = lage.fehler.abstand;
      else fensterLage = lage;
    }
    setEintragFehler(fehler);
    if (Object.keys(fehler).length === 0 && "wert" in breite && "wert" in hoehe && (!tiefe || "wert" in tiefe)) {
      const neu: Eintrag = { id: naechsteId, art, breite: breite.wert, hoehe: hoehe.wert };
      if (tiefe && "wert" in tiefe) neu.tiefe = tiefe.wert;
      if (art === "Fenster" && fensterLage.wand !== undefined) {
        neu.wand = fensterLage.wand;
        neu.abstand = fensterLage.abstand;
      }
      if (art === "Esstisch") {
        neu.form = tischForm;
        if (istRunderTisch) neu.tiefe = breite.wert;
      }
      setEintraege((alt) => [...alt, neu]);
      setNaechsteId((n) => n + 1);
      setFensterWand("");
      form.reset();
    }
  }

  function allesZuruecksetzen() {
    if (!window.confirm("Really delete the room and all furniture? This cannot be undone.")) return;
    setRaum(null);
    setEintraege([]);
    setNaechsteId(1);
    setRaumFehler({});
    setEintragFehler({});
    setArt("Sofa");
    setTischForm("rechteckig");
    setFensterWand("");
    setFormularNr((n) => n + 1);
  }

  function eintragEntfernen(id: number) {
    setEintraege((alt) => alt.filter((x) => x.id !== id));
  }

  // Möbel mit Tiefe kommen in den Grundriss; ohne Raum gibt es keine Lage.
  const planMoebel: PlanMoebel[] = eintraege.flatMap((m) =>
    istPlanArt(m.art) && m.tiefe !== undefined
      ? [{ id: m.id, art: m.art, breite: m.breite, tiefe: m.tiefe, rund: m.form === "rund", x: m.x, y: m.y, drehung: m.drehung }]
      : [],
  );
  const lagen: Platziert[] = raum ? lagenBerechnen(raum, planMoebel) : [];
  const lagenNachId: Record<number, Platziert> = Object.fromEntries(lagen.map((p) => [p.id, p]));
  const ohneGrundriss = [
    ...new Set(
      eintraege
        .filter((m) => m.art !== "Fenster" && !(istPlanArt(m.art) && m.tiefe !== undefined))
        .map((m) => ART_LABEL[m.art]),
    ),
  ];

  // Fenster tragen dieselbe Nummer wie in der Vorhangempfehlung und im Passt-Check.
  const fensterImPlan = eintraege
    .filter((m) => m.art === "Fenster")
    .map((m, i) => ({
      id: m.id,
      nummer: i + 1,
      breite: m.breite,
      wand: m.wand,
      abstand: m.abstand,
      // Der Raum kann nach dem Eintragen kleiner geworden sein.
      zuLang:
        raum !== null && m.wand !== undefined && m.abstand !== undefined
          ? pruefeFensterLage(m.wand, m.abstand, m.breite, raum) !== null
          : false,
    }));

  function fensterWandSetzen(id: number, lage: { wand?: Wand; abstand?: number }) {
    setEintraege((alt) =>
      alt.map((m) => {
        if (m.id !== id) return m;
        const ohne: Eintrag = { ...m };
        delete ohne.wand;
        delete ohne.abstand;
        return lage.wand !== undefined ? { ...ohne, wand: lage.wand, abstand: lage.abstand } : ohne;
      }),
    );
  }

  function lageSetzen(id: number, lage: { x: number; y: number; drehung: Drehung }) {
    setEintraege((alt) => alt.map((m) => (m.id === id ? { ...m, ...lage } : m)));
  }

  function eintragDrehen(id: number) {
    const p = lagenNachId[id];
    if (!p || !raum) return;
    lageSetzen(id, drehenUmMitte(p, raum));
  }

  return (
    <div className="layout-grid gap-y-16">
      <div className="col-span-full flex flex-col gap-16 lg:sticky lg:top-32 lg:col-span-5 lg:max-h-[calc(100vh-10rem)] lg:self-start lg:overflow-y-auto">
        <section
          id="raum-formular"
          aria-labelledby={`${uid}-raum`}
          className="border-t border-foreground pt-6"
        >
          <h2 id={`${uid}-raum`} className="font-display text-h3 font-normal tracking-heading">
            Room
          </h2>
          <p className="mt-2 text-muted">All measurements in centimetres.</p>
          <form key={`raum-${formularNr}`} onSubmit={raumUebernehmen} noValidate className="mt-4 flex flex-col gap-4">
            {(
              [
                ["laenge", "Length", "for example 520"],
                ["breite", "Width", "for example 420"],
                ["hoehe", "Ceiling height", "for example 250"],
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
              Apply room
            </button>
          </form>
        </section>

        <section
          id="moebel-formular"
          aria-labelledby={`${uid}-moebel`}
          className="border-t border-foreground pt-6"
        >
          <h2 id={`${uid}-moebel`} className="font-display text-h3 font-normal tracking-heading">
            Add furniture or window
          </h2>
          <form key={`moebel-${formularNr}`} onSubmit={eintragHinzufuegen} noValidate className="mt-4 flex flex-col gap-4">
            <div>
              <label htmlFor={`${uid}-art`} className="text-sm font-normal">
                Type
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
                    {ART_LABEL[a]}
                  </option>
                ))}
              </select>
            </div>
            {art === "Esstisch" && (
              <div>
                <label htmlFor={`${uid}-form`} className="text-sm font-normal">
                  Shape
                </label>
                <select
                  id={`${uid}-form`}
                  name="form"
                  value={tischForm}
                  onChange={(e) => setTischForm(e.target.value as Form)}
                  className={feldKlasse}
                >
                  <option value="rechteckig">rectangular</option>
                  <option value="rund">round</option>
                </select>
              </div>
            )}
            {(
              [
                ["breite", istRunderTisch ? "Diameter" : "Width"],
                ["hoehe", art === "Bett" ? "Height of mattress top" : "Height"],
                ...(hatTiefe ? [["tiefe", art === "Bett" ? "Length" : "Depth"]] : []),
              ] as const
            ).map(([name, label]) => (
              <div key={name}>
                <label htmlFor={`${uid}-e-${name}`} className="text-sm font-normal">
                  {label}{" "}
                  <span className="font-normal text-muted">
                    {art === "Esstisch" && name === "hoehe" ? "(in cm, 75 if left empty)" : "(in cm)"}
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
            {art === "Fenster" && (
              <FensterLageFelder
                uid={`${uid}-neu`}
                wand={fensterWand}
                onWand={setFensterWand}
                fehler={eintragFehler.abstand}
              />
            )}
            <button type="submit" className={zweitKnopfKlasse}>
              Add
            </button>
          </form>
        </section>
      </div>

      <div className="col-span-full flex flex-col gap-16 lg:col-span-6 lg:col-start-7">
        <section aria-labelledby={`${uid}-zusammenfassung`} className="border-t border-foreground pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id={`${uid}-zusammenfassung`} className="font-display text-h3 font-normal tracking-heading">
              Summary
            </h2>
            <button
              type="button"
              onClick={allesZuruecksetzen}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm border border-foreground px-4 font-normal transition-colors duration-150 hover:bg-subtle"
            >
              Start over
            </button>
          </div>
          <div aria-live="polite">
            {raum ? (
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                <dt className="text-muted">Length</dt>
                <dd className="font-medium">{formatZahl(raum.laenge, 1)} cm</dd>
                <dt className="text-muted">Width</dt>
                <dd className="font-medium">{formatZahl(raum.breite, 1)} cm</dd>
                <dt className="text-muted">Ceiling height</dt>
                <dd className="font-medium">{formatZahl(raum.hoehe, 1)} cm</dd>
                <dt className="text-muted">Room area</dt>
                <dd className="font-medium">{formatZahl((raum.laenge * raum.breite) / 10000, 2)} m²</dd>
              </dl>
            ) : (
              <p className="mt-4 text-muted">
                No room applied yet. Enter length, width and ceiling height and tap “Apply room”.
              </p>
            )}
          </div>
        </section>

        <section aria-labelledby={`${uid}-liste`} className="border-t border-foreground pt-6">
          <h2 id={`${uid}-liste`} className="font-display text-h3 font-normal tracking-heading">
            Furniture and windows
          </h2>
          {eintraege.length === 0 ? (
            <p className="mt-4 text-muted">
              Nothing entered yet.{" "}
              <a href="#moebel-formular" className="inline-flex min-h-11 items-center font-normal text-foreground underline underline-offset-4">
                Go to the form to add a sofa or window
              </a>
              .
            </p>
          ) : (
            <ul className="mt-4 flex flex-col">
              {eintraege.map((x) => (
                <li key={x.id} className="border-t border-border py-4">
                  <div className="flex items-center justify-between gap-4">
                  <span>
                    <span className="font-medium">{ART_LABEL[x.art]}</span>
                    <span className="block text-muted">
                      {x.form === "rund"
                        ? `round, diameter ${formatZahl(x.breite, 1)} cm, ${formatZahl(x.hoehe, 1)} cm high`
                        : `${formatZahl(x.breite, 1)} cm wide, ${formatZahl(x.hoehe, 1)} cm high${x.tiefe ? `, ${formatZahl(x.tiefe, 1)} cm deep` : ""}`}
                    </span>
                    {x.art === "Fenster" && (
                      <span className="block text-muted">
                        {x.wand !== undefined && x.abstand !== undefined
                          ? `${WAND_NAME[x.wand]}, ${formatZahl(x.abstand, 1)} cm from the ${WAND_VON[x.wand]}`
                          : "Wall missing"}
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => eintragEntfernen(x.id)}
                    aria-label={`Remove ${ART_LABEL[x.art]}`}
                    className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm border border-foreground px-4 font-normal transition-colors duration-150 hover:bg-subtle"
                  >
                    Remove
                  </button>
                  </div>
                  {x.art === "Fenster" && (
                    <details className="mt-2">
                      <summary className="flex min-h-11 cursor-pointer items-center font-normal underline underline-offset-4">
                        {x.wand !== undefined ? "Change wall" : "Set wall"}
                      </summary>
                      <FensterLageForm
                        key={`${x.id}-${x.wand ?? ""}-${x.abstand ?? ""}-${formularNr}`}
                        raum={raum}
                        fenster={x}
                        onSpeichern={(lage) => fensterWandSetzen(x.id, lage)}
                      />
                    </details>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <Grundriss
          raum={raum}
          moebel={lagen}
          ohneGrundriss={ohneGrundriss}
          fenster={fensterImPlan}
          onLage={lageSetzen}
          onDrehen={eintragDrehen}
        />

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
          lagen={lagenNachId}
        />

        <EsstischEmpfehlung
          raum={raum}
          lagen={lagenNachId}
          tische={eintraege
            .filter((x) => x.art === "Esstisch")
            .map((x) => ({
              id: x.id,
              form: x.form ?? "rechteckig",
              breite: x.breite,
              tiefe: x.tiefe ?? x.breite,
              hoehe: x.hoehe,
            }))}
        />

        <BettEmpfehlung
          raum={raum}
          lagen={lagenNachId}
          betten={eintraege
            .filter((x) => x.art === "Bett")
            .map((x) => ({ id: x.id, breite: x.breite, tiefe: x.tiefe ?? 0, hoehe: x.hoehe }))}
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

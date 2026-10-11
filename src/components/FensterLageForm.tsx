"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import FensterLageFelder from "@/components/FensterLageFelder";
import { leseFensterLage } from "@/lib/fenster";
import type { Wand } from "@/lib/fenster";

type Props = {
  raum: { laenge: number; breite: number } | null;
  fenster: { breite: number; wand?: Wand; abstand?: number };
  onSpeichern: (lage: { wand?: Wand; abstand?: number }) => void;
};

/** Kleines Formular, um die Wand eines schon eingetragenen Fensters festzulegen oder zu ändern. */
export default function FensterLageForm({ raum, fenster, onSpeichern }: Props) {
  const uid = useId();
  const [wand, setWand] = useState<Wand | "">(fenster.wand ?? "");
  const [fehler, setFehler] = useState<string | undefined>();

  function speichern(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ergebnis = leseFensterLage(new FormData(e.currentTarget), fenster.breite, raum);
    if ("fehler" in ergebnis) {
      setFehler(ergebnis.fehler.abstand);
      return;
    }
    setFehler(undefined);
    onSpeichern(ergebnis);
  }

  return (
    <form onSubmit={speichern} noValidate className="mt-4 flex flex-col gap-4">
      <FensterLageFelder
        uid={uid}
        wand={wand}
        onWand={(w) => {
          setWand(w);
          setFehler(undefined);
        }}
        fehler={fehler}
        abstandStart={fenster.wand === wand ? fenster.abstand : undefined}
      />
      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center rounded-sm border border-foreground px-6 font-normal text-foreground transition-colors duration-150 hover:bg-subtle"
      >
        Wand übernehmen
      </button>
    </form>
  );
}

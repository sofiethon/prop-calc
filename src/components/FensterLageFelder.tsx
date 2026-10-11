import Fehler from "@/components/Fehler";
import { WAENDE, WAND_NAME, WAND_VON } from "@/lib/fenster";
import type { Wand } from "@/lib/fenster";

type Props = {
  uid: string;
  wand: Wand | "";
  onWand: (wand: Wand | "") => void;
  fehler?: string;
  abstandStart?: number;
};

const feldKlasse =
  "mt-2 block min-h-12 w-full rounded-sm border border-dark-600 bg-white px-4 text-base aria-invalid:border-2 aria-invalid:border-foreground";

/** Auswahl der Wand und Abstand von der Ecke; die Felder heißen „wand“ und „abstand“. */
export default function FensterLageFelder({ uid, wand, onWand, fehler, abstandStart }: Props) {
  return (
    <>
      <div>
        <label htmlFor={`${uid}-wand`} className="text-sm font-normal">
          Wand <span className="font-normal text-muted">(freiwillig)</span>
        </label>
        <select
          id={`${uid}-wand`}
          name="wand"
          value={wand}
          onChange={(e) => onWand(e.target.value as Wand | "")}
          className={feldKlasse}
        >
          <option value="">Noch keine Wand</option>
          {WAENDE.map((w) => (
            <option key={w} value={w}>
              {WAND_NAME[w]}
            </option>
          ))}
        </select>
      </div>
      {wand !== "" && (
        <div>
          <label htmlFor={`${uid}-abstand`} className="text-sm font-normal">
            Abstand von der {WAND_VON[wand]} <span className="font-normal text-muted">(in cm, zum Beispiel 40)</span>
          </label>
          <input
            id={`${uid}-abstand`}
            name="abstand"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            defaultValue={abstandStart !== undefined ? String(abstandStart).replace(".", ",") : undefined}
            aria-invalid={fehler ? true : undefined}
            aria-describedby={fehler ? `${uid}-abstand-fehler` : undefined}
            className={feldKlasse}
          />
          <Fehler id={`${uid}-abstand-fehler`} text={fehler} />
        </div>
      )}
    </>
  );
}

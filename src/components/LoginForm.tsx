"use client";

import { useActionState, useId, useState } from "react";
import { zugang } from "@/app/login/actions";
import Fehler from "@/components/Fehler";

const feldKlasse =
  "mt-2 block min-h-12 w-full rounded-sm border border-dark-600 bg-white px-4 text-base aria-invalid:border-2 aria-invalid:border-foreground";

export default function LoginForm() {
  const uid = useId();
  const [modus, setModus] = useState<"anmelden" | "registrieren">("anmelden");
  const [zustand, formAktion, laeuft] = useActionState(zugang, {});
  const istAnmelden = modus === "anmelden";

  return (
    <form action={formAktion} noValidate className="flex flex-col gap-6">
      <input type="hidden" name="modus" value={modus} />

      <div>
        <label htmlFor={`${uid}-email`} className="text-sm font-normal">
          E-Mail
        </label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={zustand.email}
          aria-invalid={zustand.feld === "email" || undefined}
          aria-describedby={zustand.feld === "email" ? `${uid}-email-fehler` : undefined}
          className={feldKlasse}
        />
        {zustand.feld === "email" && <Fehler id={`${uid}-email-fehler`} text={zustand.fehler} />}
      </div>

      <div>
        <label htmlFor={`${uid}-passwort`} className="text-sm font-normal">
          Passwort{" "}
          {!istAnmelden && <span className="font-normal text-muted">(mindestens 8 Zeichen)</span>}
        </label>
        <input
          id={`${uid}-passwort`}
          name="passwort"
          type="password"
          autoComplete={istAnmelden ? "current-password" : "new-password"}
          aria-invalid={zustand.feld === "passwort" || undefined}
          aria-describedby={zustand.feld === "passwort" ? `${uid}-passwort-fehler` : undefined}
          className={feldKlasse}
        />
        {zustand.feld === "passwort" && <Fehler id={`${uid}-passwort-fehler`} text={zustand.fehler} />}
      </div>

      {!zustand.feld && <Fehler id={`${uid}-fehler`} text={zustand.fehler} />}
      {zustand.hinweis && (
        <p role="status" className="font-normal text-foreground">
          {zustand.hinweis}
        </p>
      )}

      <button
        type="submit"
        disabled={laeuft}
        className="inline-flex min-h-12 items-center justify-center rounded-sm bg-foreground px-6 font-normal text-background transition-colors duration-150 hover:bg-dark-800 disabled:opacity-60"
      >
        {istAnmelden ? "Anmelden" : "Registrieren"}
      </button>

      <p className="text-base">
        {istAnmelden ? "Noch kein Konto? " : "Schon ein Konto? "}
        <button
          type="button"
          onClick={() => setModus(istAnmelden ? "registrieren" : "anmelden")}
          className="min-h-11 font-normal text-foreground underline underline-offset-4"
        >
          {istAnmelden ? "Registrieren" : "Anmelden"}
        </button>
      </p>
    </form>
  );
}

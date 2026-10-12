"use client";

import { useId, useState } from "react";
import Fehler from "@/components/Fehler";

const feldKlasse =
  "mt-2 block min-h-12 w-full rounded-sm border border-dark-600 bg-white px-4 text-base aria-invalid:border-2 aria-invalid:border-foreground";

const LEISTUNGEN = ["Interior Design", "Home Staging", "Not sure yet"];

type Feld = "name" | "email" | "service" | "message" | "privacy";
type Fehlerliste = Partial<Record<Feld, string>>;

export default function ContactForm() {
  const uid = useId();
  const [fehler, setFehler] = useState<Fehlerliste>({});
  const [gesendet, setGesendet] = useState(false);

  function pruefen(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const daten = new FormData(e.currentTarget);
    const text = (n: string) => String(daten.get(n) ?? "").trim();
    const neu: Fehlerliste = {};
    if (!text("name")) neu.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(text("email"))) neu.email = "Please enter a valid email address.";
    if (!LEISTUNGEN.includes(text("service"))) neu.service = "Please choose a service.";
    if (!text("message")) neu.message = "Please tell us a little about your project.";
    if (daten.get("privacy") !== "on") neu.privacy = "Please confirm that you have read the privacy policy.";
    setFehler(neu);
    // Noch kein Versand: Das Formular zeigt nur die Bestätigung.
    if (Object.keys(neu).length === 0) setGesendet(true);
  }

  if (gesendet) {
    return (
      <div role="status">
        <h3 className="mb-4 font-display text-h3 font-normal tracking-heading text-foreground">Thank you.</h3>
        <p className="max-w-measure text-body">
          Your enquiry has been received. We will reply within [two working days].
        </p>
      </div>
    );
  }

  const f = (n: Feld) => ({
    "aria-invalid": fehler[n] ? true : undefined,
    "aria-describedby": fehler[n] ? `${uid}-${n}-fehler` : undefined,
  });

  return (
    <form onSubmit={pruefen} noValidate className="flex flex-col gap-6">
      <div>
        <label htmlFor={`${uid}-name`} className="text-sm font-normal">
          Name
        </label>
        <input id={`${uid}-name`} name="name" type="text" autoComplete="name" className={feldKlasse} {...f("name")} />
        <Fehler id={`${uid}-name-fehler`} text={fehler.name} />
      </div>

      <div>
        <label htmlFor={`${uid}-email`} className="text-sm font-normal">
          Email
        </label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          autoComplete="email"
          className={feldKlasse}
          {...f("email")}
        />
        <Fehler id={`${uid}-email-fehler`} text={fehler.email} />
      </div>

      <div>
        <label htmlFor={`${uid}-phone`} className="text-sm font-normal">
          Phone <span className="text-muted">(optional)</span>
        </label>
        <input id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel" className={feldKlasse} />
      </div>

      <div>
        <label htmlFor={`${uid}-service`} className="text-sm font-normal">
          Service
        </label>
        <select id={`${uid}-service`} name="service" defaultValue="" className={feldKlasse} {...f("service")}>
          <option value="" disabled>
            Please choose
          </option>
          {LEISTUNGEN.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <Fehler id={`${uid}-service-fehler`} text={fehler.service} />
      </div>

      <div>
        <label htmlFor={`${uid}-location`} className="text-sm font-normal">
          Property location <span className="text-muted">(optional)</span>
        </label>
        <input id={`${uid}-location`} name="location" type="text" className={feldKlasse} />
      </div>

      <div>
        <label htmlFor={`${uid}-message`} className="text-sm font-normal">
          Message
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={5}
          className={`${feldKlasse} py-3`}
          {...f("message")}
        />
        <Fehler id={`${uid}-message-fehler`} text={fehler.message} />
      </div>

      <div>
        <div className="flex items-start gap-4">
          <input
            id={`${uid}-privacy`}
            name="privacy"
            type="checkbox"
            className="mt-1 h-6 w-6 shrink-0 accent-foreground"
            {...f("privacy")}
          />
          <label htmlFor={`${uid}-privacy`} className="text-base font-normal">
            I have read the{" "}
            <a href="#" className="underline underline-offset-4">
              privacy policy
            </a>{" "}
            and agree that my details are used to answer my enquiry.
          </label>
        </div>
        <Fehler id={`${uid}-privacy-fehler`} text={fehler.privacy} />
      </div>

      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center self-start rounded-sm border border-foreground px-6 font-normal text-foreground transition-colors duration-150 hover:bg-subtle"
      >
        Send enquiry
      </button>
    </form>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { abmelden } from "@/app/login/actions";

const SEITEN = [
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/#kontakt", label: "Contact" },
];

// Der Eintrag gilt als aktuell, sobald die Oberkante seines Abschnitts im oberen Drittel des Fensters ist.
const ABSCHNITT_IDS = SEITEN.map((s) => s.href.replace("/#", ""));

const eintragKlasse =
  "flex min-h-11 w-full items-center px-4 text-left text-base font-normal text-foreground transition-colors duration-150 hover:bg-subtle";

export default function MenuDropdown({ angemeldet }: { angemeldet: boolean }) {
  const [offen, setOffen] = useState(false);
  const wurzel = useRef<HTMLDivElement>(null);
  const knopf = useRef<HTMLButtonElement>(null);
  const [aktuell, setAktuell] = useState<string | null>(null);
  const panelId = useId();
  const aufStartseite = usePathname() === "/";

  useEffect(() => {
    if (!aufStartseite) return;
    const berechnen = () => {
      const grenze = window.innerHeight / 3;
      let gefunden: string | null = null;
      for (const id of ABSCHNITT_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= grenze) gefunden = id;
      }
      setAktuell(gefunden);
    };
    berechnen();
    window.addEventListener("scroll", berechnen, { passive: true });
    window.addEventListener("resize", berechnen);
    return () => {
      window.removeEventListener("scroll", berechnen);
      window.removeEventListener("resize", berechnen);
    };
  }, [aufStartseite]);

  useEffect(() => {
    if (!offen) return;
    const beiKlick = (e: MouseEvent) => {
      if (wurzel.current && !wurzel.current.contains(e.target as Node)) setOffen(false);
    };
    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOffen(false);
        knopf.current?.focus();
      }
    };
    document.addEventListener("mousedown", beiKlick);
    document.addEventListener("keydown", beiTaste);
    return () => {
      document.removeEventListener("mousedown", beiKlick);
      document.removeEventListener("keydown", beiTaste);
    };
  }, [offen]);

  const zu = () => setOffen(false);

  return (
    <div ref={wurzel} className="relative">
      <button
        ref={knopf}
        type="button"
        aria-expanded={offen}
        aria-controls={panelId}
        onClick={() => setOffen((o) => !o)}
        className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-foreground px-4 text-base font-normal text-foreground transition-colors duration-150 hover:bg-subtle"
      >
        Menu
        {offen ? <X size={20} strokeWidth={1.25} aria-hidden="true" /> : <Menu size={20} strokeWidth={1.25} aria-hidden="true" />}
      </button>

      <AnimatePresence>
      {offen && (
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          id={panelId}
          aria-label="Main menu"
          className="absolute right-0 top-full z-10 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-md border border-border bg-background py-2"
        >
          <ul>
            {SEITEN.map((s) => {
              const istAktuell = aufStartseite && aktuell === s.href.replace("/#", "");
              return (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    onClick={zu}
                    aria-current={istAktuell ? "location" : undefined}
                    className={eintragKlasse}
                  >
                    <span className={istAktuell ? "underline underline-offset-4" : undefined}>{s.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul className="mt-2 border-t border-border pt-2">
            {angemeldet ? (
              <>
                <li>
                  <Link href="/get-creative" onClick={zu} className={eintragKlasse}>
                    Get creative
                  </Link>
                </li>
                <li>
                  <form action={abmelden}>
                    <button type="submit" className={eintragKlasse}>
                      Sign out
                    </button>
                  </form>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" onClick={zu} className={eintragKlasse}>
                  Sign in
                </Link>
              </li>
            )}
          </ul>
        </motion.nav>
      )}
      </AnimatePresence>
    </div>
  );
}

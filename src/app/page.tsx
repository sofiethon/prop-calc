import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Die Ankerziele (id) müssen zu den Links in src/components/MenuDropdown.tsx passen.
const ABSCHNITTE = [
  { id: "about", titel: "Über uns", text: "Hier entsteht die Vorstellung von SoTho Interiors. Der Text folgt." },
  { id: "portfolio", titel: "Portfolio", text: "Hier erscheinen ausgewählte Projekte. Die Auswahl folgt." },
  { id: "buchung", titel: "Buchungen", text: "Hier entsteht die Terminbuchung. Der Text folgt." },
  { id: "kontakt", titel: "Kontakt", text: "Hier stehen die Kontaktdaten. Sie folgen." },
];

export default async function Startseite() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const angemeldet = Boolean(data?.claims);

  return (
    <main className="flex flex-1 flex-col">
      <section className="page-container py-16 md:py-24 lg:py-32">
        <div className="layout-grid">
          <div className="col-span-4 md:col-span-8 lg:col-span-9">
            <h1 className="mb-8 font-display text-display font-normal tracking-display text-foreground">
              SoTho Interiors
            </h1>
            <p className="mb-12 max-w-measure text-body">
              Räume, deren Maße sich begründen lassen. Ruhig geplant, mit belegten Zahlen.
            </p>
            <Link
              href={angemeldet ? "/get-creative" : "/login"}
              className="inline-flex min-h-12 items-center justify-center rounded-sm bg-foreground px-6 font-normal text-background transition-colors duration-150 hover:bg-dark-800"
            >
              {angemeldet ? "Get creative" : "Anmelden"}
            </Link>
          </div>
        </div>
      </section>

      {ABSCHNITTE.map((a) => (
        <section key={a.id} id={a.id} aria-labelledby={`${a.id}-titel`} className="border-t border-border">
          <div className="page-container layout-grid py-16 md:py-20">
            <h2
              id={`${a.id}-titel`}
              className="col-span-4 mb-4 font-display text-h2 font-normal tracking-heading text-foreground md:col-span-3 lg:col-span-4"
            >
              {a.titel}
            </h2>
            <p className="col-span-4 max-w-measure text-body md:col-span-5 lg:col-span-6">{a.text}</p>
          </div>
        </section>
      ))}
    </main>
  );
}

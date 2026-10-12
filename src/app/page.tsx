import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Die Ankerziele (id) müssen zu den Links in src/components/MenuDropdown.tsx passen.
const UEBER_UNS = [
  {
    titel: "Interior Design",
    text: "Residential concepts built on layout, proportion and circulation. Furniture, colour, light and materials are decided together, so every room has a clear hierarchy and a calm, lasting character. We don’t follow trends. We design interiors that stay right.",
  },
  {
    titel: "Home Staging",
    text: "For real-estate agents, developers and private sellers. We prepare a property so buyers recognise each room’s purpose, understand its proportions and can imagine living there. Refined and broadly accessible, never overly personal.",
  },
  {
    titel: "Less is more",
    text: "Good design comes from relationships, not decoration: between space and proportion, function and material, light, colour and movement. We reduce until what remains is clear. Reduction, not emptiness.",
  },
];

const ABSCHNITTE = [
  { id: "portfolio", titel: "Portfolio", text: "Selected projects will appear here. The selection will follow." },
  { id: "buchung", titel: "Bookings", text: "The booking function will appear here. Text to follow." },
  { id: "kontakt", titel: "Contact", text: "Contact details will appear here. They will follow." },
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
              Rooms whose measurements can be justified. Calmly planned, with documented numbers.
            </p>
            <Link
              href={angemeldet ? "/get-creative" : "/login"}
              className="inline-flex min-h-12 items-center justify-center rounded-sm bg-foreground px-6 font-normal text-background transition-colors duration-150 hover:bg-dark-800"
            >
              {angemeldet ? "Get creative" : "Sign in"}
            </Link>
          </div>
        </div>
      </section>

      <section id="about" aria-labelledby="about-titel" className="border-t border-border">
        <div className="page-container layout-grid py-16 md:py-20">
          <h2
            id="about-titel"
            className="col-span-4 mb-4 font-display text-h2 font-normal tracking-heading text-foreground md:col-span-3 lg:col-span-4"
          >
            About
          </h2>
          <div className="col-span-4 md:col-span-5 lg:col-span-6">
            <p className="mb-6 font-display text-h3 font-normal tracking-heading text-foreground">
              Space, understood.
            </p>
            <p className="mb-12 max-w-measure text-body">
              SoTho is an interior design studio in Austria. We plan residential interiors and stage properties for
              sale. Both begin with the same question: how does a space work, and how should it feel?
            </p>
            <ul className="mb-12 flex flex-col gap-8">
              {UEBER_UNS.map((u) => (
                <li key={u.titel}>
                  <h3 className="mb-2 font-display text-h3 font-normal tracking-heading text-foreground">{u.titel}</h3>
                  <p className="max-w-measure text-body">{u.text}</p>
                </li>
              ))}
            </ul>
            <p className="mb-8 max-w-measure text-body text-muted">
              Where we work: Vienna, its surroundings and Lower Austria.
            </p>
            <Link
              href="#kontakt"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-foreground px-6 font-normal text-foreground transition-colors duration-150 hover:bg-subtle"
            >
              Start a project
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

import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { Reveal, RevealSection } from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";

// Die Ankerziele (id) müssen zu den Links in src/components/MenuDropdown.tsx passen.
const INTRO = [
  "SoTho is an interior design studio in Austria, focused on residential interiors and home staging. At the core of every project is the same question: how does a space work, and how should it feel to live in it?",
  "For me, good design starts with understanding the room itself, but also the people who will use it. The goal is to create spaces that feel considered, balanced and natural rather than overdesigned.",
];

const LEISTUNGEN = [
  {
    titel: "Interior Design",
    absaetze: [
      "I create residential interiors that are built around layout, proportion and the way people move through a space. Furniture, colour, light and materials are not treated as separate decisions, but as parts of one overall concept.",
      "The result should feel clear and calm, with a strong sense of balance and character. I do not design around short-lived trends.",
      "I prefer interiors that feel personal, functional and lasting, so they still feel right years later.",
    ],
  },
  {
    titel: "Home Staging",
    absaetze: [
      "For real estate agents, developers and private sellers, I prepare properties in a way that helps potential buyers understand them more easily.",
      "Home staging should make the purpose of each room clear, show its proportions and help people imagine how they could live there. The aim is not to create an overly specific lifestyle, but to give the property warmth, structure and a sense of possibility.",
      "The result is refined and inviting, while still leaving enough space for buyers to imagine their own life in the home.",
    ],
  },
];

const WENIGER_IST_MEHR = [
  "For me, this is more than a design principle. It is something I genuinely believe in, and a rule I come back to in both design and everyday life.",
  "I am from Austria, but I grew up in New York City. Living there shaped the way I see space, architecture and movement. I was surrounded by strong lines, modern buildings, contrast, energy and a certain confidence in simplicity. That still influences the way I design today.",
  "Mies van der Rohe has always been one of my biggest influences. His approach to proportion, structure and reduction taught me that a space does not need more to feel complete. It needs the right elements, in the right relationship to each other.",
  "I began my interior design studies at Parsons School of Design at The New School in New York. After moving back to Austria, I completed my degree at New Design University. That mix of New York and Austria is still very present in my work: the energy and architectural clarity of the city, combined with a more grounded and considered way of living.",
  "When I design a space, I want it to feel clear, calm and natural to live in. I look at how people move through a room, how light changes it, how materials work together and how every element relates to the next. I do not believe in adding decoration just to fill a space. I believe in creating the right balance.",
];

const ABSCHNITTE = [
  { id: "portfolio", titel: "Portfolio", text: "Selected projects will appear here. The selection will follow." },
];

export default async function Startseite() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const angemeldet = Boolean(data?.claims);

  return (
    <main className="flex flex-1 flex-col">
      <section id="hero" className="relative isolate overflow-hidden">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center opacity-20"
        />
        <div className="page-container layout-grid py-16 md:py-24 lg:py-32">
          <div className="col-span-4 md:col-span-8 lg:col-span-9">
            <Reveal>
              <h1 className="mb-8 font-display text-display font-normal tracking-display text-foreground">
                SoTho Interiors
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mb-12 max-w-measure text-body">
                Rooms whose measurements can be justified. Calmly planned, with documented numbers.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href={angemeldet ? "/get-creative" : "/login"}
                className="inline-flex min-h-12 items-center justify-center rounded-sm bg-foreground px-6 font-normal text-background transition-colors duration-150 hover:bg-dark-800"
              >
                {angemeldet ? "Get creative" : "Sign in"}
              </Link>
              <a
                href="#kontakt"
                className="inline-flex min-h-11 items-center font-normal text-foreground underline underline-offset-4"
              >
                Start a project
              </a>
            </Reveal>
          </div>

        </div>
      </section>

      <RevealSection id="about" aria-labelledby="about-titel" className="border-t border-border">
        <div className="page-container layout-grid py-16 md:py-20">
          <h2
            id="about-titel"
            className="col-span-4 mb-8 font-display text-h2 font-normal tracking-heading text-foreground md:col-span-8 lg:col-span-12"
          >
            About
          </h2>

          <div className="col-span-4 mb-12 md:col-span-5 lg:col-span-6">
            <p className="mb-6 font-display text-h3 font-normal tracking-heading text-foreground">
              Space, understood.
            </p>
            {INTRO.map((t) => (
              <p key={t} className="mb-6 max-w-measure text-body">
                {t}
              </p>
            ))}
            <h3 className="mb-6 mt-12 font-display text-h3 font-normal tracking-heading text-foreground">
              Less is more
            </h3>
            {WENIGER_IST_MEHR.map((t) => (
              <p key={t} className="mb-6 max-w-measure text-body last:mb-0">
                {t}
              </p>
            ))}
          </div>

          <figure className="col-span-4 md:sticky md:top-40 md:col-span-3 md:self-start lg:col-span-5 lg:col-start-8">
            <Image
              src="/about-portrait.jpg"
              alt="Portrait of Sofie Thonhauser, founder and designer of SoTho Interiors"
              width={1122}
              height={1402}
              sizes="(min-width: 1200px) 40vw, (min-width: 768px) 35vw, 100vw"
              className="aspect-[4/5] w-full rounded-sm object-cover"
            />
            <figcaption className="mt-2 text-caption text-muted">Sofie Thonhauser, Founder &amp; Designer</figcaption>
          </figure>
        </div>
      </RevealSection>

      <RevealSection id="services" aria-labelledby="services-titel" className="border-t border-border">
        <div className="page-container layout-grid py-16 md:py-20">
          <h2
            id="services-titel"
            className="col-span-4 mb-8 font-display text-h2 font-normal tracking-heading text-foreground md:col-span-8 lg:col-span-12"
          >
            Services
          </h2>
          <ul className="col-span-4 mb-12 grid grid-cols-subgrid gap-y-8 md:col-span-8 lg:col-span-12">
            {LEISTUNGEN.map((l) => (
              <li key={l.titel} className="col-span-4 flex flex-col lg:col-span-6">
                <h3 className="mb-6 font-display text-h3 font-normal tracking-heading text-foreground">{l.titel}</h3>
                <div className="flex flex-1 flex-col">
                  {l.absaetze.map((t) => (
                    <p key={t} className="mb-6 max-w-measure text-body last:mb-0 last:mt-auto">
                      {t}
                    </p>
                  ))}
                </div>
                <a
                  href="#kontakt"
                  className="mt-8 inline-flex min-h-12 items-center justify-center self-start rounded-sm border border-foreground px-6 font-normal text-foreground transition-colors duration-150 hover:bg-subtle"
                >
                  Start a project
                </a>
              </li>
            ))}
          </ul>
          <div className="col-span-4 md:col-span-8 lg:col-span-12">
            <p className="max-w-measure text-body text-muted">
              Where I work: Vienna and Lower Austria. Online Interior Consultings are also possible.
            </p>
          </div>
        </div>
      </RevealSection>

      {ABSCHNITTE.map((a) => (
        <RevealSection key={a.id} id={a.id} aria-labelledby={`${a.id}-titel`} className="border-t border-border">
          <div className="page-container layout-grid py-16 md:py-20">
            <h2
              id={`${a.id}-titel`}
              className="col-span-4 mb-4 font-display text-h2 font-normal tracking-heading text-foreground md:col-span-3 lg:col-span-4"
            >
              {a.titel}
            </h2>
            <p className="col-span-4 max-w-measure text-body md:col-span-5 lg:col-span-6">{a.text}</p>
          </div>
        </RevealSection>
      ))}
      <RevealSection id="kontakt" aria-labelledby="kontakt-titel" className="border-t border-border">
        <div className="page-container layout-grid py-16 md:py-20">
          <h2
            id="kontakt-titel"
            className="col-span-4 mb-8 font-display text-h2 font-normal tracking-heading text-foreground md:col-span-8 lg:col-span-12"
          >
            Contact
          </h2>

          <div className="col-span-4 mb-12 md:col-span-8 lg:col-span-5">
            <p className="mb-6 font-display text-h3 font-normal tracking-heading text-foreground">
              Every project starts with a conversation.
            </p>
            <p className="mb-8 max-w-measure text-body">
              Tell us about your home or property. We reply within [two working days].
            </p>
            <dl className="max-w-measure text-body">
              {[
                ["Email", "[hello@sotho.at]"],
                ["Phone", "[+43 000 000 0000]"],
                ["Studio", "[Street, postcode, city]"],
                ["Service area", "Vienna, its surroundings and Lower Austria"],
              ].map(([k, v]) => (
                <div key={k} className="mb-4">
                  <dt className="text-sm font-normal text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </div>
        </div>
      </RevealSection>
    </main>
  );
}

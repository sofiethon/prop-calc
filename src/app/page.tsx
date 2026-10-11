import RaumEingabe from "@/components/RaumEingabe";

export default function Home() {
  return (
    <main className="page-container flex flex-1 flex-col py-16 md:py-20 lg:py-24">
      <div className="mb-16 max-w-measure">
        <h1 className="mb-4 font-display text-h1 font-normal tracking-display text-foreground">
          Raum und Möbel eingeben
        </h1>
        <p className="text-body">
          Trag die Maße des Raums und der wichtigsten Möbel ein. Daraus entstehen später die Empfehlungen.
        </p>
      </div>
      <RaumEingabe />
    </main>
  );
}

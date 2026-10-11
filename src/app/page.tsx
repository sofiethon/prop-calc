import RaumEingabe from "@/components/RaumEingabe";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:py-12">
      <h1 className="mb-2 text-3xl font-bold leading-tight sm:text-4xl">Raum und Möbel eingeben</h1>
      <p className="mb-8 max-w-xl text-lg text-muted">
        Trag die Maße des Raums und der wichtigsten Möbel ein. Daraus entstehen später die Empfehlungen.
      </p>
      <RaumEingabe />
    </main>
  );
}

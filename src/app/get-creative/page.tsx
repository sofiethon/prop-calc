import type { Metadata } from "next";
import { redirect } from "next/navigation";
import RaumEingabe from "@/components/RaumEingabe";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Get creative" };

export default async function GetCreative() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");

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

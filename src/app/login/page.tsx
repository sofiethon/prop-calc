import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginSeite() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect("/get-creative");

  return (
    <main className="page-container flex flex-1 flex-col py-16 md:py-20 lg:py-24">
      <div className="layout-grid">
        <div className="col-span-4 md:col-span-6 lg:col-span-5">
          <h1 className="mb-4 font-display text-h1 font-normal tracking-display text-foreground">Sign in</h1>
          <p className="mb-8 max-w-measure text-body">
            With an account you can open “Get creative”, the calculator for room and furniture.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

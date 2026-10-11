import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Supabase-Client für Server-Komponenten und Server-Aktionen. Liest die Anmeldung aus den Cookies. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // In Server-Komponenten sind Cookies nur lesbar; die Auffrischung übernimmt proxy.ts.
          }
        },
      },
    },
  );
}

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Frischt die Anmeldung bei jeder Anfrage auf und schickt Nicht-Angemeldete von
 * /get-creative zum Login. Die Seite prüft zusätzlich selbst (page.tsx).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();

  if (!data?.claims && request.nextUrl.pathname.startsWith("/get-creative")) {
    const ziel = request.nextUrl.clone();
    ziel.pathname = "/login";
    ziel.search = "";
    const umleitung = NextResponse.redirect(ziel);
    response.cookies.getAll().forEach((c) => umleitung.cookies.set(c));
    return umleitung;
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sotho-logo.png).*)"],
};

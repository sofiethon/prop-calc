"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ZugangZustand = {
  fehler?: string;
  feld?: "email" | "passwort";
  hinweis?: string;
  email?: string;
};

const PASSWORT_MIN = 8;

/** Meldet an oder registriert – je nach verstecktem Feld „modus“. */
export async function zugang(_vorher: ZugangZustand, formData: FormData): Promise<ZugangZustand> {
  const modus = formData.get("modus") === "registrieren" ? "registrieren" : "anmelden";
  const email = String(formData.get("email") ?? "").trim();
  const passwort = String(formData.get("passwort") ?? "");

  if (!email) return { email, feld: "email", fehler: "Enter your email address." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { email, feld: "email", fehler: "That is not a valid email address." };
  }
  if (!passwort) return { email, feld: "passwort", fehler: "Enter your password." };

  const supabase = await createClient();

  if (modus === "anmelden") {
    const { error } = await supabase.auth.signInWithPassword({ email, password: passwort });
    if (error) {
      if (error.code === "email_not_confirmed") {
        return { email, fehler: "Please confirm your email address first. The link is in the email we sent you." };
      }
      return { email, feld: "passwort", fehler: "Email or password is incorrect." };
    }
    redirect("/get-creative");
  }

  if (passwort.length < PASSWORT_MIN) {
    return { email, feld: "passwort", fehler: `The password needs at least ${PASSWORT_MIN} characters.` };
  }

  const origin = (await headers()).get("origin");
  const { data, error } = await supabase.auth.signUp({
    email,
    password: passwort,
    options: origin ? { emailRedirectTo: `${origin}/auth/callback` } : undefined,
  });

  if (error) {
    if (error.code === "weak_password") {
      return { email, feld: "passwort", fehler: "This password is too weak. Choose a longer or less common one." };
    }
    if (error.code === "user_already_exists") {
      return { email, feld: "email", fehler: "An account with this email address already exists. Please sign in instead." };
    }
    if (error.code === "over_email_send_rate_limit" || error.code === "over_request_rate_limit") {
      return { email, fehler: "Too many attempts. Please wait a few minutes and try again." };
    }
    return { email, fehler: "Sign-up did not work. Please try again later, or sign in if you already have an account." };
  }

  if (data.session) redirect("/get-creative");

  return { email, hinweis: "We have sent you an email. Confirm your address with the link in it, then you can sign in." };
}

export async function abmelden() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

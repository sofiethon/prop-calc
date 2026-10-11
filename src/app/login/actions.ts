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

  if (!email) return { email, feld: "email", fehler: "Trag deine E-Mail-Adresse ein." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { email, feld: "email", fehler: "Das ist keine gültige E-Mail-Adresse." };
  }
  if (!passwort) return { email, feld: "passwort", fehler: "Trag dein Passwort ein." };

  const supabase = await createClient();

  if (modus === "anmelden") {
    const { error } = await supabase.auth.signInWithPassword({ email, password: passwort });
    if (error) {
      if (error.code === "email_not_confirmed") {
        return { email, fehler: "Bestätige zuerst deine E-Mail-Adresse. Der Link steht in der Mail, die wir dir geschickt haben." };
      }
      return { email, feld: "passwort", fehler: "E-Mail oder Passwort stimmen nicht." };
    }
    redirect("/get-creative");
  }

  if (passwort.length < PASSWORT_MIN) {
    return { email, feld: "passwort", fehler: `Das Passwort braucht mindestens ${PASSWORT_MIN} Zeichen.` };
  }

  const origin = (await headers()).get("origin");
  const { data, error } = await supabase.auth.signUp({
    email,
    password: passwort,
    options: origin ? { emailRedirectTo: `${origin}/auth/callback` } : undefined,
  });

  if (error) {
    if (error.code === "weak_password") {
      return { email, feld: "passwort", fehler: "Dieses Passwort ist zu schwach. Wähl ein längeres oder ungewöhnlicheres." };
    }
    return { email, fehler: "Die Registrierung hat nicht geklappt. Versuch es später noch einmal oder melde dich an, falls du schon ein Konto hast." };
  }

  if (data.session) redirect("/get-creative");

  return { email, hinweis: "Wir haben dir eine E-Mail geschickt. Bestätige die Adresse mit dem Link darin, danach kannst du dich anmelden." };
}

export async function abmelden() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

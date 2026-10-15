import { expect, test } from "@playwright/test";

// Issue 14: Der Kontaktbereich zeigt Überschrift, Kontaktdaten und Formularfelder (ohne Anmeldung).
test("Startseite zeigt den Kontaktbereich mit Daten und Formular", async ({ page }) => {
  await page.goto("/");

  const kontakt = page.locator("#kontakt");
  await kontakt.scrollIntoViewIfNeeded();

  await expect(kontakt.getByText("Every project starts with a conversation.")).toBeVisible();

  for (const label of ["Email", "Phone", "Studio", "Service area"]) {
    await expect(kontakt.locator("dt", { hasText: label })).toBeVisible();
  }

  for (const feld of ["Name", "Email", "Phone", "Service", "Property location", "Message"]) {
    await expect(kontakt.getByLabel(feld, { exact: false }).first()).toBeVisible();
  }
  await expect(kontakt.getByRole("button", { name: "Send enquiry" })).toBeVisible();
});

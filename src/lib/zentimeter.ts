/** Liest eine Zahl in Zentimetern. Gibt entweder den Wert oder eine verständliche Meldung zurück. */
export function leseZentimeter(text: string): { wert: number } | { fehler: string } {
  const t = text.trim();
  if (t === "") return { fehler: "Please enter a value in centimetres." };
  if (!/^-?\d+([.,]\d+)?$/.test(t)) {
    return { fehler: "That is not a number. Please enter digits only, for example 420." };
  }
  const wert = Number(t.replace(",", "."));
  if (wert <= 0) return { fehler: "The value must be greater than zero." };
  return { wert };
}

/** Wie leseZentimeter, aber 0 ist erlaubt, zum Beispiel für ein Fenster direkt an der Ecke. */
export function leseAbstand(text: string): { wert: number } | { fehler: string } {
  const t = text.trim();
  if (t === "") return { fehler: "Please enter a distance in centimetres, for example 40." };
  if (!/^-?\d+([.,]\d+)?$/.test(t)) {
    return { fehler: "That is not a number. Please enter digits only, for example 40." };
  }
  const wert = Number(t.replace(",", "."));
  if (wert < 0) return { fehler: "The distance must not be less than zero." };
  return { wert };
}

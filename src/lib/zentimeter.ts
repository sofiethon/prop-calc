/** Liest eine Zahl in Zentimetern. Gibt entweder den Wert oder eine verständliche Meldung zurück. */
export function leseZentimeter(text: string): { wert: number } | { fehler: string } {
  const t = text.trim();
  if (t === "") return { fehler: "Bitte trag einen Wert in Zentimetern ein." };
  if (!/^-?\d+([.,]\d+)?$/.test(t)) {
    return { fehler: "Das ist keine Zahl. Bitte nur Ziffern eingeben, zum Beispiel 420." };
  }
  const wert = Number(t.replace(",", "."));
  if (wert <= 0) return { fehler: "Der Wert muss größer als null sein." };
  return { wert };
}

/** Wie leseZentimeter, aber 0 ist erlaubt, zum Beispiel für ein Fenster direkt an der Ecke. */
export function leseAbstand(text: string): { wert: number } | { fehler: string } {
  const t = text.trim();
  if (t === "") return { fehler: "Bitte trag einen Abstand in Zentimetern ein, zum Beispiel 40." };
  if (!/^-?\d+([.,]\d+)?$/.test(t)) {
    return { fehler: "Das ist keine Zahl. Bitte nur Ziffern eingeben, zum Beispiel 40." };
  }
  const wert = Number(t.replace(",", "."));
  if (wert < 0) return { fehler: "Der Abstand darf nicht kleiner als null sein." };
  return { wert };
}

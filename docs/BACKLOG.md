# Backlog — Proportio

> Ein Issue = ein Durchgang mit Claude. Oben steht, was als Nächstes dran ist.
> Status: ⬜ offen · 🔧 in Arbeit · ✅ fertig (alle Kriterien im Browser geprüft)
> Aufbau jedes Issues: **Ziel** (was danach möglich ist, für wen und warum – „damit …“) · **Nicht im Umfang** · **Akzeptanzkriterien** (Gegeben … wenn … dann …) · **Fertig, wenn** (woran man es prüft).

## Issue 1: Raum und Möbel eingeben ✅ fertig

**Ziel:** Eine Innenarchitektin kann am Handy die Maße eines Raums und seiner wichtigsten Möbel und Fenster eingeben, damit alle späteren Empfehlungen auf echten Zahlen vom Kundentermin beruhen.

**Nicht im Umfang:** Berechnungen und Empfehlungen (kommen in Issue 2–4), Speichern über das Schließen der Seite hinaus, Konten, Grundriss-Zeichnung.

**Akzeptanzkriterien:**
- Gegeben die Startseite, wenn ich Länge, Breite und Deckenhöhe des Raums in Zentimetern eintrage, dann sehe ich eine Zusammenfassung mit diesen drei Werten und der Raumfläche in Quadratmetern.
- Gegeben ein Raum, wenn ich ein Möbelstück (Sofa) oder ein Fenster mit Breite und Höhe hinzufüge, dann erscheint es in einer Liste und ich kann es wieder entfernen.
- Gegeben ein leerer Raum ohne Möbel, dann steht in der Liste ein Satz, was man als Nächstes tun kann.
- Gegeben ein Feld ist leer, enthält null, einen negativen Wert oder keine Zahl, wenn ich weitermache, dann sehe ich eine verständliche Fehlermeldung am Feld und es wird nichts übernommen.
- Gegeben ein Handy mit 375 px Breite, dann ragt nichts über den Rand und die Eingabefelder sind mit dem Daumen gut zu treffen.

**Fertig, wenn:** Ich öffne die Startseite, gebe einen Raum und ein Sofa ein und sehe die Zusammenfassung; mit einem leeren oder negativen Wert bekomme ich eine Fehlermeldung.

## Issue 2: Teppichgröße und Möbelproportionen mit Begründung ✅ fertig

**Ziel:** Eine Innenarchitektin bekommt aus Raum und Sofa eine passende Teppichgröße, bei der die Regel und ihre Quelle mit angezeigt werden, damit sie die Zahl dem Kunden mit Fakten statt mit „mache ich immer so“ begründen kann.

**Nicht im Umfang:** Vorhang, Bild, Sitzabstände (Issue 3 und 4), Teppichkauf oder Shop, Farb- und Musterberatung.

**Akzeptanzkriterien:**
- Gegeben ein Raum und ein Sofa aus Issue 1, wenn ich die Teppichempfehlung öffne, dann sehe ich eine empfohlene Größe in Zentimetern.
- Gegeben eine Empfehlung, dann steht darunter die Regel in einem Satz und eine benannte Quelle (Norm, Fachbuch oder Designprinzip).
- Gegeben ein Raum, in den kein passender Teppich hineinpasst, wenn ich die Empfehlung öffne, dann sehe ich statt einer Zahl einen Hinweis mit dem Grund.
- Gegeben noch kein Sofa eingegeben, wenn ich die Empfehlung öffne, dann sehe ich einen Satz und einen Link zurück zur Eingabe.

**Fertig, wenn:** Ich gebe Raum und Sofa ein, öffne die Teppichempfehlung und sehe Größe, Regel und Quelle; mit einem zu kleinen Raum sehe ich einen Hinweis statt einer Zahl.

## Issue 3: Vorhangstange und Bildhöhe ⬜ offen

**Ziel:** Eine Innenarchitektin bekommt aus Fenster und Sofa die Breite und Höhe der Vorhangstange sowie Größe und Hängehöhe eines Bildes über dem Sofa, damit zwei oft geschätzte Maße belegt sind.

**Nicht im Umfang:** Auswahl von Vorhängen oder Bildern, Beleuchtung, Hängung ganzer Bilderwände.

**Akzeptanzkriterien:**
- Gegeben ein Fenster mit Breite und Höhe, wenn ich die Vorhangempfehlung öffne, dann sehe ich Stangenbreite und Stangenhöhe in Zentimetern, mit Regel und Quelle.
- Gegeben ein Sofa und eine Deckenhöhe, wenn ich die Bildempfehlung öffne, dann sehe ich Bildbreite und Hängehöhe in Zentimetern, mit Regel und Quelle.
- Gegeben ein Fenster, das höher ist als die Deckenhöhe erlaubt, wenn ich weitermache, dann sehe ich einen Hinweis statt einer Zahl.
- Gegeben kein Fenster oder kein Sofa, dann sehe ich für den betroffenen Teil einen Satz und einen Link zur Eingabe, der andere Teil funktioniert weiter.

**Fertig, wenn:** Ich gebe Fenster und Sofa ein und sehe beide Empfehlungen mit Regel und Quelle; ein zu hohes Fenster erzeugt einen Hinweis.

## Issue 4: Sitzabstände und Laufwege ⬜ offen

**Ziel:** Eine Innenarchitektin bekommt Abstände zwischen Sofa und Couchtisch, Sofa und Fernseher sowie die freien Laufwege im Raum, damit der Raum gut aussieht und trotzdem bequem begehbar bleibt.

**Nicht im Umfang:** Automatisches Anordnen der Möbel, Grundriss-Zeichnung, Barrierefreiheits-Nachweis.

**Akzeptanzkriterien:**
- Gegeben ein Raum und ein Sofa, wenn ich die Abstände öffne, dann sehe ich pro Abstand einen Wert oder Wertebereich in Zentimetern, mit Regel und Quelle.
- Gegeben die eingegebenen Möbel, wenn der Platz für den Laufweg unter dem empfohlenen Mindestmaß liegt, dann sehe ich eine deutliche Warnung mit dem Wert, der fehlt.
- Gegeben kein Sofa eingegeben, dann sehe ich einen Satz und einen Link zur Eingabe.
- Gegeben ein Handy mit 375 px Breite, dann sind die Ergebnisse lesbar und nichts ragt über den Rand.

**Fertig, wenn:** Ich gebe einen engen Raum mit großem Sofa ein und sehe eine Laufweg-Warnung; mit einem großen Raum bleibt sie aus.

## Issue 5: Passt-Check für vorhandene oder geplante Möbel ⬜ offen

**Ziel:** Eine Innenarchitektin gibt ein, was der Kunde schon hat oder kaufen will (zum Beispiel einen Teppich oder eine Stange), und sieht sofort, ob es passt, damit teure Fehlkäufe vor dem Kauf auffallen.

**Nicht im Umfang:** Alternativvorschläge von Produkten, Preise, Einkauf, Foto-Erkennung.

**Akzeptanzkriterien:**
- Gegeben ein Raum und ein Sofa, wenn ich ein vorhandenes Maß (zum Beispiel Teppich 160 × 230 cm) eingebe, dann sehe ich eine Bewertung mit den Stufen „passt“, „grenzwertig“, „zu klein“ oder „zu groß“.
- Gegeben eine Bewertung, dann ist sie mit Text (nicht nur mit Farbe) gekennzeichnet und nennt Regel und Quelle wie in Issue 2–4.
- Gegeben ein leeres, negatives oder nicht numerisches Feld, wenn ich prüfe, dann sehe ich eine Fehlermeldung am Feld und keine Bewertung.
- Gegeben noch kein Raum eingegeben, dann sehe ich einen Satz und einen Link zur Eingabe.

**Fertig, wenn:** Ich gebe zu einem Sofa einen deutlich zu kleinen und einen passenden Teppich ein und bekomme zwei verschiedene Bewertungen mit Begründung.

## Issue 6: Sofa-Tiefe und Verhältnis bei der Teppichempfehlung 🔧 in Arbeit

**Ziel:** Eine Innenarchitektin gibt die Tiefe des Sofas an und sieht zur Teppichgröße das Verhältnis Teppich zu Sofa, damit die Empfehlung die vorderen Sofafüße berücksichtigt und die Proportion für den Kunden greifbar wird.

**Nicht im Umfang:** Tiefe für andere Möbel, Teppichform (rund, oval), Verhältnis zu anderen Möbeln.

**Akzeptanzkriterien:**
- Gegeben die Art „Sofa“, wenn ich ein Möbelstück hinzufüge, dann gibt es ein Feld „Tiefe“ in Zentimetern mit derselben Fehlerprüfung wie die anderen Felder.
- Gegeben ein Sofa mit Tiefe, dann zeigt die Liste die Tiefe und die Empfehlung nennt Mindestbreite und Mindesttiefe des Teppichs.
- Gegeben eine Empfehlung, dann steht darunter das Verhältnis „Der Teppich ist x-mal so breit wie das Sofa“.

**Fertig, wenn:** Ich gebe ein Sofa mit 200 cm Breite und 95 cm Tiefe ein und sehe 230 × 160 cm mit dem Verhältnis 1,15.

## Issue 7: Eingaben beim Neuladen behalten 🔧 in Arbeit

**Ziel:** Eine Innenarchitektin verliert beim Neuladen der Seite ihre Eingaben nicht, damit sie vor Ort nicht von vorn anfangen muss.

**Nicht im Umfang:** Konten, Synchronisation zwischen Geräten, mehrere Räume oder Projekte (Datenbank).

**Akzeptanzkriterien:**
- Gegeben ein eingegebener Raum und Möbel, wenn ich die Seite neu lade, dann sind Raum und Möbelliste noch da.
- Gegeben ein entferntes Möbelstück, wenn ich die Seite neu lade, dann bleibt es entfernt.
- Gegeben eingegebene Daten, wenn ich „Neu beginnen“ antippe und die Rückfrage bestätige, dann sind Raum, Möbelliste und Formularfelder leer, auch nach dem Neuladen.
- Gegeben die Rückfrage, wenn ich abbreche, dann bleibt alles erhalten.

**Fertig, wenn:** Ich gebe Raum und Sofa ein, lade die Seite neu und sehe Zusammenfassung, Liste und Empfehlung wie vorher.

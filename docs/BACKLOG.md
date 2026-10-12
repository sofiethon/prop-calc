# Backlog — prop-calc

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

## Issue 3: Vorhangstange und Bildhöhe ✅ fertig

**Ziel:** Eine Innenarchitektin bekommt aus Fenster und Sofa die Breite und Höhe der Vorhangstange sowie Größe und Hängehöhe eines Bildes über dem Sofa, damit zwei oft geschätzte Maße belegt sind.

**Nicht im Umfang:** Auswahl von Vorhängen oder Bildern, Beleuchtung, Hängung ganzer Bilderwände.

**Akzeptanzkriterien:**
- Gegeben ein Fenster mit Breite und Höhe, wenn ich die Vorhangempfehlung öffne, dann sehe ich Stangenbreite und Stangenhöhe in Zentimetern, mit Regel und Quelle.
- Gegeben ein Sofa und eine Deckenhöhe, wenn ich die Bildempfehlung öffne, dann sehe ich Bildbreite und Hängehöhe in Zentimetern, mit Regel und Quelle.
- Gegeben ein Fenster, das höher ist als die Deckenhöhe erlaubt, wenn ich weitermache, dann sehe ich einen Hinweis statt einer Zahl.
- Gegeben kein Fenster oder kein Sofa, dann sehe ich für den betroffenen Teil einen Satz und einen Link zur Eingabe, der andere Teil funktioniert weiter.

**Fertig, wenn:** Ich gebe Fenster und Sofa ein und sehe beide Empfehlungen mit Regel und Quelle; ein zu hohes Fenster erzeugt einen Hinweis.

## Issue 4: Sitzabstände und Laufwege ✅ fertig

**Ziel:** Eine Innenarchitektin bekommt Abstände zwischen Sofa und Couchtisch, Sofa und Fernseher sowie die freien Laufwege im Raum, damit der Raum gut aussieht und trotzdem bequem begehbar bleibt.

**Nicht im Umfang:** Automatisches Anordnen der Möbel, Grundriss-Zeichnung, Barrierefreiheits-Nachweis.

**Akzeptanzkriterien:**
- Gegeben ein Raum und ein Sofa, wenn ich die Abstände öffne, dann sehe ich pro Abstand einen Wert oder Wertebereich in Zentimetern, mit Regel und Quelle.
- Gegeben die eingegebenen Möbel, wenn der Platz für den Laufweg unter dem empfohlenen Mindestmaß liegt, dann sehe ich eine deutliche Warnung mit dem Wert, der fehlt.
- Gegeben kein Sofa eingegeben, dann sehe ich einen Satz und einen Link zur Eingabe.
- Gegeben ein Handy mit 375 px Breite, dann sind die Ergebnisse lesbar und nichts ragt über den Rand.

**Fertig, wenn:** Ich gebe einen engen Raum mit großem Sofa ein und sehe eine Laufweg-Warnung; mit einem großen Raum bleibt sie aus.

## Issue 5: Passt-Check für vorhandene oder geplante Möbel ✅ fertig

**Ziel:** Eine Innenarchitektin gibt ein, was der Kunde schon hat oder kaufen will (zum Beispiel einen Teppich oder eine Stange), und sieht sofort, ob es passt, damit teure Fehlkäufe vor dem Kauf auffallen.

**Nicht im Umfang:** Alternativvorschläge von Produkten, Preise, Einkauf, Foto-Erkennung.

**Akzeptanzkriterien:**
- Gegeben ein Raum und ein Sofa, wenn ich ein vorhandenes Maß (zum Beispiel Teppich 160 × 230 cm) eingebe, dann sehe ich eine Bewertung mit den Stufen „passt“, „grenzwertig“, „zu klein“ oder „zu groß“.
- Gegeben eine Bewertung, dann ist sie mit Text (nicht nur mit Farbe) gekennzeichnet und nennt Regel und Quelle wie in Issue 2–4.
- Gegeben ein leeres, negatives oder nicht numerisches Feld, wenn ich prüfe, dann sehe ich eine Fehlermeldung am Feld und keine Bewertung.
- Gegeben noch kein Raum eingegeben, dann sehe ich einen Satz und einen Link zur Eingabe.

**Fertig, wenn:** Ich gebe zu einem Sofa einen deutlich zu kleinen und einen passenden Teppich ein und bekomme zwei verschiedene Bewertungen mit Begründung.

## Issue 6: Sofa-Tiefe und Verhältnis bei der Teppichempfehlung ✅ fertig

**Ziel:** Eine Innenarchitektin gibt die Tiefe des Sofas an und sieht zur Teppichgröße das Verhältnis Teppich zu Sofa, damit die Empfehlung die vorderen Sofafüße berücksichtigt und die Proportion für den Kunden greifbar wird.

**Nicht im Umfang:** Tiefe für andere Möbel, Teppichform (rund, oval), Verhältnis zu anderen Möbeln.

**Akzeptanzkriterien:**
- Gegeben die Art „Sofa“, wenn ich ein Möbelstück hinzufüge, dann gibt es ein Feld „Tiefe“ in Zentimetern mit derselben Fehlerprüfung wie die anderen Felder.
- Gegeben ein Sofa mit Tiefe, dann zeigt die Liste die Tiefe und die Empfehlung nennt Mindestbreite und Mindesttiefe des Teppichs.
- Gegeben eine Empfehlung, dann steht darunter das Verhältnis „Der Teppich ist x-mal so breit wie das Sofa“.

**Fertig, wenn:** Ich gebe ein Sofa mit 200 cm Breite und 95 cm Tiefe ein und sehe 230 × 160 cm mit dem Verhältnis 1,15.

## Issue 7: Eingaben beim Neuladen behalten ✅ fertig

**Ziel:** Eine Innenarchitektin verliert beim Neuladen der Seite ihre Eingaben nicht, damit sie vor Ort nicht von vorn anfangen muss.

**Nicht im Umfang:** Konten, Synchronisation zwischen Geräten, mehrere Räume oder Projekte (Datenbank).

**Akzeptanzkriterien:**
- Gegeben ein eingegebener Raum und Möbel, wenn ich die Seite neu lade, dann sind Raum und Möbelliste noch da.
- Gegeben ein entferntes Möbelstück, wenn ich die Seite neu lade, dann bleibt es entfernt.
- Gegeben eingegebene Daten, wenn ich „Neu beginnen“ antippe und die Rückfrage bestätige, dann sind Raum, Möbelliste und Formularfelder leer, auch nach dem Neuladen.
- Gegeben die Rückfrage, wenn ich abbreche, dann bleibt alles erhalten.

**Fertig, wenn:** Ich gebe Raum und Sofa ein, lade die Seite neu und sehe Zusammenfassung, Liste und Empfehlung wie vorher.

## Issue 8: Esstisch und Leuchte ✅ fertig

**Ziel:** Eine Innenarchitektin gibt einen Esstisch (rechteckig oder rund) ein und bekommt Platz für Personen, nötigen Freiraum um den Tisch sowie Durchmesser und Hängehöhe der Leuchte darüber, damit Esstisch und Leuchte wie Teppich und Vorhang mit Regel und Quelle belegt sind.

**Nicht im Umfang:** Auswahl von Leuchten, Tischen oder Stühlen, Stuhlmaße, ovale Tische, mehrere Leuchten über einem langen Tisch, Position des Tisches im Raum.

**Akzeptanzkriterien:**
- Gegeben die Art „Esstisch“, wenn ich ein Möbelstück hinzufüge, dann wähle ich die Form „rechteckig“ oder „rund“ und sehe passende Felder (Breite und Tiefe bzw. Durchmesser, dazu Höhe) mit derselben Fehlerprüfung wie die anderen Felder.
- Gegeben ein Esstisch, wenn ich die Empfehlung öffne, dann sehe ich den Platz für Personen als Bereich, den Durchmesser der Leuchte (Hälfte bis zwei Drittel der Tischbreite) und die Hängehöhe der Unterkante über der Tischplatte, jeweils mit Regel und Quelle.
- Gegeben ein Esstisch und ein Raum, wenn der Freiraum je Seite unter 90 cm liegt, dann sehe ich eine deutliche Warnung mit dem Wert, der fehlt.
- Gegeben ein Raum mit Deckenhöhe, wenn die Leuchte nicht mehr unter die Decke passt, dann sehe ich einen Hinweis statt einer Zahl.
- Gegeben kein Esstisch, dann sehe ich einen Satz und einen Link zur Eingabe; ohne Raum fehlen nur die raumabhängigen Teile, mit Satz und Link.
- Gegeben ein Handy mit 375 px Breite, dann sind die Ergebnisse lesbar und nichts ragt über den Rand.

**Fertig, wenn:** Ich gebe einen runden Tisch mit 120 cm Durchmesser in einem engen Raum ein und sehe Personen, Leuchte 60–80 cm und eine Platz-Warnung; in einem großen Raum bleibt die Warnung aus.

## Issue 9: Grundriss – Möbel verschieben und drehen ✅ fertig

**Ziel:** Eine Innenarchitektin sieht den Raum maßstabsgetreu von oben, schiebt Sofa, Couchtisch und Esstisch mit dem Finger an ihren Platz und dreht sie in 90°-Schritten, damit Laufweg und Freiraum mit der echten Lage gerechnet werden statt mit Annahmen.

**Nicht im Umfang:** Fenster und Türen im Grundriss (Issue 10), Drehen in beliebigen Winkeln, 3D-Ansicht, automatisches Anordnen, Warnung bei überlappenden Möbeln, Teppich, Bild und Leuchte im Grundriss, mehrere Varianten speichern.

**Akzeptanzkriterien:**
- Gegeben ein Raum mit mindestens einem Möbelstück, wenn ich den Grundriss öffne, dann sehe ich den Raum von oben im Maßstab mit beschrifteter Länge und Breite und jedes Möbelstück als Fläche mit seinem Namen (der runde Esstisch als Kreis).
- Gegeben ein Möbelstück im Grundriss, wenn ich es mit dem Finger verschiebe, dann bleibt es an der neuen Stelle, auch nach dem Neuladen der Seite; wenn ich es über die Raumwand hinausziehe, dann bleibt es innerhalb des Raums.
- Gegeben ein Möbelstück, wenn ich „Drehen“ antippe, dann dreht es sich um 90° und Breite und Tiefe sind im Grundriss und in den Rechnungen vertauscht.
- Gegeben Sofa und Couchtisch mit verschobener Lage, wenn der Abstand oder der Laufweg unter dem Richtwert liegt, dann sehe ich die Warnung mit dem fehlenden Wert und dem Hinweis „aus der Lage im Grundriss gerechnet“; wurde ein Möbelstück nie verschoben, steht dort weiter der Hinweis auf die Annahme.
- Gegeben ein Handy mit 375 px Breite, dann passt der Grundriss in die Breite, nichts ragt über den Rand, und „Drehen“ ist mindestens 44 px hoch.

**Fertig, wenn:** Ich gebe einen Raum 500 × 400 cm, Sofa und Couchtisch ein, öffne den Grundriss, schiebe den Tisch nah ans Sofa und sehe die Abstandswarnung; ich drehe das Sofa und sehe Breite und Tiefe vertauscht.

## Issue 10: Fenster an eine Wand setzen 🔧 in Arbeit

**Ziel:** Eine Innenarchitektin ordnet jedem Fenster eine Wand und eine Lage darauf zu, damit die Fenster im Grundriss stehen und die Vorhangstange mit der echten Wand gerechnet wird statt mit der Annahme.

**Nicht im Umfang:** Türen und Türaufschlag, Fensterunterkante (Höhe über dem Boden), Heizkörper, Fenster in Ecken oder schräg, Erker und Gauben.

**Akzeptanzkriterien:**
- Gegeben ein Fenster, wenn ich ihm eine Wand (oben, unten, links, rechts) und einen Abstand von der Ecke in Zentimetern gebe, dann erscheint es im Grundriss auf dieser Wand in seiner Breite.
- Gegeben ein Fenster, wenn es mit diesem Abstand breiter ist als die Wand oder über ihr Ende hinausragt, dann sehe ich eine Fehlermeldung am Feld und es wird nichts übernommen.
- Gegeben ein Fenster mit Wand, wenn der Abstand zur Ecke kleiner ist als der Überstand der Vorhangstange (10 cm je Seite), dann sehe ich in der Vorhangempfehlung einen Hinweis, dass die Stange dort nicht ganz Platz hat.
- Gegeben ein Fenster ohne Wand (zum Beispiel aus früheren Eingaben), dann bleibt es in der Liste und in der Vorhangempfehlung wie bisher, und im Grundriss steht der Hinweis „Wand fehlt“.
- Gegeben ein Fenster mit Wand, wenn ich die Seite neu lade, dann sind Wand und Abstand noch da.

**Fertig, wenn:** Ich setze ein Fenster mit 120 cm Breite auf die obere Wand, sehe es im Grundriss an der richtigen Stelle; mit einem Abstand, der über die Wand hinausragt, bekomme ich eine Fehlermeldung.

## Issue 13: Startseite mit Hero, Menü und Anmeldung ✅ fertig

**Ziel:** Besucher*innen sehen beim Öffnen eine ruhige Startseite „SoTho Interiors“ mit Menü rechts und können sich anmelden, damit der Rechner nur für Angemeldete unter „Get creative“ erreichbar ist.

**Nicht im Umfang:** Echte Inhalte für Über uns, Portfolio, Buchungen und Kontakt (zunächst Platzhaltertexte), Buchungsformular mit Versand, Passwort zurücksetzen, Profilseite, Konten-Verwaltung, eigene Tabellen in der Datenbank.

**Akzeptanzkriterien:**
- Gegeben die Startseite, dann sehe ich „SoTho Interiors“ als Hero auf hellem Grund und rechts oben ein Dropdown mit Über uns, Portfolio, Buchungen, Kontakt und Anmelden.
- Gegeben das Dropdown, wenn ich Über uns, Portfolio, Buchungen oder Kontakt antippe, dann springt die Startseite zum jeweiligen Abschnitt mit Platzhaltertext unter dem Hero; mit Escape oder einem Tipp daneben schließt das Dropdown.
- Gegeben die Login-Seite, wenn ich mich mit E-Mail und Passwort registriere oder anmelde, dann bin ich angemeldet und sehe im Dropdown „Get creative“ und „Abmelden“.
- Gegeben ich bin nicht angemeldet, wenn ich die Seite des Rechners direkt aufrufe, dann lande ich auf der Login-Seite; „Get creative“ erscheint nicht im Dropdown.
- Gegeben ein leeres oder ungültiges Feld oder falsche Zugangsdaten, dann sehe ich einen verständlichen Satz am Formular.
- Gegeben ein Handy mit 375 px Breite, dann bleibt der Header einzeilig, das Dropdown ragt nicht über den Rand und alle Ziele sind mindestens 44 px hoch.

**Fertig, wenn:** Ich öffne die Startseite, sehe den Hero, melde mich an und komme über „Get creative“ zum Rechner; abgemeldet führt der Weg zum Rechner zum Login.

**Nachtrag 2026-10-12:** Die Oberfläche ist komplett englisch (Menü: About, Portfolio, Bookings, Contact, Sign in, Sign out); der Abschnitt About hat den echten Text. Die Kriterien oben gelten sinngemäß mit den englischen Bezeichnungen.

## Issue 11: Schlafzimmer – Bett und Platz drumherum ⬜ offen

**Ziel:** Eine Innenarchitektin gibt ein Bett ein und bekommt Freiraum um das Bett und die Höhe des Nachttischs mit Regel und Quelle, damit die App auch im Schlafzimmer belegte Maße liefert.

**Nicht im Umfang:** Kleiderschrank, Matratzen- oder Bettauswahl, Lattenrost, Nachttisch als eigenes Möbelstück im Grundriss.

**Akzeptanzkriterien:**
- Gegeben die Art „Bett“, wenn ich ein Möbelstück hinzufüge, dann gibt es Felder für Breite, Länge und Höhe der Matratzenoberkante mit derselben Fehlerprüfung wie die anderen Felder.
- Gegeben ein Bett, wenn ich die Empfehlung öffne, dann sehe ich den Freiraum seitlich und am Fußende sowie die Höhe des Nachttischs als Wert oder Bereich in Zentimetern, jeweils mit Regel und benannter Quelle.
- Gegeben ein Bett und ein Raum, wenn der Freiraum unter dem Mindestmaß liegt, dann sehe ich eine deutliche Warnung mit dem Wert, der fehlt.
- Gegeben ein Bett, dann erscheint es im Grundriss und lässt sich wie die anderen Möbel verschieben und drehen.
- Gegeben kein Bett, dann sehe ich einen Satz und einen Link zur Eingabe; ohne Raum fehlen nur die raumabhängigen Teile, mit Satz und Link. Auf einem Handy mit 375 px Breite ragt nichts über den Rand.

**Fertig, wenn:** Ich gebe ein Bett 160 × 200 cm in einem engen und in einem großen Schlafzimmer ein und sehe Freiraum und Nachttischhöhe mit Quelle; im engen Raum erscheint die Platz-Warnung, im großen nicht.

## Issue 12: Kunden-Karte zum Teilen ⬜ offen

**Ziel:** Eine Innenarchitektin öffnet eine Seite mit Raummaßen, Grundriss, allen Empfehlungen, Regeln und Quellen und gibt sie dem Kunden als Link oder Ausdruck mit, damit die Begründung nach dem Termin beim Kunden bleibt.

**Nicht im Umfang:** Konten und Anmeldung, Kundenverwaltung, Speichern auf einem Server oder in der Datenbank, eigenes Logo oder Layout des Büros, Kommentare oder Unterschrift auf der Karte, Preise.

**Akzeptanzkriterien:**
- Gegeben ein Raum und mindestens ein Möbelstück, wenn ich „Kunden-Karte“ öffne, dann sehe ich eine eigene Seite mit Raummaßen, Grundriss und allen Empfehlungen, jeweils mit Regel und Quelle.
- Gegeben die Karte, wenn eine Regel eine Annahme von prop-calc ist (keine Norm), dann ist das auf der Karte mit Text als Annahme gekennzeichnet.
- Gegeben die Karte, wenn ich „Link kopieren“ antippe und den Link in einem privaten Fenster öffne, dann sehe ich dieselbe Karte ohne Eingabefelder und ohne Möglichkeit, etwas zu ändern.
- Gegeben die Karte, wenn ich „Drucken“ antippe, dann zeigt die Druckansicht die Karte ohne Knöpfe und ohne Navigation.
- Gegeben noch kein Raum, dann sehe ich einen Satz und einen Link zur Eingabe statt einer leeren Karte.

**Fertig, wenn:** Ich gebe Raum, Sofa und Fenster ein, öffne die Kunden-Karte, kopiere den Link, öffne ihn in einem privaten Fenster und sehe dieselbe Karte mit Grundriss, Regeln und Quellen.

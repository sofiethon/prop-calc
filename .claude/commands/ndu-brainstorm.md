---
description: Funktionen mit Claude durchdenken – Claude schlägt vor, auch Unerwartetes, du entscheidest; danach MVP im Brief und Issues im Backlog
---

Wir sammeln die Funktionen für unser Produkt. Grundlage ist `docs/PRODUKT.md`. Fehlt die Datei: Sag, dass zuerst `/ndu-idee` dran ist, und hör auf.

**Ändere keine Datei, bevor ich in Schritt 4 ausdrücklich zugestimmt habe.** Lesen ist erlaubt.

1. **Verstehen.** Lies `docs/PRODUKT.md` und `docs/BACKLOG.md`. Fass in 2–3 Sätzen zusammen, für wen das Produkt ist und welches Problem es löst.
2. **Ideen, Runde für Runde.** Schlag pro Nachricht 3–5 Funktionen vor, jede in einem Satz mit ihrem Nutzen für die Person aus dem Brief. Mische Naheliegendes mit Ideen, auf die wir selbst wahrscheinlich nicht kommen: aus ähnlichen Produkten, aus anderen Bereichen, aus dem Alltag der Zielgruppe. Frag zu jeder: **MVP, Später oder Nein?** Frag nach, wenn eine Antwort unklar ist. Rüttelt eine Idee an einer Annahme im Brief (Zielgruppe, „macht NICHT“), sag es offen. Nach 2–3 Runden fragst du, ob wir weitermachen oder abschließen.
3. **Schneiden.** Zeig die Liste in drei Teilen: MVP, Später, Nein. Gibt es noch keinen Backlog zu diesem Produkt: Das MVP ist höchstens 5 Funktionen groß – gerade so viel, dass eine echte Person das Produkt einmal sinnvoll benutzen kann; ist es größer, schlag vor, was auf Später wandert. Gibt es schon einen Backlog zu diesem Produkt, ist er gesetzt: Neue Ideen kommen als Ergänzung (höchstens 2–3) oder auf Später. Frag, ob das so stimmt.
4. **Erst nach meinem Okay schreiben:**
   - `docs/PRODUKT.md`: Abschnitt 5 mit den MVP-Funktionen als Stichworte, darunter „Später:“ mit den übrigen Ideen – Einträge, die dort schon stehen, bleiben. Stand-Zeile aktualisieren.
   - `docs/BACKLOG.md`: pro **neuer** MVP-Funktion ein Issue im Format der Datei (Funktionen mit Issue bekommen kein zweites): **Ziel** (was danach möglich ist, für wen und warum – „damit …“), **Nicht im Umfang**, **Akzeptanzkriterien** (3–5, „Gegeben … wenn … dann …“, mindestens ein Negativfall), **Fertig, wenn** (woran man es im Browser prüft); Status ⬜ offen. Issue 1 ist der kleinste Schritt, den man im Browser sehen kann. Jedes Kriterium muss im Browser prüfbar sein. Keine Satzform „Als … möchte ich …“.
   - Steht im Backlog schon etwas **zu diesem Produkt**: Bestehende Issues änderst, verschiebst oder streichst du nicht – nur, wenn ich es ausdrücklich verlange. Neue Issues hängst du nach Okay hinten an. Im MVP-Abschnitt des Briefs stehen dann die bestehenden Issues als Stichworte (falls er noch leer ist) plus die neuen Funktionen – ersetzt wird nichts.
   - Stehen dort Issues **zu einem anderen Produkt** (z. B. Leihbar in einem neuen Repo): vorher fragen, ob sie ersetzt werden sollen. Wenn nicht: die neuen Issues **oben** unter einer eigenen Überschrift einfügen, mit eigenem Kürzel (z. B. S1, S2 … für „Schichtplan“), damit sie sich nicht mit den alten verwechseln lassen.
5. **Abschluss.** Sag in einem Satz, welches Issue als Erstes dran ist und mit welchem Satz ich es starte – mit der Nummer, die jetzt tatsächlich im Backlog steht (z. B. „Setze Issue 1 aus docs/BACKLOG.md um“). Bitte mich, die Akzeptanzkriterien der neuen Issues zu lesen und zu sagen, was ich ändern, streichen oder ergänzen will – in meinen Worten, du formulierst es um. Erst wenn sie passen, gebe ich selbst `/ndu-commit` ein. Führ `/ndu-commit` nicht selbst aus.

Sprache: Deutsch, einfache Worte, keine Fachbegriffe ohne kurze Erklärung.

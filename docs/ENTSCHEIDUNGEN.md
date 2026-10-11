# Entscheidungen

> Hier hält Claude fest, was im Projekt festgelegt wurde, damit es in späteren Sessions noch gilt.
> Format: Datum — Entscheidung — Grund

- 2026-10-08 — Stack: Next.js + Tailwind + Supabase + Vercel — Kursvorgabe
- 2026-10-08 — Sprache der Oberfläche: Deutsch — Zielgruppe NDU-Studierende
- 2026-10-11 — Produktname Proportio — aus dem Produkt-Brief
- 2026-10-11 — Zielgruppe zuerst: Innenarchitekt*innen (Privatpersonen später); Grundriss/3D nicht ausgeschlossen — aus dem Produkt-Brief
- 2026-10-11 — Eingaben werden im Browser des Geräts gemerkt (localStorage), noch nicht in Supabase — Schnelle Lösung für Issue 7; Konten und Projekte kommen später
- 2026-10-11 — Teppichregel: 15 cm Überstand je Seite (Houzz, Designprinzip); 20 cm Wandabstand und 40 cm Vorsprung vor dem Sofa sind Annahmen von prop-calc, keine Norm — Quelle für diese beiden Werte noch offen
- 2026-10-11 — Vorhang: Stange 10 cm über dem Fensterrahmen, 10 cm Überstand je Seite (Quellen nennen 4–6 Zoll bzw. 3–6 Zoll, wir nehmen feste Werte; TaskRabbit, Designprinzip). Die Höhe über dem Boden ist unbekannt, weil die Fensterunterkante nicht erfasst wird; die Deckenprüfung nimmt vorsichtig ein Fenster ab Boden an — Annahme von prop-calc
- 2026-10-11 — Bild: Breite zwei Drittel bis drei Viertel der Sofabreite, Unterkante 20 cm (8 Zoll) über der Sofalehne; Sofahöhe gilt als Lehnenhöhe (Fine Art America, Designprinzip; 20 cm ist unsere Wahl aus der Spanne 6–10 Zoll)
- 2026-10-11 — Abstände: Sofa–Couchtisch 16–18 Zoll (41–46 cm), Sofa–Fernseher 2,75 × Fernsehbreite, Weg durch den Raum mindestens 36 Zoll (91 cm) (Houzz, Designprinzip). Der Laufweg ist eine Annahme von prop-calc: Sofa steht an der langen Wand, gerechnet wird mit der kurzen Raumseite minus Sofatiefe, Tischabstand (41 cm) und Couchtischtiefe — Positionen der Möbel werden nicht erfasst
- 2026-10-11 — Auch der Couchtisch hat ein Feld „Tiefe“ (erweitert Issue 6, nötig für den Laufweg)
- 2026-10-11 — Passt-Check (Issue 5) prüft Teppich und Vorhangstange. Stufen: „passt“ = im Richtwert; „grenzwertig“ = höchstens 10 cm daneben; „zu klein“/„zu groß“ = mehr als 10 cm daneben. Teppich: Richtwert ist die Teppichempfehlung (Sofabreite + 2 × 15 cm, Tiefe bis 40 cm vor die Füße, 20 cm Wandabstand); „zu groß“ heißt, er passt nicht in den Raum. Stange: Überstand 8–15 cm je Seite (Quellen nennen 3–6 Zoll); die 10 cm Toleranz ist eine Annahme von prop-calc, keine Norm
- 2026-10-11 — Esstisch und Leuchte (Issue 8): Freiraum um den Tisch mindestens 90 cm je Seite, 105–120 cm bei Durchgang hinter den Stühlen (Wakefit, Arcedior, Designprinzip). Leuchte: Unterkante 76–91 cm (30–36 Zoll) über der Tischplatte, bei Decken über 2,40 m etwa 7,5 cm mehr je 30 cm; Durchmesser ½ bis ⅔ der Tischbreite (Raymour & Flanigan, Montreal Lighting, Drew & Jonathan, Mod Lighting). Platz 60–75 cm Tischkante je Person (WoodWeb, PopMaison). Die Regel „Tischbreite minus 30 cm“ gilt nicht (nur eine Quelle). Annahmen von prop-calc: Position des Tisches wird nicht erfasst, gerechnet wird mit der kurzen Raumseite minus dem kleineren Tischmaß; beim rechteckigen Tisch kommt je Kopfende eine Person dazu; Tischhöhe Standard 75 cm. Formen: rechteckig und rund
- 2026-10-11 — Design: SoTho Design System (Ink/Paper/Greige, Superclarendon + Montserrat, 12-Spalten-Raster, 8-px-Abstände, keine Schatten) gilt für die ganze App; Regeln stehen in CLAUDE.md, Tokens in `src/app/globals.css` — Vorgabe der Person
- 2026-10-11 — Superclarendon braucht ein Adobe-Fonts-Web-Projekt; Kit-ID kommt in `NEXT_PUBLIC_ADOBE_FONTS_KIT_ID` (.env.local). Bis dahin Ersatzschrift Georgia — Lizenz liegt bei der Person
- 2026-10-11 — Fehler und Warnungen werden mit Text, Icon und Rahmenwechsel gezeigt, nicht mit Rot (Palette kennt keine Statusfarben); pro Seite nur ein Primärknopf („Raum übernehmen“) — folgt aus dem Design-System
- 2026-10-11 — Produktname jetzt prop-calc (vorher Proportio) — Wunsch der Person; gilt in Oberfläche, Brief, Backlog und Doku
- 2026-10-11 — MVP erweitert (Issues 9–12): Grundriss mit verschiebbaren und um 90° drehbaren Möbeln, Fenster an einer Wand, Schlafzimmer, Kunden-Karte. Sind Positionen gesetzt, rechnen Laufweg und Freiraum damit; sonst gelten die bisherigen Annahmen. Türen, Fernsehgröße aus dem Sitzabstand, Offline und 3D sind „Später“ — Wunsch der Person aus `/ndu-brainstorm`

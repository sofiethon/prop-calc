---
description: Erstellt einen sauberen Commit mit verständlicher Nachricht und pusht
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(git log:*)
---

1. Zeige mit `git status` und `git diff --stat`, was sich geändert hat, und fasse es in 1–2 deutschen Sätzen zusammen.
2. Stelle sicher, dass keine `.env*`-Datei und keine Secrets dabei sind. Falls doch: abbrechen und erklären.
3. Schreibe eine Commit-Nachricht auf Deutsch: erste Zeile max. 60 Zeichen, beschreibt das **Ergebnis für Nutzer*innen** (z. B. „Liste zeigt Preis und Ort“), nicht die Technik. Optional 1–3 Zeilen Details.
4. `git add -A`, `git commit`, `git push`. Ist der aktuelle Branch neu und noch nicht auf GitHub, push mit `git push -u origin <branch>`. Wenn `push` trotzdem fehlschlägt, erkläre in einfachen Worten warum und was zu tun ist (meist: Auf GitHub gibt es neuere Commits – zuerst `git pull`).
5. Sag am Ende: „Gesichert. Du kannst jederzeit zu diesem Stand zurück.“

# Hilfe holen — so bekommst du schnell eine Antwort

Bevor du in Teams schreibst, probiere **eins nach dem anderen** – läuft es wieder, bist du fertig:

1. **Fehlermeldung komplett kopieren** (Browser-Konsole oder Terminal) und Claude geben: „Erkläre mir zuerst in einfachen Worten, was passiert ist. Dann schlag eine Lösung vor.“
2. Neue Session: `/clear`, dann das Problem **kleiner** formulieren.
3. `/ndu-check` ausführen.
4. Gar nichts hilft? **Entweder in Teams fragen** (so wie unten beschrieben) und vorher nichts verwerfen – sonst ist der Fehler weg. **Oder neu ansetzen:** Source Control → „Discard Changes“ verwirft alles seit dem letzten Commit. Das bringt dich nur zurück zu einem funktionierenden Stand, wenn du den kaputten noch nicht committet hast.

## So fragst du in Teams

**Neuer Beitrag im Teams-Kanal 3-Coding**, Betreff beginnt mit **„Hilfe:“**, im Text **genau dieses Format** (kopieren & ausfüllen):

```
🔗 Repo: https://github.com/DEIN-NAME/DEIN-REPO
🎯 Ich wollte: (ein Satz, z. B. „Anfrage-Button einbauen“)
💥 Was passiert ist: (was du siehst — Fehlermeldung als TEXT, kein Screenshot der Meldung)
🔁 Was ich schon probiert habe: (1–3 Punkte)
📍 Wo: (Browser-Konsole / Terminal / Seite XY)
```

**Wichtig:** Alles vorher committen und pushen (`/ndu-commit`), sonst kann ich deinen Stand nicht sehen. Markus muss als Collaborator eingetragen sein (GitHub → Repo → Settings → Collaborators).

Fragen jederzeit in Teams im Kanal 3-Coding, pro Problem ein eigener Beitrag – feste Sprechstunden gibt es nicht.

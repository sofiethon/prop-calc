---
description: Zweitmeinung von Opus in einem eigenen Subagenten – für Planung, Festhängen und vor einem PR
argument-hint: [Frage oder Plan, optional]
---

Hol eine Zweitmeinung von einem stärkeren Modell ein. Die Frage: $ARGUMENTS (wenn leer: die Frage oder der Plan, um den es zuletzt in diesem Gespräch ging).

So gehst du vor:

1. Schreib einen Auftrag für den Berater, der ohne dieses Gespräch verständlich ist: Ziel, was bisher versucht wurde und woran es scheiterte, Fehlermeldungen wörtlich, die betroffenen Dateien mit Pfad. Kurz halten – nur, was er für die Antwort braucht.
2. Starte damit einen Subagenten vom Typ **Plan** mit dem Modell **Opus** (Agent-Werkzeug: `subagent_type: Plan`, `model: opus`) – dieser Typ kann keine Dateien bearbeiten. Er darf lesen und suchen, aber keine Befehle ausführen, die etwas verändern (kein `git stash`, `git restore`, `git checkout`, kein Commit, keine Installation). Verlange von ihm eine Empfehlung mit Begründung, keine Übersicht über alle Möglichkeiten, und höchstens zwei Risiken.
3. Fass die Antwort für mich in höchstens fünf Sätzen zusammen, ohne Fachjargon. Sag, wo der Berater dir widerspricht.
4. Ändere noch nichts. Frag mich, ob wir der Empfehlung folgen.

Nutze nie das Modell Fable oder `best` – das kostet im Pro-Plan extra.

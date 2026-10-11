# Mein Projekt — NDU Coding 2026

Die Vorlage für dein **eigenes Produkt** im Kurs **„Programmieren mit AI“** (MSc Management by Innovation, NDU). Wie die Kursvorlage mit Leihbar, nur ohne das Übungsprodukt: leere Startseite, leerer Backlog. Anleitung: [Neues Projekt starten](https://ndu.datamonkeys.ai/neues-projekt).
Du arbeitest lokal auf deinem Laptop – eingerichtet wie unter [Setup → Lokal](https://ndu.datamonkeys.ai/setup#lokal).
Am Mac holt ein Befehl im Terminal das Repo und öffnet es in VS Code – was er tut, steht in [`setup-mac.sh`](setup-mac.sh):

```
bash -c "$(curl -fsSL https://raw.githubusercontent.com/markesdo/ndu-coding-2026/main/setup-mac.sh)" _ NAME-DEINES-REPOS
```

`NAME-DEINES-REPOS` durch den Namen deines Repos ersetzen – ohne ihn holt das Skript Leihbar.

## In 5 Schritten zur laufenden App

1. **Eigenes Repo anlegen:** oben rechts auf **„Use this template“ → „Create a new repository“**. Name: dein Projektname (kleine Buchstaben, mehrere Wörter mit Bindestrich, z. B. `mensa-board`), Owner: dein GitHub-Account, Public. → „Create repository“.
2. **Repo öffnen:** am Mac mit dem Befehl oben – er installiert auch die Pakete. Unter Windows zuerst [Setup → Lokal von Hand](https://ndu.datamonkeys.ai/setup#lokal-hand) (Git mit Name und E-Mail, Node.js, Claude Code), dann in VS Code *Source Control → Clone Repository → Clone from GitHub* und im Terminal `npm install`.
3. **Claude starten:** im Terminal von VS Code `claude` eintippen. Beim ersten Mal auf diesem Laptop meldest du dich mit deinem Claude-Account (Claude Pro) an.
4. **App starten:** in Claude Code eintippen (ja, auf Deutsch, in ganzen Sätzen):
   > Starte die App und sag mir, wie ich sie im Browser öffne.

   Oder klassisch in einem zweiten Terminal: `npm run dev`, dann die Adresse öffnen, die im Terminal steht (meist `http://localhost:3000`).
5. **Produkt-Brief schreiben:**
   > /ndu-idee

   Claude stellt dir ein paar Fragen zu deiner Idee, schreibt den Produkt-Brief und setzt deinen Produktnamen ein.

## Was ist hier drin?

| Ordner / Datei | Was es ist |
|---|---|
| `src/app/` | Die Seiten der App (eine Mappe = eine URL) |
| `src/components/` | Wiederverwendbare UI-Bausteine |
| `docs/PRODUKT-VORLAGE.md` | Vorlage für deinen Produkt-Brief (eine Seite, lebt mit dem Produkt) |
| `docs/BACKLOG.md` | Issues mit Akzeptanzkriterien – deine Arbeitsliste |
| `docs/HILFE-ANFRAGE.md` | So holst du dir Hilfe in Teams |
| `CLAUDE.md` | Die Spielregeln für Claude in diesem Projekt (lies sie – sie sind auch deine) |
| `.claude/commands/` | Eigene Befehle: `/ndu-idee`, `/ndu-brainstorm`, `/ndu-explain`, `/ndu-check`, `/ndu-commit`, `/ndu-beratung` |
| `.devcontainer/` | Rezept für einen GitHub Codespace – im Kurs nicht mehr nötig (nicht anfassen; wer doch einen startet, stoppt ihn danach unter GitHub → Codespaces) |

## Die wichtigsten Befehle

Diese Befehle sind **nicht in Claude Code eingebaut** – sie gehören zu diesem Kurs-Template (Dateien in `.claude/commands/`), deshalb beginnen sie mit `ndu-`. Eingebaute Befehle wie `/clear`, `/compact` oder `/mcp` haben kein Präfix.

| Befehl | Wann |
|---|---|
| `/ndu-idee` | Du startest ein neues Produkt: kurzes Interview, dann schreibt Claude den Produkt-Brief |
| `/ndu-brainstorm` | Nach dem Brief: Claude schlägt Funktionen vor – auch solche, an die du nicht gedacht hast –, du entscheidest MVP / Später / Nein, dann schreibt Claude den Backlog |
| `/ndu-explain` | Du willst verstehen, was gerade im Projekt passiert |
| `/ndu-check` | Du willst wissen, ob alles läuft und nichts Geheimes im Code steckt |
| `/ndu-commit` | Du hast etwas fertig und willst es sichern (Git = Undo-Knopf) |
| `/ndu-beratung` | Du planst etwas Größeres, Claude dreht sich im Kreis oder du willst vor einem PR eine Zweitmeinung: Ein stärkeres Modell (Opus) schaut in einem eigenen Subagenten drauf |

Claude arbeitet in diesem Projekt mit **Sonnet** – das schont dein Pro-Kontingent. Wie viel davon verbraucht ist, zeigt `/usage`.

## Wenn etwas nicht geht

1. Fehlermeldung komplett kopieren → Claude geben: *„Erkläre mir zuerst in einfachen Worten, was passiert ist.“*
2. `/clear` und das Problem kleiner formulieren.
3. `docs/HILFE-ANFRAGE.md` lesen und in Teams posten.

## Nach dem Arbeiten

Deine Arbeit ist sicher, solange du gepusht hast (`/ndu-commit`).

---
Kurs-Website mit allen Konzepten, Prompts und Checklisten: [ndu.datamonkeys.ai](https://ndu.datamonkeys.ai)

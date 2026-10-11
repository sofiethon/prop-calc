#!/usr/bin/env bash
# Einrichtung auf dem Mac für den Kurs „Programmieren mit AI“ (NDU).
# Starten im Terminal (eine Zeile):
#   bash -c "$(curl -fsSL https://raw.githubusercontent.com/markesdo/ndu-coding-2026/main/setup-mac.sh)"
# Optional mit Repo-Name:  … setup-mac.sh)" _ mein-repo
#
# Was es tut – alles im eigenen Benutzerordner, ohne Mac-Passwort, ohne Homebrew:
#   Apple-Entwicklerwerkzeuge (Git) anstoßen, Node.js, VS Code mit Erweiterungen, Claude Code,
#   GitHub-CLI mit Anmeldung, Git-Name/-E-Mail, Repo klonen, npm install, Claude-Plugins, VS Code öffnen.
# Was schon da ist, wird übersprungen. Das Skript kann man jederzeit nochmal starten.
# Es löscht nichts und überschreibt keine bestehenden Einstellungen.
set -euo pipefail

NODE_VERSION=24.21.0
GH_VERSION=2.102.0
PLUGINS=(frontend-design superpowers vercel playwright linear)
# Für Tests überschreibbar.
APPS_DIR="${NDU_APPS_DIR:-/Applications}"
# Nicht ~/Documents: Das synchronisiert iCloud oft – bei node_modules langsam und fehleranfällig.
REPO_DIR_BASE="${NDU_REPO_DIR:-$HOME/code}"
REPO_NAME="${1:-}"

schritt() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }
ok() { printf '    \033[32m✓\033[0m %s\n' "$*"; }
hinweis() { printf '    \033[33m→\033[0m %s\n' "$*"; }
abbruch() { printf '\n\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }
# Repo-Name aus der Eingabe: nimmt auch eingefügte Adressen an – https://github.com/<login>/<name>(.git)(/tree/…)(?…),
# git@github.com:<login>/<name>.git, <login>/<name>. Leerzeichen im Namen werden wie bei GitHub zu „-“.
# Eine Adresse ohne Repo-Teil (nur das Profil) ergibt nichts – sonst würde das Profil-Repo <login>/<login> geklont.
repo_aus_eingabe() {
  local s
  s=$(printf '%s' "$1" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//; s/[?#].*$//')
  case "$s" in
    *github.com*) s=$(printf '%s' "$s" | sed -E 's#^git@github\.com:##; s#^(https?://)?(www\.)?github\.com/##')
                  case "$s" in */?*) s=${s#*/} ;; *) s= ;; esac ;;
    */?*) s=${s#*/} ;;
  esac
  s=${s%%/*}
  s=${s%.git}
  printf '%s' "$s" | sed -E 's/[[:space:]]+/-/g'
}

[ "$(uname -s)" = Darwin ] || abbruch "Dieses Skript ist nur für macOS."
[ "$(id -u)" -ne 0 ] || abbruch "Bitte ohne sudo starten."
case "$(uname -m)" in
  arm64) NODE_ARCH=arm64; GH_ARCH=arm64
         NODE_SHA=bed7eea5325e1108f32ce5228ddd6a5f0f08a499ee42aa7442aea583702f6057
         GH_SHA=da922c20d1792e5b2cbf375593d7a658acf034c12c84e007e71c76ef959c337e ;;
  x86_64) NODE_ARCH=x64; GH_ARCH=amd64
         NODE_SHA=1462cb3b3046b815cf8ea436d3da450ec1a9f11dac7e5a46b0ada5305d7e8097
         GH_SHA=b245f24eb2bf5f75b426b4c26da3651a107f8d5b6f4fddfbfccc5679041378b3 ;;
  *) abbruch "Unbekannter Prozessor: $(uname -m)" ;;
esac

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
laden() { curl -fsSL --retry 3 -o "$2" "$1"; }
pruefsumme() { echo "$2  $1" | shasum -a 256 -c - >/dev/null || abbruch "Prüfsumme stimmt nicht: $1"; }

# ---------------------------------------------------------------------------
schritt "1/10 Apple-Entwicklerwerkzeuge (enthalten Git)"
if xcode-select -p >/dev/null 2>&1; then
  ok "schon da"
  CLT_GESTARTET=false
else
  xcode-select --install >/dev/null 2>&1 || true
  hinweis "Es öffnet sich ein Fenster von Apple: „Installieren“, dann „Akzeptieren“."
  hinweis "Der Download läuft im Hintergrund weiter – das Skript macht inzwischen den Rest."
  CLT_GESTARTET=true
fi

# ---------------------------------------------------------------------------
schritt "2/10 Pfade einrichten"
mkdir -p "$HOME/.local/bin"
CODE_BIN="$APPS_DIR/Visual Studio Code.app/Contents/Resources/app/bin"
[ -d "$HOME/Applications/Visual Studio Code.app" ] && [ ! -d "$APPS_DIR/Visual Studio Code.app" ] && CODE_BIN="$HOME/Applications/Visual Studio Code.app/Contents/Resources/app/bin"
PFAD_ZEILE="export PATH=\"\$HOME/.local/bin:\$HOME/.local/node/bin:\$HOME/.local/gh/bin:$CODE_BIN:\$PATH\"  # NDU-Kurs"
export PATH="$HOME/.local/bin:$HOME/.local/node/bin:$HOME/.local/gh/bin:$CODE_BIN:$PATH"
PROFILE="$HOME/.zshrc"
case "${SHELL:-}" in */bash) PROFILE="$HOME/.bash_profile" ;; esac
touch "$PROFILE"
if grep -qF '# NDU-Kurs' "$PROFILE"; then
  ok "${PROFILE/#$HOME/~} schon eingerichtet"
else
  printf '\n%s\n' "$PFAD_ZEILE" >> "$PROFILE"
  ok "${PROFILE/#$HOME/~} ergänzt"
fi

# ---------------------------------------------------------------------------
schritt "3/10 Node.js"
node_major=$(node -v 2>/dev/null | sed -E 's/^v([0-9]+).*/\1/' || true)
if [ -n "$node_major" ] && [ "$node_major" -ge 22 ]; then
  ok "schon da ($(node -v))"
else
  datei="node-v$NODE_VERSION-darwin-$NODE_ARCH.tar.gz"
  laden "https://nodejs.org/dist/v$NODE_VERSION/$datei" "$TMP/$datei"
  pruefsumme "$TMP/$datei" "$NODE_SHA"
  mkdir -p "$HOME/.local/node"
  tar -xzf "$TMP/$datei" --strip-components=1 -C "$HOME/.local/node"
  hash -r
  ok "installiert ($(node -v))"
fi

# ---------------------------------------------------------------------------
schritt "4/10 VS Code"
if [ -x "$CODE_BIN/code" ]; then
  ok "schon da"
else
  ziel="$APPS_DIR"
  [ -w "$ziel" ] || { ziel="$HOME/Applications"; mkdir -p "$ziel"; }
  hinweis "wird geladen (ca. 250 MB) …"
  laden "https://update.code.visualstudio.com/latest/darwin-universal/stable" "$TMP/vscode.zip"
  ditto -x -k "$TMP/vscode.zip" "$ziel"
  CODE_BIN="$ziel/Visual Studio Code.app/Contents/Resources/app/bin"
  export PATH="$CODE_BIN:$PATH"
  if [ "$ziel" != "$APPS_DIR" ]; then
    sed -i '' "/# NDU-Kurs\$/s#:$APPS_DIR/Visual Studio Code.app#:$ziel/Visual Studio Code.app#" "$PROFILE"
  fi
  ok "installiert in $ziel"
fi
CODE="$CODE_BIN/code"

# ---------------------------------------------------------------------------
schritt "5/10 Claude Code"
if command -v claude >/dev/null 2>&1; then
  ok "schon da ($(claude --version 2>/dev/null | head -1))"
else
  curl -fsSL https://claude.ai/install.sh | bash >"$TMP/claude.log" 2>&1 || { cat "$TMP/claude.log"; abbruch "Claude Code ließ sich nicht installieren."; }
  hash -r
  ok "installiert ($(claude --version 2>/dev/null | head -1))"
fi

# ---------------------------------------------------------------------------
schritt "6/10 GitHub-CLI"
if command -v gh >/dev/null 2>&1; then
  ok "gh schon da"
else
  datei="gh_${GH_VERSION}_macOS_$GH_ARCH.zip"
  laden "https://github.com/cli/cli/releases/download/v$GH_VERSION/$datei" "$TMP/$datei"
  pruefsumme "$TMP/$datei" "$GH_SHA"
  ditto -x -k "$TMP/$datei" "$TMP/gh"
  mkdir -p "$HOME/.local/gh"
  ditto "$TMP/gh/gh_${GH_VERSION}_macOS_$GH_ARCH" "$HOME/.local/gh"
  hash -r
  ok "gh installiert"
fi
# ---------------------------------------------------------------------------
schritt "7/10 Warten auf die Apple-Entwicklerwerkzeuge, dann GitHub-Anmeldung"
if xcode-select -p >/dev/null 2>&1; then
  ok "fertig"
else
  hinweis "Der Download läuft noch (5–15 Minuten). Das Fenster von Apple offen lassen."
  for i in $(seq 1 120); do
    xcode-select -p >/dev/null 2>&1 && break
    [ $((i % 6)) -eq 0 ] && hinweis "… läuft noch ($((i / 6)) min)"
    sleep 10
  done
  xcode-select -p >/dev/null 2>&1 || abbruch "Nach 20 Minuten nicht fertig. Im Terminal „xcode-select --install“ eingeben, warten, dann dieses Skript nochmal starten."
  ok "fertig"
fi
if "$CLT_GESTARTET"; then hinweis "Falls das Apple-Fenster noch offen ist: „Fertig“ klicken."; fi

# Erst jetzt: gh richtet bei der Anmeldung Git ein, und Git gibt es erst mit den Apple-Werkzeugen.
if gh auth status --hostname github.com >/dev/null 2>&1; then
  ok "bei GitHub angemeldet als $(gh api user -q .login)"
else
  hinweis "GitHub-Anmeldung: Fragen mit Enter bestätigen. Der Code liegt schon in der Zwischenablage –"
  hinweis "im Browser mit ⌘V einfügen (sonst abtippen), „Continue“, dann „Authorize github“."
  gh auth login --hostname github.com --git-protocol https --web
fi
LOGIN=$(gh api user -q .login)

# Git über die GitHub-Anmeldung, auch im normalen Terminal.
gh auth setup-git --hostname github.com
# Name und E-Mail wie im Codespace: GitHub-Name und noreply-Adresse, nur wenn noch nicht gesetzt.
aktuell=$(git config --global --get user.name || true)
if [ -z "$aktuell" ] || [ "$aktuell" = GitHub ]; then
  name=$(gh api user -q '.name // empty'); git config --global user.name "${name:-$LOGIN}"
fi
aktuell=$(git config --global --get user.email || true)
if [ -z "$aktuell" ] || [ "$aktuell" = noreply@github.com ]; then
  git config --global user.email "$(gh api user -q .id)+$LOGIN@users.noreply.github.com"
fi
[ -z "$(git config --global --get pull.rebase || true)" ] && git config --global pull.rebase false
ok "Git: $(git config --global user.name) <$(git config --global user.email)>"

# ---------------------------------------------------------------------------
schritt "8/10 Repo holen"
REPO_NAME=$(repo_aus_eingabe "$REPO_NAME")
if [ -z "$REPO_NAME" ]; then
  if gh repo view "$LOGIN/leihbar" >/dev/null 2>&1; then
    REPO_NAME=leihbar
  else
    hinweis "Deine Repos (die letzten 15):"
    gh repo list "$LOGIN" --limit 15 --json name -q '.[].name' | sed 's/^/      /'
    hinweis "Wie heißt deine Kopie der Kursvorlage (Kurs-Website, Setup Schritt 1)? Nur den Namen, ohne $LOGIN/ davor – z. B.: leihbar"
    until [ -n "$REPO_NAME" ] && gh repo view "$LOGIN/$REPO_NAME" >/dev/null 2>&1; do
      [ -n "$REPO_NAME" ] && hinweis "„$REPO_NAME“ nicht gefunden unter github.com/$LOGIN – Namen dort prüfen (oder Internet). Abbrechen mit ctrl C."
      read -r -p "    Name des Kurs-Repos (z. B. leihbar): " eingabe </dev/tty
      REPO_NAME=$(repo_aus_eingabe "$eingabe")
    done
  fi
fi
DIR="$REPO_DIR_BASE/$REPO_NAME"
if [ -d "$DIR/.git" ]; then
  ok "schon da: $DIR"
else
  mkdir -p "$REPO_DIR_BASE"
  gh repo clone "$LOGIN/$REPO_NAME" "$DIR" -- --quiet
  ok "geklont nach $DIR"
fi
cd "$DIR"
hinweis "npm install (1–2 Minuten) …"
npm install --no-fund --no-audit --loglevel=error
ok "Pakete geladen"

# ---------------------------------------------------------------------------
schritt "9/10 VS-Code-Erweiterungen und Claude-Plugins"
if [ -f .vscode/extensions.json ]; then
  node -e 'const j=JSON.parse(require("fs").readFileSync(".vscode/extensions.json","utf8"));console.log((j.recommendations||[]).join("\n"))' |
    while read -r ext; do
      [ -n "$ext" ] || continue
      if "$CODE" --install-extension "$ext" --force >/dev/null 2>&1; then ok "Erweiterung $ext"; else hinweis "Erweiterung $ext nicht installiert – VS Code schlägt sie beim Öffnen vor"; fi
    done
fi
EINST="$HOME/Library/Application Support/Code/User/settings.json"
if [ ! -f "$EINST" ]; then
  mkdir -p "$(dirname "$EINST")"
  cat > "$EINST" <<'JSON'
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.autoSave": "afterDelay",
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.enableSmartCommit": true,
  "workbench.startupEditor": "readme",
  "telemetry.telemetryLevel": "off"
}
JSON
  ok "VS-Code-Einstellungen wie im Codespace"
else
  ok "VS-Code-Einstellungen vorhanden – unverändert"
fi
claude plugin marketplace add anthropics/claude-plugins-official >/dev/null 2>&1 || true
for p in "${PLUGINS[@]}"; do
  if claude plugin install "$p@claude-plugins-official" >/dev/null 2>&1; then ok "Plugin $p"; else hinweis "Plugin $p nicht installiert – später in Claude: /plugin install $p@claude-plugins-official"; fi
done

# ---------------------------------------------------------------------------
schritt "10/10 Prüfen"
ok "git    $(git --version | awk '{print $3}')"
ok "node   $(node -v)"
ok "claude $(claude --version 2>/dev/null | head -1)"
ok "gh     $(gh --version | head -1 | awk '{print $3}')"
"$CODE" "$DIR" >/dev/null 2>&1 &
printf '\n\033[1;32mFertig.\033[0m VS Code öffnet „%s“.\n' "$REPO_NAME"
printf 'Dort: „Yes, I trust the authors“, dann Menü Terminal → New Terminal und \033[1mclaude\033[0m eintippen.\n'
printf 'Neue Terminal-Fenster kennen die Programme automatisch.\n\n'

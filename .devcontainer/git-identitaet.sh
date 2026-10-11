#!/usr/bin/env bash
# Setzt Git-Name und -E-Mail, damit der erste Commit nicht mit
# „Author identity unknown – Please tell me who you are“ scheitert.
# Name und E-Mail werden getrennt geprüft: Gesetzt wird nur, was fehlt oder noch
# auf dem GitHub-Standard (GitHub / noreply@github.com) steht. Eigene Angaben bleiben.
# E-Mail ist die noreply-Adresse des GitHub-Kontos: Commits zählen fürs Profil,
# und GitHub blockiert den Push nicht (GH007, private E-Mail).

name=$(git config --get user.name)
email=$(git config --get user.email)
name_fehlt=false; email_fehlt=false
{ [ -z "$name" ] || [ "$name" = "GitHub" ]; } && name_fehlt=true
{ [ -z "$email" ] || [ "$email" = "noreply@github.com" ]; } && email_fehlt=true
if ! $name_fehlt && ! $email_fehlt; then
  exit 0
fi

login="${GITHUB_USER:-}"
if [ -z "$login" ]; then
  echo "git-identitaet: GITHUB_USER fehlt (kein Codespace?) – Git-Name und -E-Mail bitte selbst setzen."
  exit 0
fi

# Öffentliche Profildaten: Kontonummer für die noreply-Adresse, Anzeigename falls vorhanden.
# Mit Token, sonst teilen sich alle im selben WLAN 60 Anfragen pro Stunde.
auth=()
[ -n "${GITHUB_TOKEN:-}" ] && auth=(-H "Authorization: Bearer $GITHUB_TOKEN")
profil=$(curl -fsS --max-time 10 "${auth[@]}" "https://api.github.com/users/$login" 2>/dev/null)
feld() { printf '%s' "$profil" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const v=JSON.parse(s)[process.argv[1]];if(v!=null)process.stdout.write(String(v))}catch{}})' "$1"; }
id=$(feld id)
anzeige=$(feld name)

if $name_fehlt; then
  git config --global user.name "${anzeige:-$login}"
  echo "git-identitaet: Git-Name „${anzeige:-$login}“"
fi

if $email_fehlt; then
  if [ -n "$id" ]; then
    git config --global user.email "$id+$login@users.noreply.github.com"
    echo "git-identitaet: Git-E-Mail $id+$login@users.noreply.github.com"
  else
    # Ohne Kontonummer zählt die Adresse bei neuen Konten nicht fürs Profil – lieber beim nächsten Start erneut versuchen.
    echo "git-identitaet: GitHub-Profil nicht erreichbar – E-Mail nicht gesetzt, nächster Start versucht es erneut."
  fi
fi

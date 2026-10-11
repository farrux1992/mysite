#!/usr/bin/env bash
# Favicon PNG va havola kartasi rasmini Chrome (headless) bilan yasaydi.
# Ishga tushirish (loyiha papkasidan): bash .claude/og/build.sh
# Edge emas: Windows'da u ishni fonga topshirib, fayl yozilishini kutmaydi.
set -e

cd "$(dirname "$0")/../.."
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
SRC="file:///$(pwd -W)/.claude/og"
OUT="$(pwd -W)/assets"

# Alohida vaqtinchalik profil: ochiq turgan Chrome bilan to'qnashmaydi
PROFILE="$(mktemp -d)"
trap 'rm -rf "$PROFILE" 2>/dev/null || true' EXIT

shot() { # $1 = sahifa, $2 = chiqish fayli, $3 = o'lcham (kenglik,balandlik)
  rm -f "assets/$2"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --user-data-dir="$(cygpath -w "$PROFILE")" \
    --default-background-color=00000000 --virtual-time-budget=8000 \
    --window-size="$3" --screenshot="$OUT/$2" "$SRC/$1" >/dev/null 2>&1
  [ -s "assets/$2" ] && echo "tayyor: assets/$2" || { echo "XATO: assets/$2 yaratilmadi"; exit 1; }
}

shot "icon.html?size=32" "favicon-32.png" "32,32"
shot "icon.html?size=180&square" "apple-touch-icon.png" "180,180"
shot "og.html" "og-image.png" "1200,630"

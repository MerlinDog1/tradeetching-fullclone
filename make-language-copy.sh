#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <lang-code> [source-dir]"
  echo "Example: $0 fr www.tradeetching.com"
  exit 1
fi

LANG_CODE="$1"
SRC_DIR="${2:-www.tradeetching.com}"
DEST_DIR="${LANG_CODE}"

mkdir -p "$DEST_DIR"

find "$SRC_DIR" -maxdepth 1 -type f -name '*.html' | while read -r f; do
  out="$DEST_DIR/$(basename "$f")"
  cp "$f" "$out"
  sed -i "s/<html lang=\"en\"/<html lang=\"${LANG_CODE}\"/g" "$out"
  sed -i "s#</head>#\n  <meta name=\"content-language\" content=\"${LANG_CODE}\">\n</head>#" "$out"
done

echo "Created language scaffold: $DEST_DIR"

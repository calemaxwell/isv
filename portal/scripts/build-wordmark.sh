#!/bin/bash
#
# Lockups, built from ISV's own mark.
#
# isv-mark.png is ISV's artwork and is not generated here — it is the file
# ISV supplied, trimmed to its own bounds. This script only composes it with
# the wordmark and writes the horizontal and stacked lockups the product and
# Storybook use.
#
# When the vector arrives, replace isv-mark.png and re-run.
#
#   bash scripts/build-wordmark.sh
#
# Needs ImageMagick and the URW fonts.
set -e
cd "$(dirname "$0")/.."
OUT="public/brand"

FONT="URWGothic-Book"
MARK="#0071b9"     # --isv-blue, the logo's own colour
DEEP="#2756a0"     # --isv-deep
PAPER="#ffffff"    # --isv-paper
# Type is sized so the two-line block sits inside the mark rather than
# overrunning it. The mark leads; the words are the caption.
PT=105
MARK_H=250

compose () {   # $1 out  $2 text colour  $3 mark file  $4 layout
  local out="$OUT/$1" colour="$2" mark="$3" layout="$4"

  convert "$mark" -resize x$MARK_H "$OUT/_m.png"

  if [ "$layout" = "horizontal" ]; then
    convert -background none -fill "$colour" -font "$FONT" -pointsize $PT \
      label:"Independent Schools Victoria" "$OUT/_t.png"
  else
    convert -background none -fill "$colour" -font "$FONT" -pointsize $PT \
      label:"Independent Schools" "$OUT/_t1.png"
    convert -background none -fill "$colour" -font "$FONT" -pointsize $PT \
      label:"Victoria" "$OUT/_t2.png"
    convert -background none "$OUT/_t1.png" "$OUT/_t2.png" \
      -gravity west -append "$OUT/_t.png"
  fi

  # Mark then type, vertically centred, with a gap sized off the type.
  convert -background none "$OUT/_m.png" \
    \( -size $((PT/3))x1 xc:none \) "$OUT/_t.png" \
    -gravity center +append "$out"

  convert "$out" -trim +repage -bordercolor none \
    -border $((PT/3))x$((PT/4)) "$out"
}

compose isv-horizontal.png          "$MARK"  "$OUT/isv-mark.png"          horizontal
compose isv-stacked.png             "$MARK"  "$OUT/isv-mark.png"          stacked
compose isv-horizontal-reversed.png "$PAPER" "$OUT/isv-mark-reversed.png" horizontal
compose isv-stacked-reversed.png    "$PAPER" "$OUT/isv-mark-reversed.png" stacked

rm -f "$OUT"/_m.png "$OUT"/_t.png "$OUT"/_t1.png "$OUT"/_t2.png
echo "lockups → $OUT"

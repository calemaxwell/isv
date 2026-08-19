#!/bin/bash
#
# Wordmark lockups.
#
# URW Palladio L is a metric clone of Palatino, which is exactly what the
# product's serif stack falls back to after Iowan Old Style. So these match
# what the prototype renders rather than approximating it.
#
# Writes into public/brand, which both the app and Storybook serve at /brand,
# so there is one copy of the brand rather than two drifting apart.
#
#   bash scripts/build-wordmark.sh
#
# Needs ImageMagick and the URW fonts.
set -e
cd "$(dirname "$0")/.."
OUT="public/brand"
mkdir -p "$OUT"

FONT="URW-Palladio-L-Roman"
INK="#161a22"      # --isv-ink
NAVY="#16294a"     # --isv-navy
PAPER="#fbfaf8"    # --isv-paper
PT=180             # large, so it scales down cleanly

render () {   # $1 out  $2 colour-first  $3 colour-second  $4 layout
  local out="$OUT/$1" c1="$2" c2="$3" layout="$4"

  convert -background none -fill "$c1" -font "$FONT" -pointsize $PT \
    label:"Independent Schools" "$OUT/_a.png"
  convert -background none -fill "$c2" -font "$FONT" -pointsize $PT \
    label:"Victoria" "$OUT/_b.png"

  if [ "$layout" = "horizontal" ]; then
    # One line. A word space between the two colours, sized off the point
    # size rather than guessed.
    convert -background none "$OUT/_a.png" \
      \( -size $((PT/4))x1 xc:none \) "$OUT/_b.png" \
      +append "$out"
  else
    # Stacked, left aligned. Centring a two-word-over-one-word lockup
    # leaves the second line floating.
    convert -background none "$OUT/_a.png" "$OUT/_b.png" \
      -gravity west -append "$out"
  fi

  # Trim to the glyphs, then give it clear space proportional to the type.
  # A mark with no breathing room gets crushed against whatever sits next
  # to it.
  convert "$out" -trim +repage -bordercolor none -border $((PT/3))x$((PT/4)) "$out"
}

render isv-horizontal.png          "$INK"   "$NAVY"  horizontal
render isv-stacked.png             "$INK"   "$NAVY"  stacked
render isv-horizontal-reversed.png "$PAPER" "$PAPER" horizontal
render isv-stacked-reversed.png    "$PAPER" "$PAPER" stacked

rm -f "$OUT/_a.png" "$OUT/_b.png"
echo "wordmarks → $OUT"

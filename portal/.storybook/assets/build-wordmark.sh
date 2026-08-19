#!/bin/bash
# Wordmark lockups.
#
# URW Palladio L is a metric clone of Palatino, which is exactly what the
# product's serif stack falls back to after Iowan Old Style. So these match
# what the prototype renders rather than approximating it.
set -e

FONT="URW-Palladio-L-Roman"
INK="#161a22"      # --isv-ink
NAVY="#16294a"     # --isv-navy
PAPER="#fbfaf8"    # --isv-paper
PT=180             # large, so it scales down cleanly

render_pair () {   # $1 out  $2 colour-first  $3 colour-second  $4 layout
  local out="$1" c1="$2" c2="$3" layout="$4"

  convert -background none -fill "$c1" -font "$FONT" -pointsize $PT \
    label:"Independent Schools" /tmp/brand/_a.png
  convert -background none -fill "$c2" -font "$FONT" -pointsize $PT \
    label:"Victoria" /tmp/brand/_b.png

  if [ "$layout" = "horizontal" ]; then
    # One line. A word space between the two colours, matched to the
    # point size rather than guessed.
    convert -background none /tmp/brand/_a.png \
      \( -size $((PT/4))x1 xc:none \) /tmp/brand/_b.png \
      +append "$out"
  else
    # Stacked, left aligned. Centring a two-word-over-one-word lockup
    # leaves the second line floating.
    convert -background none /tmp/brand/_a.png /tmp/brand/_b.png \
      -gravity west -append "$out"
  fi

  # Trim to the glyphs, then give it breathing room proportional to the
  # type. A logo with no clear space gets crushed against whatever it
  # sits next to.
  convert "$out" -trim +repage -bordercolor none -border $((PT/3))x$((PT/4)) "$out"
}

render_pair isv-horizontal.png        "$INK"  "$NAVY"  horizontal
render_pair isv-stacked.png           "$INK"  "$NAVY"  stacked
render_pair isv-horizontal-reversed.png "$PAPER" "$PAPER" horizontal
render_pair isv-stacked-reversed.png    "$PAPER" "$PAPER" stacked

rm -f _a.png _b.png

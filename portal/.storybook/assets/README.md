# Brand assets

Wordmark lockups for the ISV prototype.

| File | Use |
|---|---|
| `isv-horizontal.png` | One line. Headers, Storybook chrome, anywhere wide and short. |
| `isv-stacked.png` | Two lines, left aligned. Narrow columns, footers, square spaces. |
| `isv-horizontal-reversed.png` | The same, in paper white, for navy and other dark grounds. |
| `isv-stacked-reversed.png` | As above, stacked. |
| `isv-wordmark.svg` | Vector. Live text, so it can be recoloured or re-set. |

Transparent background, roughly 2500px on the long edge, so they scale down
cleanly and can sit on any ground.

## What these are, and are not

**Not ISV's logo file.** These are the wordmark treatment used throughout
the prototype — ink for "Independent Schools", navy for "Victoria" — set in
URW Palladio L, a metric clone of Palatino, which is what the product's
serif stack falls back to after Iowan Old Style. So they match what the
prototype renders rather than approximating it.

Before the pitch, get ISV's real logo from whoever holds the brand assets
and replace these. Nothing in the code needs to change: the theme points at
`isv-horizontal.png`, so a like-for-like file swap is enough.

## Regenerating

```
bash .storybook/assets/build-wordmark.sh
```

Needs ImageMagick and the URW fonts. Colours come from the same token values
the product uses, so they cannot drift from the palette.

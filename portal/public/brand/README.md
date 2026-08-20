# Brand assets

## The mark

`isv-mark.png` is **ISV's own artwork**, supplied by ISV and trimmed to its
own bounds. It is not a redraw. `isv-mark-reversed.png` is the same shape in
paper white for navy and other dark grounds.

A PNG rather than an SVG because that is the file we have. When the vector
arrives, replace `isv-mark.png` at this path and re-run the lockup script —
nothing in the code changes.

## Lockups

| File | Use |
|---|---|
| `isv-horizontal.png` | Mark plus one line of type. Wide, short spaces. |
| `isv-stacked.png` | Mark plus two lines. Narrow columns, Storybook, square spaces. |
| `isv-horizontal-reversed.png` | The same in paper white, for dark grounds. |
| `isv-stacked-reversed.png` | As above, stacked. |
| `isv-wordmark.svg` | Type only, as live text, for recolouring or re-setting. |

Transparent background, roughly 2000–2600px on the long edge.

These live in `public/brand` so the app serves them at `/brand/...`, and
Storybook is pointed at the same directory. One copy of the brand rather
than two that drift apart.

## In the product

Everything on screen goes through the `Logo` component in
`src/components/features/app-shell.tsx` — portal header, public header,
public footer, sign-in. It composes the mark with the wordmark set in the
product's own sans at the identity's light weight, so the type in the
lockup and the type on the page are the same face.

`variant="mark"` renders the mark alone, for anywhere the name is already
on screen or the space is tight.

## Regenerating the lockups

```
bash scripts/build-wordmark.sh
```

Composes `isv-mark.png` with the wordmark. Needs ImageMagick and the URW
fonts. Colours come from the same token values the product uses.

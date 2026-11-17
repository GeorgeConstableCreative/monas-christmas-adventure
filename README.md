# Mona's Christmas Adventure

A Christmas browser game for Samantha, starring Mona the cat. Built for iPhone (portrait, touch) and also plays on tablets and desktops.

**Play:** open `index.html` in any browser. It is a single self-contained file.

## What's in it
- **The story** — Dress Mona, the Secret Cat Rave, Welcome Home, the Pantry, the TV Remote (EastEnders vs Catwatch), Bedtime and the Christmas Card.
- **Mona's Arcade** — Paw Pong, Mona-Man, Present Stack, Super Mona Hop, 3am Zoomies, Street Feline and Roomba Rally.

## How it's built
`index.html` is generated. Edit the source, then rebuild:

```
python3 src/build.py
```

- `src/v1src.html` — the base engine (canvas scene, audio, input)
- `src/parts/*.js` — each feature and restyle as its own part; later parts override earlier ones (order is set in `build.py`)
- `src/build.py` — joins the parts, applies small patches and writes `index.html`

## Versions
Each release is a commit tagged with its version (v9.2, v9.3, …).

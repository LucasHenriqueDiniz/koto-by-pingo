# The Pingo mascot image

## How to use the real mascot

Drop the Pingo-sensei image in this directory under exactly this name:

```
public/brand/pingo.png
```

The `PingoMascot` component tries to load `/brand/pingo.png` on its own. When the image is missing
or fails to load, it falls back to the inline SVG placeholder.

## Visual reference

The Pingo mascot is a black penguin, from the Pingo Concursos brand.
References: https://lucashdo.com/gallery

## Recommended format

- Format: PNG with a transparent background
- Suggested size: at least 400×400px
- Background: transparent

## Supported variants

The component accepts these variants:
- `default` — the default pose
- `kana` — with a hachimaki headband and a flashcard
- `listening` — with headphones
- `exam` — with a hachimaki headband
- `progress` — with a pencil

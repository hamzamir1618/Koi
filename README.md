# KOI

Website for KOI (锦鲤), a Chinese fine-dining restaurant. The home page tells the Dragon Gate legend as you scroll: a koi swims upstream, leaps the gate, and becomes a dragon.

```
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```

## Sections and motion

| # | Section | What happens |
|---|---------|--------------|
| — | Doors (intro) | Lacquered temple doors. A seal is pressed across the seam, the knockers rattle, the doors swing open in 3D. Skippable. |
| 一 | Hero | Red ground, gold sun, ink dragon, falling blossom. Layers shift with the cursor. On scroll the KOI letters scatter like a school of fish, the dragon flies off, and a cobalt moon eclipses the sun and expands to fill the screen. |
| 二 | Tide | Pinned. Live WebGL water in flat posterised bands. The cursor leaves ripples; clicking makes a splash. Three wave layers rise, the koi surfaces spinning, seals stamp in, and a jade seigaiha curtain washes over. |
| 三 | Upstream | Pinned horizontal scroll through four flat-colour panels (the story). A koi rolls along a progress river. |
| 四 | Dragon Gate | Pinned. A paifang builds piece by piece, the koi leaps through, the plaque flashes, gold floods out, and the dragon appears. |
| 五 | Menu | Six full-screen dish cards that stack as you scroll. Each price is stamped on like a seal. |
| — | Tapes | Two crossed marquee tapes whose speed follows scroll velocity. |
| 六 | Evening | Pinned. Three lanterns light one by one, each bringing in a line of copy; they swing with scroll speed. |
| 七 | Reserve | A hanging scroll unrolls on arrival. Submitting the form presses a seal onto it. There is no booking backend yet. |

## Screens

| URL | Screen | Arrives through |
|-----|--------|-----------------|
| `#home` | The landing scroll (below) | Temple doors close and swing open |
| `#menu` | The carte: Dragon Gate tasting menu, sticky course tabs, 22 dishes in six colour-blocked courses, teas | Lacquer-red flood from the click |
| `#dish/<id>` | Dish detail: ingredients, allergens, tea pairing, related dishes | The dish's character lifts off the menu and lands on the page |
| `#story` | Four chapters linked by a brush line drawn as you scroll; principles; producers | A paper scroll unrolls behind its rod |
| `#visit` | Address, hours (today highlighted), street plan, getting there, the Print Room | A jade seigaiha wave |
| `#reserve` | Party → night → time → details, with a live table chit | A seal pressed onto a sheet |
| `#confirm` | The stamped chit, add-to-calendar (.ics), honest "prototype" note | A seal pressed onto a sheet |

The home page's reservation form hands its name and party size to `#reserve`.

## Palette

Muted lacquer: red `#C8352A`, gold `#EBB24A`, jade `#1F8A68`, cobalt `#2E46AE`, navy `#1A2352`, peony `#DD6886`, ink `#15101A`, paper `#F4EAD6`. Flat colours only; no gradients. See `src/styles/tokens.css`.

## Type

Cormorant Garamond (display), EB Garamond (body), Azeret Mono (labels), Ma Shan Zheng (brush calligraphy), Noto Serif SC 900 (seal characters). Loaded from Google Fonts.

## Still to do

- Real booking integration: `#reserve` and `#confirm` keep the booking in memory only, availability is pretend (`slotFull` in `lib/booking.tsx`), and nothing is sent.
- Dish photography or illustrations for the menu cards (currently a large character per dish).
- A single-koi illustration for the leap and the upstream marker (currently the yin-yang koi pair).
- Confirm dishes, prices, address and hours; add allergens.

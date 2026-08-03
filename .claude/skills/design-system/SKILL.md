---
name: design-system
description: Use whenever styling a screen or component, defining theme values, choosing a colour, font, radius, shadow or spacing value, or reviewing visual fidelity against design-reference/fb-ma. Contains the locked FoodBundles token set and the React Native theme contract.
---

# FoodBundles design system (React Native)

Every visual value in the app comes from `src/theme`. A hex, font name, radius, shadow or
duration written inline in a component is a defect.

Full prose reference: `design-reference/fb-ma/project/TOKENS.md`.

## `src/theme/tokens.ts`

```ts
export const color = {
  leaf: '#17683F',        // primary — CTAs, active nav, completed rail steps
  pine: '#0E4A2B',        // primary-dark — dark surfaces, hero, credit card
  marigold: '#F5A524',    // accent — money CTAs, current rail step, progress fill
  ripe: '#1E9E57',        // success
  chili: '#D64545',       // error / destructive
  oat: '#F6F5F1',         // app background
  paper: '#FFFFFF',       // card / surface
  ink: '#14221A',         // primary text

  body: '#3A4A41',        // body copy            9.4:1 on paper
  secondary: '#5F6861',   // secondary text       5.7:1 paper / 5.3:1 oat
  muted: '#676F68',       // placeholder, meta, chevrons   5.2:1 / 4.8:1
  disabledText: '#6E766F',// disabled + upcoming rail labels
  hairline: '#E7E8E2',    // borders, dividers
  disabledLine: '#C7CCC6',// disabled borders + hollow dots — NEVER text

  tintLeaf: '#E4F1EA', tintRipe: '#E1F3E8', tintMarigold: '#FDF0D7',
  tintMarigoldSoft: '#FDF9EF', marigoldLine: '#F4DCA6', tintChili: '#FBE7E7',
  neutral: '#EEF0EC', neutralLine: '#F0F1EC', mist: '#F1F6F3', press: '#F3F4EF',
  onPine: '#A7DCBE', onPineSoft: '#CFE6D8', onPineBright: '#8BD3A8',
  tintedGreenText: '#14663A', tintedAmberText: '#8A5B00', tintedRedText: '#A02D2D',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;

export const shadow = {
  card: {
    shadowColor: '#14221A', shadowOpacity: 0.16, shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }, elevation: 3,
  },
  raised: {
    shadowColor: '#14221A', shadowOpacity: 0.24, shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 }, elevation: 6,
  },
} as const;

export const hit = { min: 44 } as const;  // minimum touch target, every platform
```

## `src/theme/typography.ts`

Two families only. **Space Grotesk** for headings and *every price*. **IBM Plex Sans**
for body and UI.

```ts
export const font = {
  displayBold: 'SpaceGrotesk_700Bold',
  displaySemi: 'SpaceGrotesk_600SemiBold',
  bodyRegular: 'IBMPlexSans_400Regular',
  bodyMedium: 'IBMPlexSans_500Medium',
  bodySemi: 'IBMPlexSans_600SemiBold',
} as const;

export const text = {
  display:   { fontFamily: font.displayBold, fontSize: 29, lineHeight: 31, letterSpacing: -0.6 },
  h1:        { fontFamily: font.displayBold, fontSize: 23, lineHeight: 27, letterSpacing: -0.2 },
  h2:        { fontFamily: font.displayBold, fontSize: 17, lineHeight: 21 },
  body:      { fontFamily: font.bodyRegular, fontSize: 14, lineHeight: 20 },
  bodySemi:  { fontFamily: font.bodySemi,    fontSize: 14, lineHeight: 20 },
  label:     { fontFamily: font.bodySemi,    fontSize: 13, lineHeight: 18 },
  caption:   { fontFamily: font.bodyRegular, fontSize: 12, lineHeight: 17 },
  micro:     { fontFamily: font.bodySemi,    fontSize: 11, lineHeight: 15 },
  overline:  { fontFamily: font.bodySemi,    fontSize: 10.5, lineHeight: 14,
               letterSpacing: 0.7, textTransform: 'uppercase' as const },
  priceHero: { fontFamily: font.displayBold, fontSize: 30, lineHeight: 34, letterSpacing: -0.3 },
  priceLg:   { fontFamily: font.displayBold, fontSize: 22, lineHeight: 26 },
  priceMd:   { fontFamily: font.displayBold, fontSize: 16, lineHeight: 20 },
} as const;
```

**Prices always** use a `price*` style plus `fontVariant: ['tabular-nums']` and render
through `<PriceText />`. Give prices an aggressive size lead over their labels — the
tabular figure is the signature typographic move.

## Load fonts once

`src/app/_layout.tsx` loads both families with `useFonts` and returns `null` until ready.
Never load fonts inside a screen.

## Shape rule

Any tappable CTA is a **pill or rounded rectangle with a text label** — never a bare
filled circle. This keeps CTAs from being confused with the OrderStatusRail's Marigold
status-pulse dot, even though both use Marigold.

## Surface recipes

- **Card** — `paper` background, `radius.lg`, `shadow.card`, `space.lg` padding.
- **Dark feature card** (hero, wallet, credit line) — `pine` background, text `paper`,
  supporting text `onPine`, `radius.lg`.
- **Notice** — tint background + matching tinted text (`tintMarigold`/`tintedAmberText`
  for warnings, `tintRipe`/`tintedGreenText` for success, `tintChili`/`tintedRedText`
  for errors). Never plain `chili` text on `oat`.
- **Photo card** — full-bleed image on top, details below, `radius.lg`, `overflow: hidden`.

## Sanctioned off-token values

Do not "correct" these to palette colours:

- **Provider brand marks** (payment tiles only): `#FFCC00` MTN, `#E40000` Airtel,
  `#1A1F71` Visa, `#EB001B` Mastercard, `#25D366` WhatsApp.
- **Delivery map** natural cartography: `#E8E3D5` land, `#CBD9B7` parks, `#B7CCD9` water,
  `#D9D4C6` road casing, `#DED8C8` buildings. The pin stays Marigold.
- **Refunded badge** dashed border: `#E0B3B3`.

Anything else outside `tokens.ts` is drift — add it to the token file or don't use it.

## Review checklist

- [ ] No literal hex, `fontFamily` string, radius number or duration in the component
- [ ] Prices use `<PriceText />` with tabular figures
- [ ] Every CTA is pill/rounded-rect with a text label
- [ ] Secondary text is `secondary` or `muted`, never `disabledLine`
- [ ] Card shadow is `shadow.card`, not a bespoke shadow

---
name: accessibility-i18n
description: Use when adding touchables, icon-only buttons, text colours, form fields, or any user-facing string. Contains the accessibility floor (44px targets, 4.5:1 contrast, labels) and the EN/Kinyarwanda/French translation contract.
---

# Accessibility & localisation

Both were audited and fixed in the prototype. Regressions here are defects, not polish.

## Touch targets — 44×44 minimum, no exceptions

Every touchable is at least 44×44 **in layout**, on every platform.

Where the visual mark must stay small (back chevrons, cart steppers, delete icons,
inline text actions), keep the icon small and wrap it in a transparent 44×44 hit area:

```tsx
<Pressable
  onPress={onPress}
  accessibilityRole="button"
  accessibilityLabel="Decrease quantity"
  hitSlop={8}
  style={{ width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' }}
>
  <View style={styles.visual27} />
</Pressable>
```

Inline text actions ("Change", "Reply", "See all", "Show") get
`minHeight: 44` plus horizontal padding — never a bare `<Text onPress>`.

`hitSlop` alone is not sufficient; the measured box must be 44.

## Contrast — 4.5:1 minimum for all text

Use only these text colours. The values in the left column replaced earlier failures and
must not be reverted:

| Token | Hex | Ratio | Role |
|---|---|---|---|
| `ink` | `#14221A` | 14.9 paper | primary text |
| `body` | `#3A4A41` | 9.4 paper | body copy |
| `secondary` | `#5F6861` | 5.7 paper / 5.3 oat | secondary text |
| `muted` | `#676F68` | 5.2 paper / 4.8 oat | placeholder, timestamps, chevrons |
| `disabledText` | `#6E766F` | 4.7 paper | disabled + upcoming rail labels |

`disabledLine` `#C7CCC6` is **1.6:1** — borders and hollow dots only, never text.
Previously rejected: `#9AA39C` (2.6:1) and `#6B746D` on oat (4.4:1) — do not reintroduce.

On Pine surfaces use `onPine` `#A7DCBE` (5.9:1), `onPineSoft` `#CFE6D8`, or `paper`.
Tinted notices pair tint background with tinted text (`tintMarigold`/`tintedAmberText`
5.2:1, `tintRipe`/`tintedGreenText` 6.1:1).

## Labels & roles

- Every icon-only control: `accessibilityRole="button"` + a specific
  `accessibilityLabel` ("Notifications, 3 unread", "Download EBM invoice PDF",
  "Change mobile money number"). Never "button" or "icon".
- Toggles: `accessibilityRole="switch"` + `accessibilityState={{ checked }}`.
- Radio-style payment tiles: `accessibilityRole="radio"` + `accessibilityState`.
- Every `Image` has a meaningful `accessibilityLabel`, or `accessible={false}` when purely
  decorative — no empty labels on content images.
- Inputs use a real `<Text>` label tied by `accessibilityLabel`; error text is announced
  via `accessibilityLiveRegion="polite"`.
- Screen titles are `accessibilityRole="header"`.
- Announce async results: payment success, credit approval and EBM download all fire
  `AccessibilityInfo.announceForAccessibility`.

## Focus & keyboard (external keyboard / accessibility scanning)

Interactive elements must be reachable in visual order. Anything built from `View` +
`onPress` needs `accessible`, `accessibilityRole` and `focusable` on Android.

## Localisation — EN / Kinyarwanda / French

Three languages, switchable at runtime from Account → Language (plus the globe quick
toggle in the More header). All persistent **chrome** must translate: tab labels, screen
titles, buttons, form labels, the eight order statuses, and empty/error messages. Mock
product and order content stays in English.

```
src/i18n/
  en.ts  rw.ts  fr.ts     # same key set, all three exhaustive
  useT.ts                 # const t = useT();  t('tab_orders')
  index.ts
```

Rules:

- `useT()` only — no inline literals in components, no string concatenation for sentences.
  Interpolate: `t('itemsInCart', { count })`.
- Keys are semantic, not English text: `st_intransit`, not `inTransit`.
- Type the key union from `en.ts` so a missing translation fails typecheck.
- Language lives in `uiStore` and persists to AsyncStorage.
- Kinyarwanda and French must be real translations. Reference set already agreed:
  `st_pending` → Bitegereje / En attente · `st_confirmed` → Byemejwe / Confirmée ·
  `st_preparing` → Birategurwa / En préparation · `st_ready` → Biriteguye / Prête ·
  `st_intransit` → Biri mu nzira / En transit · `st_delivered` → Byatanzwe / Livrée ·
  `st_cancelled` → Byahagaritswe / Annulée · `st_refunded` → Byasubijwe / Remboursée ·
  tabs → Kugura / Ibyatumijwe / Ikofi / Inguzanyo / Ibindi.
- Kinyarwanda and French run longer than English: never fix a container to an English
  string's width, allow two lines on buttons, and test the longest locale.

## Numbers, currency, dates

Currency always via `formatRwf()` — RWF, thousands-separated, no decimals — and never
translated or localised into another format. Prices use tabular figures so columns align.
Dates use a shared `formatDate()`; don't inline `toLocaleDateString` per screen.

## Review checklist

- [ ] Every touchable measures ≥44×44
- [ ] Every icon-only control has a specific `accessibilityLabel`
- [ ] No text uses `disabledLine`; no `#9AA39C` anywhere
- [ ] Every image has a label or is explicitly decorative
- [ ] No user-facing literal outside `src/i18n`
- [ ] Layout survives the longest of the three locales

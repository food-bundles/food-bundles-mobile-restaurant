---
name: component-library
description: Use when creating, reusing or refactoring any shared React Native component — primitives (Button, Card, Input, Badge, Skeleton, EmptyState, ErrorState), order components (OrderStatusRail, OrderProgressTrack, OrderStatusBadge), product cards, payment tiles, or layout helpers. Also use when a file approaches 200 lines and needs splitting.
---

# Component library

Build the shared set **first**, then compose screens from it. A screen that re-implements
a button, card, badge or stepper inline is a defect.

## File discipline

- **≤200 lines per file**, no exceptions. Styles count.
- One component per file, named export, `index.ts` barrel per folder.
- Props interface named `<Component>Props`, exported.
- Order inside a file: imports → types → component → `StyleSheet.create`.
- Screen-only subsections live in `_components/` beside the route, not in `components/`.

Split signals: more than one `StyleSheet.create`, more than ~6 props, a nested
`.map()` producing markup, or two unrelated pieces of state.

## Primitives — `src/components/primitives`

| Component | Contract |
|---|---|
| `Button` | `variant: 'primary' \| 'secondary' \| 'accent' \| 'destructive'`, `size: 'md' \| 'sm'`, `loading`, `disabled`, `fullWidth`, `onPress`, `children`. Pill/rounded-rect, min height 48 (`md`) / 44 (`sm`). Press feedback = scale 0.98 + brightness. `loading` swaps the label for a spinner and blocks presses. |
| `Card` | `padded`, `dark`, `onPress?`. Adds `shadow.card`; becomes a touchable with press scale when `onPress` is given. |
| `Input` | `label`, `value`, `onChangeText`, `placeholder`, `error?`, `helper?`, `keyboardType`, `rightSlot?`. Error state swaps border to `chili` and shows the message below. Min height 44. |
| `Badge` | `tone: 'neutral' \| 'leaf' \| 'ripe' \| 'marigold' \| 'chili'`, `label`, `dashed?`. Pill, `overline` type. |
| `Skeleton` | `width`, `height`, `radius?`. Reanimated shimmer sweep. Shaped like the content it replaces. |
| `EmptyState` | `icon`, `title`, `message`, `action?`. Specific and helpful — never "No data". |
| `ErrorState` | `title`, `message`, `onRetry`. Explains what happened, offers retry, speaks in the interface's voice. |

Every data-bearing screen must render all three of `Skeleton`, `EmptyState`, `ErrorState`
paths. The Orders list is the reference implementation.

## Order components — `src/components/order`

Reuse exactly; never re-derive status visuals.

- **`OrderStatusRail`** — the app's signature element. **Horizontal, scrollable** on the
  order-detail screen. Six steps: completed = filled `leaf` + check, current = `marigold`
  with a breathing pulse, upcoming = hollow with `disabledLine` border and
  `disabledText` label. On mount, scroll so the **current step is centred** (retry after
  layout so it survives the screen transition). Props: `step: 1..6`, `timestamps`.
- **`OrderProgressTrack`** — compact six-segment horizontal bar for list cards and the
  home summary. Completed `leaf`, current `marigold` (or `ripe` when delivered),
  upcoming `hairline`. Keep this on list cards — do not replace it with the rail.
- **`OrderStatusBadge`** — eight states, one treatment each. **Orders only.** Never reuse
  it for a credit line, subscription or staff record; those get their own labels.

## Product + payment

- **`ProductCard`** — full-bleed photo on top, then name, unit, price, and a full-width
  `Add` button pinned to the bottom. Uniform height inside a grid. Two per row on
  listings. Props: `product`, `onPress`, `onAdd`, `qty?`, `onInc?`, `onDec?` (renders a
  `QuantityStepper` in place of `Add` when `qty > 0`).
- **`QuantityStepper`** — −/qty/+ with 44×44 transparent hit areas around 27px visual
  buttons.
- **`PriceText`** — the only place currency renders. `amount: number`, `size`,
  `suffix?`. Uses `formatRwf()` and tabular figures.
- **`MobileMoneyTile`** — one tile for MTN **and** Airtel. Both marks shown; the detected
  network (from the phone prefix) is full-colour, the other greyscale at 32% opacity.
  Selected state reveals the phone row with a "Change" action.
- **`CardTile`** — one tile for Visa **and** Mastercard, both marks shown. Selected state
  reveals a masked card row and the external-continue affordance.
- **`WalletTile`**, **`VoucherTile`** — logo, title, subtitle, radio.

## Layout — `src/components/layout`

- **`ScreenScroll`** — safe-area aware scroll container, hidden scrollbar, standard
  horizontal padding, `contentInsetBottom` for the tab bar or sticky footer.
- **`SectionHeader`** — `title`, `subtitle?`, `action?`. Adds the hairline rule + extra
  top padding used to separate stacked sections.
- **`StickyFooter`** — hairline top border, `oat` background, safe-area bottom padding.
  Holds the primary CTA on checkout-style screens.
- **`SwipeRow`** — gesture-handler `Pan` + Reanimated. Drags left to reveal a `chili`
  Remove action; past ~58px it calls `onDelete`, otherwise springs back. Used on both the
  guest and authenticated cart rows. Also expose the delete action as a real button so
  it stays reachable without a gesture.

## Icons — `src/components/icons`

One `react-native-svg` component per glyph, `size` + `color` props defaulting to 20 and
`color.ink`. Reuse the prototype's stroke language: 1.9 stroke width, round caps and
joins. No icon fonts, no emoji anywhere in the UI.

## Anti-patterns

- Inline `<TouchableOpacity>` with bespoke styling instead of `Button`
- A second hero/banner treatment when `Card dark` already covers it
- `OrderStatusBadge` on anything that is not an order
- Duplicating a surface that already shows the same content elsewhere on a screen
- Business logic inside a component — it belongs in a store or `src/lib`

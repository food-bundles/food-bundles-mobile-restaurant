# FoodBundles Restaurant — token reference

Applies to `FoodBundles App.dc.html`. Nothing outside this file should introduce a new hue.

## Core palette

| Token | Hex | Role |
|---|---|---|
| Leaf | `#17683F` | primary — CTAs, active nav, completed rail steps |
| Pine | `#0E4A2B` | primary-dark — dark surfaces, hero, credit card |
| Marigold | `#F5A524` | accent — money CTAs, current rail step, progress fill |
| Ripe | `#1E9E57` | success |
| Chili | `#D64545` | error |
| Oat | `#F6F5F1` | app background |
| Paper | `#FFFFFF` | card / surface |
| Ink | `#14221A` | primary text |

## Text & neutral scale

| Hex | Role | Contrast |
|---|---|---|
| `#14221A` | primary text | 14.9:1 on Paper |
| `#3A4A41` | body text | 9.4:1 on Paper |
| `#5F6861` | secondary text | 5.7:1 Paper / 5.3:1 Oat |
| `#676F68` | muted, placeholder, timestamp, chevron | 5.2:1 Paper / 4.8:1 Oat |
| `#6E766F` | disabled/upcoming **text** | 5.2:1 on Paper |
| `#E7E8E2` | hairline / border | non-text |
| `#C7CCC6` | disabled **border & hollow dot only** — never text | non-text |

`#5F6861` replaced `#6B746D` and `#676F68` replaced `#9AA39C` in the July 28 accessibility pass;
both originals failed 4.5:1 (4.43:1 and 2.59:1 respectively).

## Tint surfaces

`#E4F1EA` `#E1F3E8` (Leaf/Ripe tints) · `#FDF0D7` `#FDF9EF` `#F4DCA6` (Marigold tints) ·
`#FBE7E7` (Chili tint) · `#EEF0EC` `#F0F1EC` `#F1F6F3` `#F3F4EF` `#F1F1EE` `#F0ECE0` (neutral tints) ·
`#A7DCBE` `#8BD3A8` `#CFE6D8` `#E7F3EC` (on-Pine text) · `#14663A` `#8A5B00` `#A02D2D` `#5A4A20` (tinted text) ·
`#0E1A12` (device bezel) · `#E7E9E3` `#DFE1DB` (page chrome)

## Type

Space Grotesk 600/700 — headings and **every price** (tabular figures, thousands-separated, no decimals).
IBM Plex Sans 400/500/600 — body and UI.

## Spacing, radius, elevation

Base-4 spacing. Radii `8 / 12 / 16 / pill` nominal; 9–48px variants appear where nesting requires it
(accepted trade-off, logged in the July 28 audit). One card shadow, warmed for photo cards.

## Motion

Two durations only: **.38s** navigation (stack push/pop, focus present, bottom sheets),
**.30s** overlays (tab cross-fade, pull-to-refresh, opacity states).
Easing `cubic-bezier(.33,.7,0,1)` everywhere; single spring `cubic-bezier(.34,1.56,.64,1)`
for the cart badge bump and the confirmation checkmark.
Micro-interactions: `transform .12s` press, `.15s` border, `.2–.3s` background.

## Shape rule

Any tappable CTA is a pill or rounded rectangle **with a text label** — never a bare filled circle,
so it can never be confused with the OrderStatusRail's Marigold status-pulse dot.

## Sanctioned off-token hex values

These are deliberate exceptions, not drift. Do not "correct" them to palette colors.

**Provider brand marks** (legally/recognisably fixed, payment tiles only):
`#FFCC00` MTN · `#E40000` Airtel · `#1A1F71` Visa · `#EB001B` Mastercard · `#25D366` WhatsApp

**Delivery map, natural cartographic palette** (a map reads wrong in brand colors):
`#E8E3D5` land · `#CBD9B7` parks · `#B7CCD9` water · `#D9D4C6` road casing · `#DED8C8` buildings.
The pin stays Marigold and the accuracy radius stays Marigold-tinted so the map still reads as ours.

**Status badge:** `#E0B3B3` — dashed border on the Refunded badge only.

## Component vocabulary

`OrderStatusRail` (vertical, order detail) · `OrderProgressTrack` (list cards, home/orders summary) ·
`OrderStatusBadge` (8 order states only — never reused for non-order objects; the credit line has its
own "Active / Repayment due" label) · Button · Card · Input · Skeleton · EmptyState · ErrorState.

## Accessibility floor

Every interactive element ≥44×44px (enforced by a `[role="button"],[role="switch"],button{min-height:44px}`
reset plus transparent 44px hit wrappers around small icons). All text ≥4.5:1.
Icon-only controls carry `aria-label`; clickable non-button elements carry `role="button"` + `tabindex="0"`,
with Enter/Space handled by one document-level key handler.

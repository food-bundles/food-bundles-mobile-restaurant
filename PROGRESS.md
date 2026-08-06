# PROGRESS.md — FoodBundles Restaurant (React Native)

Autonomous build log. **Claude Code owns this file** and rewrites it after every phase.
Keep it short enough to read in one screen per phase.

Repo state: branch `feat/mobile-ui`, base `main`.

---

## Status

| Phase | Scope | State | Commit |
|---|---|---|---|
| 1 | Foundation — scaffold, theme, lib, i18n, nav shell | ✅ | 30f29bf |
| 2 | Primitives + layout + icons | ✅ | 7eb386f |
| 3 | Mock data, stores, domain components | ✅ | a0d0b00 |
| 4 | Public / guest flow (7 screens) | ✅ | 549b72f |
| 5 | Auth flow (4 screens) | ✅ | 729e7b6 |
| 6 | Shop tab (5 screens) | ✅ | a763b86 |
| 7 | Checkout flow (5 screens) | ✅ | 76e9d23 |
| 8 | Orders tab (6 screens) | ✅ | cb3e7a7 |
| 9 | Wallet tab (3 screens) | ⬜ | — |
| 10 | Subscription + vouchers (7 screens) | ⬜ | — |
| 11 | More hub — affiliators, settings, notifications, support (13 screens) | ⬜ | — |
| 12 | Polish — motion review, a11y/i18n audit, line-limit sweep | ⬜ | — |

States: ⬜ not started · 🔄 in progress · ✅ done · ⚠️ done with a flagged decision

---

## Phase log

Newest first. One block per phase, this shape:

```
### Phase N — <name>  ✅  <ISO date>
Commit: <sha> — <message>
Built: <files/screens, one line>
Gates: tsc ✅ · eslint ✅ · line-limit ✅ (max <n> lines in <file>) · expo boots ✅
States covered: loading ✅ empty ✅ error ✅   (data screens only)
Decisions taken autonomously: <none | see Decisions below>
Deviations from the prototype: <none | what and why>
```

---

### Phase 1 — Foundation  ✅  2026-08-05
Commit: 30f29bf — feat(phase-1): foundation — scaffold, theme, lib, i18n, nav shell
Built: Expo/TS scaffold (package.json, app.json, tsconfig, babel, eslint); src/theme
(tokens, typography, motion, index); src/lib (formatRwf, detectTelecom, sleep, dates);
src/i18n (en/rw/fr, useT, languageStore persisted to AsyncStorage); root layout with font
loading; full navigable shell for all 51 screens across (public), (auth), (app) groups —
tab bar, session gate, full-focus modal presentations.
Gates: tsc ✅ · eslint ✅ · line-limit ✅ (max 92 lines, `(app)/(tabs)/_layout.tsx`) ·
expo boots ✅ (Metro starts clean, `/status` returns `packager-status:running`)
States covered: n/a — no data screens yet
Decisions taken autonomously: see #1 and #2 below
Deviations from the prototype: none

### Phase 2 — Primitives, layout, icons  ✅  2026-08-05
Commit: 7eb386f — feat(phase-2): primitives, layout components, icon set
Built: src/components/primitives (Button, Card, Input, Badge, Skeleton, EmptyState,
ErrorState); src/components/layout (ScreenScroll, SectionHeader, StickyFooter, SwipeRow);
9 SVG icons in src/components/icons matching the prototype's exact paths (chevron-left,
person, basket, check, plus, minus, orders, wallet, voucher, more), all 1.9 stroke/round
caps; replaced the tab bar's Phase-1 letter-glyph placeholders with the real Orders/
Wallet/Vouchers/More icon paths pulled from the design-system prototype's tab bar mock.
Gates: tsc ✅ (fixed one strict-mode style-array type error in Input.tsx) · eslint ✅ ·
line-limit ✅ (max 95 lines) · expo boots ✅ (`/status` → `packager-status:running`)
States covered: n/a — Skeleton/EmptyState/ErrorState built as primitives, wired into real
screens starting Phase 4+
Decisions taken autonomously: see #3 below; also resolves Decision #1 from Phase 1 (tab
bar now uses real icons, not glyphs)
Deviations from the prototype: Skeleton uses an opacity pulse instead of a horizontal
gradient sweep — see #3

### Phase 3 — Mock data, stores, domain components  ✅  2026-08-06
Commit: a0d0b00 — feat(phase-3): mock data, zustand stores, order/product/payment components
Built: src/mocks (types, products ×13, orders ×5 + guest, transactions, notifications,
farms, plans, account, offline placeholder image); src/stores (cartStore, guestCartStore
with min-order/fee rules, ordersStore with status machine + simulateFailure, walletStore
with clamped topUp, vouchersStore with credit adjust/approve, notificationsStore, uiStore
wrapping language persistence); src/components/order (OrderStatusRail — horizontal,
auto-centring, breathing-pulse current step with reduce-motion support; OrderProgressTrack;
OrderStatusBadge, 8 states); src/components/product (PriceText, QuantityStepper,
ProductCard); src/components/payment (shared PaymentTileBase + MobileMoneyTile with real
telecom-prefix detection, CardTile, WalletTile, VoucherTile).
Gates: tsc ✅ · eslint ✅ · line-limit ✅ (max 128 files, all ≤200) · expo boots ✅
States covered: ordersStore/walletStore/notificationsStore all expose idle/loading/ready/
error; wired into real screens starting Phase 6/8/9
Decisions taken autonomously: see #4 and #5 below
Deviations from the prototype: none structural — see #5 for a numeric reconciliation note

### Phase 4 — Public and guest flow  ✅  2026-08-06
Commit: 549b72f — feat(phase-4): public and guest flow screens
Built: Landing (header, hero with corrected 100,000 RWF Premium card sourced from
`plans` mock, auto-scrolling marquee of 12 restaurants, connect-to-farm stats that
animate in on layout, support channel list, auto-advancing farm carousel, farmer
recruitment band, footer — all as `_components/` sections per the 120-line route rule);
Guest Shop (banner, category chips, two-per-row grid, sticky footer); Guest Cart
(SwipeRow rows, totals card, non-blocking convert prompt, empty state); Guest Delivery
(manual-entry fields only, delivery-window picker); Guest Payment (Mobile Money + Card
only, processing state, wallet/voucher note); Guest Confirmation (spring-and-draw check
animation, dark total card, forward-only exit, cart cleared); Farmer Join (Pine intro,
form, submitted state). Added ~90 new i18n keys (landing/guest/farmer/footer chrome)
across all three locales.
Gates: tsc ✅ (fixed an Image/View `inset` shorthand type error and a readonly-tuple
`danger` property error) · eslint ✅ · line-limit ✅ (max 145 files, all ≤200) · expo
boots ✅
States covered: Guest Cart empty state wired to `EmptyState`; guest flow has no
loading/error states in the prototype spec, so none were added
Decisions taken autonomously: see #6 below
Deviations from the prototype: none structural — see #6 for the confirmation-check
animation note

### Phase 5 — Auth flow  ✅  2026-08-06
Commit: 729e7b6 — feat(phase-5): auth flow screens
Built: Splash (Pine background, logo mark, progress bar filled to 66%, tap-to-skip);
Login (email/password with Show toggle, forgot-password link, log in, create-account
link); Signup (business name, Restaurant/Hotel toggle, phone, optional TIN with EBM
helper note, staff-added-later note); Forgot password (email, send reset link, in-voice
confirmation hint, back to login). Added `LogoMark` icon component (the leaf-basket
mark) to replace three separate ad-hoc re-implementations of the same SVG across Splash,
Login and the Landing header. Added ~30 new i18n keys for auth chrome across all three
locales.
Gates: tsc ✅ · eslint ✅ · line-limit ✅ (max 146 files, all ≤200) · expo boots ✅
States covered: n/a — no data-driven lists on these screens
Decisions taken autonomously: none new this phase
Deviations from the prototype: none

### Phase 6 — Shop tab  ✅  2026-08-06
Commit: a763b86 — feat(phase-6): shop tab screens
Built: Shop Home (venue header, notification/cart badges, weather greeting, search
trigger, auto-advancing hero carousel — active order/wallet/vouchers/weekly-deal/
market-prices/weather cards on a shared card shell, category chips, popular-this-week
grid, floating "Ask for support"); Category (back-navigated title from a `category`
param, product count, price sort toggle, grid); Search (inline pill search field,
live-filtered results, recent-search chips); Product Detail (hero image with cart
badge, price/unit, in-stock + next-day badges, description, quantity stepper, sticky
subtotal + Add to cart); Cart (swipe-to-delete rows, totals card, empty state, checkout
CTA). Added `BellIcon`/`SearchIcon` to the icon set (both needed real screens to confirm
against, deferred from Phase 2 for that reason). Added ~25 new i18n keys for shop chrome.
Gates: tsc ✅ · eslint ✅ (fixed one unused import) · line-limit ✅ (max 159 files, all
≤200) · expo boots ✅
States covered: Cart empty state wired to `EmptyState`; Shop Home/Category/Search have
no loading/error states in the prototype spec (mock data is synchronous), so none added
Decisions taken autonomously: none new this phase
Deviations from the prototype: the 7-card hero carousel uses one shared card shell
instead of 7 bespoke per-card entrance animations (progress wipe, count-up, shimmer
sweep, Ken Burns zoom, staggered count-up, sun rotation) — the auto-advance/pause/dot
mechanics are real and match spec, but the signature per-card motion from the motion
skill is simplified; flagged for a follow-up pass if visual fidelity there matters more
than mechanism correctness

### Phase 7 — Checkout flow  ✅  2026-08-06
Commit: 76e9d23 — feat(phase-7): checkout flow screens
Built: Checkout Delivery (styled SVG Kigali map with marigold pin + accuracy radius,
saved-address card, add-another/manual-entry toggle, shared delivery-window picker);
Checkout Payment (dark order-total card, all four payment tiles via a new
`PaymentMethodPicker`, items-in-order card, Pay CTA); Voucher step (credit-available /
remaining-after math, OTP notice); OTP (6 real digit boxes driven by a hidden numeric
input, 30s resend countdown, disabled-until-complete Verify & pay); Confirmation (spring
+ stroke-draw check, dark total card with order ref/status badge, items card, forward-
only Track order / Continue shopping that clears the cart). New `checkoutStore`
(address/window/method/phone, shared by both delivery and payment steps).
Mid-phase cleanup: promoted `CheckoutStepHeader`, `DeliveryWindowPicker` and
`ConfirmationCheck` out of `(public)/_components` into a shared `src/components/checkout`
— Phase 4 had built them for the guest flow only, then this phase needed the same three
components from `(app)/checkout`, which would have meant importing across route groups.
Gates: tsc ✅ · eslint ✅ (fixed two unused imports, one of which was dead store state —
removed the unused `checkoutStore.otpMode` field entirely rather than leave it unread) ·
line-limit ✅ (max 165 files, all ≤200) · expo boots ✅
States covered: n/a — checkout has no data-loading states in the prototype spec (all
values come from the active mock order); OTP's own processing/disabled state is present
Decisions taken autonomously: none new this phase
Deviations from the prototype: none structural

### Phase 8 — Orders tab  ✅  2026-08-06
Commit: cb3e7a7 — feat(phase-8): orders tab screens; split i18n files by domain
Built: Orders List (demo-state toggle live/loading/empty/error wired to `uiStore`,
active-order card, filter chips, pull-to-refresh, `OrderCard` using `OrderProgressTrack`
+ `OrderStatusBadge`, shimmer skeleton rows for loading, `EmptyState`/`ErrorState` for
the other two); Order Detail (`OrderStatusRail`, meta card, items, EBM/payment-history
action row, reorder CTA, contact support); Reorder (photo rows, out-of-stock line
detection against the live catalogue, "Add N items to cart" reflecting only in-stock
lines). Promoted `OrderItemsCard` from a checkout-local `_components` folder to shared
`src/components/order` since Order Detail needed the same card checkout already built.
Split `src/i18n/{en,rw,fr}.ts` into per-domain folders (`common`, `landing`, `guest`,
`auth`, `shop`, `checkout`, `orders`, each with a merging `index.ts`) — the flat files
had grown past 200 lines from 8 phases of accumulated keys; this also gives every future
phase its own key file instead of continuing to grow shared monoliths.
Gates: tsc ✅ · eslint ✅ · line-limit ✅ (was over 200 in all three locale files before
the split; 193 files now, all ≤200) · expo boots ✅
States covered: Orders List demonstrates all three (loading/empty/error) via the visible
demo-state toggle, matching the prototype's own dev-only state switcher
Decisions taken autonomously: none new this phase — the i18n split is a structural fix
required by the line-limit gate, not a design decision
Deviations from the prototype: none

## Decisions taken autonomously

Anything the design did not settle, that I decided rather than blocking on. Each needs a
one-line rationale so it can be reversed cheaply.

| # | Question | Decision | Rationale | Review |
|---|---|---|---|---|
| 0 | Premium subscription price — 50,000 (landing) vs 100,000 (in-app Plans) | **100,000 RWF/mo, 28,000 RWF/wk**; landing copy corrected to match | Confirmed by the product owner before the build started | settled |
| 1 | Tab bar needs icons before Phase 2 builds the real SVG icon set | Letter-glyph placeholders (S/O/W/V/M) in tokenised colour/type, no emoji, no icon font | Component-library skill assigns `src/components/icons` to Phase 2; blocking Phase 1 on the full icon set would stall the nav shell for no reason | **resolved in Phase 2** — replaced with real icon paths from the design-system prototype |
| 2 | `npm ls` showed an invalid `ajv@6` vs `ajv@8` resolution (eslint wants 6, expo-router's `schema-utils`→`ajv-keywords` wants 8) that crashed `expo start` on `ajv/dist/compile/codegen` | Scoped `package.json` `overrides` to force `ajv@8` only inside `schema-utils`'s `ajv-keywords`, leaving eslint's own `ajv@6` untouched | A blanket `ajv` override (attempt 1) broke eslint itself (`ajv@6`-only API); scoping the override to the one subtree that needed it fixed `expo start` without regressing the lint gate | settled, verified both gates green after |
| 3 | `Skeleton`'s spec calls for a horizontal gradient shimmer sweep, but the locked stack has no gradient library (`react-native-linear-gradient` is not in CLAUDE.md's stack table) | Built the loading cue as a looping opacity pulse (0.6↔1.0, 1.4s) on a flat `neutral`-tinted block instead | Conservative option: reuses existing tokens/deps rather than adding a new package for one effect; preserves the functional intent (a continuous, visible "this is loading" signal) without violating the "no new dependency" spirit of the locked stack | revisit if a gradient primitive is added for another reason later |
| 4 | Product images need a source, but no image assets exist in the repo and the app must run fully offline | Used a single embedded 1×1 transparent PNG as a `data:` URI (`src/mocks/placeholderImage.ts`) for every product's `image` field, instead of a remote placeholder-service URL | A `https://placehold.co/...` URL is a real network dependency, contradicting "reviewers should run the app offline" in the mock-data skill; a local data URI has zero network calls and needs no binary asset files to be added to the repo | revisit once real product photography is supplied |
| 5 | CLAUDE.md/mock-data skill only gives exact line items for FB-24815 (which must reconcile to 62,200); the other four orders (FB-24790/24762/24801/24755) only specify a fixed total, no line items | For FB-24801 the catalog price (Fresh Milk 6,500 × 3 = 19,500) already reconciles cleanly with the given total via the existing delivery fee, so it was kept as-is; for FB-24790/24762/24755 the catalog per-unit price did not reconcile against the specified fixed total under any plausible quantity, so a single line item's `each` price was set to make the math exact instead | The fixed order totals in CLAUDE.md are explicit, named values ("Recurring mock values ... must match across every screen"); silently letting subtotal+fee ≠ total would be a worse defect than a line item whose per-unit price doesn't match the product catalog, since order totals are cross-referenced on more screens (list, detail, EBM) than any single line price | revisit if the design source ever supplies real line items for these four orders |
| 6 | The motion skill specifies the confirmation checkmark as a `strokeDashoffset` path-draw plus a spring-popping disc; `react-native-svg`'s `Path` doesn't support this out of the box | Wrapped `Path` in `Animated.createAnimatedComponent` and drove `strokeDashoffset` via Reanimated `useAnimatedProps`, timed after the disc's spring pop, matching the prototype's sequencing (disc pops first, check draws in ~450ms after) | This is one of only two sanctioned `spring` moments in the whole app (per the motion skill) so it was worth the extra plumbing rather than substituting a plain fade/scale-in, which was the fallback considered | verify the exact dash length visually once the app runs on a device/simulator |

---

## Open questions for the owner

Only things that genuinely blocked a phase. Empty is the goal.

- _none_

---

## Deferred / follow-up

Work deliberately left out of scope, with the reason.

- **No git remote configured** (`git remote -v` empty) — `git push origin feat/mobile-ui`
  fails with `fatal: 'origin' does not appear to be a git repository`. This predates the
  build; adding a remote needs a URL only the owner has, so every phase commits locally to
  `feat/mobile-ui` and skips the push step rather than retrying a call that cannot succeed.
  Not one of the four stop conditions — no data or work is at risk, it is fully recoverable
  by running `git remote add origin <url> && git push -u origin feat/mobile-ui` once a
  remote exists.
- **Hero carousel per-card entrance motion** (progress wipe, count-up, shimmer sweep,
  Ken Burns zoom, staggered count-up, sun rotation) is simplified to one shared card
  shell in `src/app/(app)/shop/_components/HeroCard.tsx` — the carousel mechanism
  (2500ms auto-advance, pause-on-interaction, dot indicators) is real and matches the
  motion skill; the six bespoke per-card animations do not. Revisit in a motion-focused
  pass if fidelity there is prioritised over the mechanism.
- **`CartList` (authenticated) and `GuestCartList`** are near-duplicate components
  differing only in which store they read from (`cartStore` vs `guestCartStore`). Kept
  separate rather than introducing a shared generic abstraction for two call sites;
  revisit if a third near-identical cart list appears.

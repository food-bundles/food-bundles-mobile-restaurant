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
| 4 | Public / guest flow (7 screens) | ⬜ | — |
| 5 | Auth flow (4 screens) | ⬜ | — |
| 6 | Shop tab (5 screens) | ⬜ | — |
| 7 | Checkout flow (5 screens) | ⬜ | — |
| 8 | Orders tab (6 screens) | ⬜ | — |
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

# FoodBundles Restaurant — Mobile App (React Native)

Implementation repo for the **FoodBundles Restaurant** app: a B2B produce-procurement
app for restaurants, hotels and their staff in Kigali, Rwanda. Tone is **trustworthy and
efficient** — a working tool, not a consumer food-delivery app.

The approved visual prototype lives in `design-reference/fb-ma/`. It is the **source of
truth for layout, copy, tokens and behaviour**. Read it before building any screen.

## Stack (fixed — do not substitute)

| Concern | Choice |
|---|---|
| Runtime | Expo SDK 51+ (managed), React Native 0.74+ |
| Language | TypeScript, `strict: true` |
| Routing | `expo-router` v3 (file-based, typed routes) |
| Styling | `StyleSheet.create` + tokens from `src/theme` — **no Tailwind/NativeWind** |
| State | `zustand` (one store per domain slice) |
| Animation | `react-native-reanimated` v3 + `react-native-gesture-handler` |
| Vectors | `react-native-svg` |
| Fonts | `@expo-google-fonts/space-grotesk`, `@expo-google-fonts/ibm-plex-sans` |
| Icons | `react-native-svg` components in `src/components/icons` — no icon font |
| Lists | `FlatList` / `SectionList` (never `.map()` over long data) |
| Storage | `@react-native-async-storage/async-storage` (mock persistence only) |

## Non-negotiable rules

1. **No file exceeds 200 lines.** Includes tests and style objects. Split by
   responsibility, not by arbitrary line count. If a screen is long, extract sections
   into `_components/` next to the route.
2. **Fully mocked.** No `fetch`, no `axios`, no API client, no base URL, no auth server,
   no `// TODO: connect backend`. All data comes from `src/mocks`. Async is simulated
   with `await sleep(ms)` from `src/lib/sleep.ts`.
3. **Production-ready output.** Every file must typecheck and lint clean, handle
   loading/empty/error states, and be free of placeholder copy, `console.log`, dead code
   and commented-out blocks.
4. **No new design values.** Colours, type, spacing, radii and motion durations come
   from `src/theme`. Never hardcode a hex, font name or duration in a component.
5. **Accessibility floor.** Every touchable ≥44×44, `accessibilityRole`/`accessibilityLabel`
   on every icon-only control, all text ≥4.5:1 contrast.
6. **One component, one file, one export.** Named exports; `index.ts` barrels per folder.

## Directory structure

```
src/
  app/                        # expo-router routes only — thin, compose from components
    (public)/                 # pre-auth: landing, guest shop + guest checkout, farmer join
    (auth)/                   # splash, login, signup, forgot-password
    (app)/                    # authenticated
      (tabs)/                 # shop, orders, wallet, vouchers, more
      shop/                   # category, search, product/[id], cart
      orders/                 # [id], reorder
      wallet/                 # transactions
      more/                   # subscription, affiliators, settings, notifications, ebm
      checkout/               # delivery, payment, otp, confirmation
    _layout.tsx
  components/
    primitives/               # Button, Card, Input, Badge, Skeleton, EmptyState, ErrorState
    order/                    # OrderStatusRail, OrderProgressTrack, OrderStatusBadge
    product/                  # ProductCard, QuantityStepper, PriceText
    payment/                  # MobileMoneyTile, CardTile, WalletTile, VoucherTile
    icons/
    layout/                   # ScreenScroll, SectionHeader, StickyFooter, SwipeRow
  theme/                      # tokens.ts, typography.ts, motion.ts, index.ts
  mocks/                      # products, orders, transactions, notifications, farms, plans
  stores/                     # cartStore, guestCartStore, sessionStore, walletStore…
  lib/                        # formatRwf, detectTelecom, sleep, dates
  i18n/                       # en.ts, rw.ts, fr.ts, useT.ts
```

Routes stay thin: a route file wires data + layout and renders components. If a route
file grows past ~120 lines, extract into `_components/`.

## Domain rules (must be reflected exactly)

- **Currency:** RWF only. Thousands-separated, **no decimals**. Always via `formatRwf()`.
  Prices render in Space Grotesk with tabular figures.
- **Order status:** exactly six steps, in order — `PENDING → CONFIRMED → PREPARING →
  READY → IN_TRANSIT → DELIVERED`. `CANCELLED` and `REFUNDED` are terminal side-states
  shown as a badge only, never as a rail step. Do not invent or reorder statuses.
- **Payment methods:** exactly four.
  - `MOBILE_MONEY` — **one tile** for MTN and Airtel; the network is detected from the
    phone prefix (`078/079` → MTN, `072/073` → Airtel) and the matching logo is
    highlighted while the other dims.
  - `CARD` — **one tile** for Visa and Mastercard; card entry continues on an external
    Flutterwave page (mock the redirect as a screen state).
  - `CASH` — prepaid wallet balance.
  - `VOUCHER` — credit; requires the OTP step before it can complete.
- **Vouchers require an active subscription.** With no plan, the Vouchers tab is still
  visible and tappable and shows the locked/upgrade screen — never a plain empty list,
  never a disabled tab.
- **Subscription tiers:** `BASIC` 20,000 RWF and `PREMIUM`. Weekly or monthly billing
  toggle. First-ever upgrade requires accepting terms, then an underwriting questionnaire
  (TIN, reason, frequency, repayment duration), then OTP.
  ✅ **Settled:** Premium is **100,000 RWF/month, 28,000 RWF/week** (the in-app `TIERS`
  value). The public landing page previously read 50,000 — correct it to 100,000. Use the
  same numbers in `src/mocks` and on every screen.
- **Signup** creates a Restaurant or Hotel account only. TIN is optional at signup
  ("Required for EBM-linked invoicing — you can add this later").
- **Affiliators** (staff) are added in-app by a manager. They can do everything a
  restaurant account can **except request vouchers** — enforce this in the store and the
  UI, not just with a label.
- **Guest ordering is real**, not a teaser: guests browse, build a cart and check out with
  Mobile Money or Card only (no wallet, no voucher). Minimum order **100,000 RWF**; below
  that an additional delivery fee is added and shown as a line — it never blocks checkout.
- **EBM** (Rwanda Revenue Authority e-invoicing) documents attach to paid orders and are
  previewed before download.

## Mock account (use these exact values everywhere)

Business **Kigali Bistro** · manager **Aline Uwase** · `orders@kigalibistro.rw` ·
`+250 788 123 456` · TIN `102 938 471` · KG 11 Ave, Kimihurura, Kigali ·
wallet balance **1,240,000 RWF** · active order **FB-24815** (In transit, 62,200 RWF).
Recurring IDs: FB-24815, FB-24790, FB-24762, FB-24801, FB-24755, guest FB-G-4471.

## Skills

Read the matching skill in `.claude/skills/` before starting a task:

| Skill | Use when |
|---|---|
| `design-system` | any styling, theme, token or typography work |
| `component-library` | building or reusing a shared component |
| `navigation` | adding routes, tabs, stacks, modals, guards |
| `mock-data` | data shapes, stores, simulated async, domain enums |
| `screen-specs` | implementing a specific screen from the prototype |
| `motion` | transitions, gestures, animated feedback |
| `accessibility-i18n` | touch targets, labels, contrast, EN/RW/FR strings |

## Definition of done (per PR)

```bash
npx tsc --noEmit          # clean
npx eslint . --max-warnings 0
npx expo start            # screen renders on iOS + Android, no warnings
```

Plus: no file over 200 lines (`npx tsx scripts/check-line-limit.ts`), every list has
loading/empty/error states, every touchable has an accessible label, and no hardcoded
colours, fonts, durations or currency strings.

---

# Autonomous Mode protocol

When the kickoff prompt says "work autonomously per the Autonomous Mode protocol", you own
the build end to end. The owner is away. **Do not ask for permission, confirmation or
approval between phases.** Keep going until every phase in `PROGRESS.md` is ✅ or you hit
one of the four stop conditions below.

## Loop

For each phase, in the order listed in `PROGRESS.md`:

1. **Plan** — restate the phase scope in one line and list the files you will create.
2. **Build** — write the code. Read the matching skill first; read the matching prototype
   section before any screen.
3. **Verify** — run the gates. Fix everything they surface, then re-run until clean:
   ```bash
   npx tsc --noEmit
   npx eslint . --max-warnings 0
   npx tsx scripts/check-line-limit.ts     # fails if any file > 200 lines
   ```
   Never commit red. Never disable a rule or add `@ts-ignore` to make a gate pass — fix
   the code.
4. **Self-review** — re-read your own diff against the phase's skill checklist. Catch
   hardcoded tokens, missing accessibility labels, English literals outside `src/i18n`,
   files near the 200-line limit, and missing loading/empty/error states.
5. **Commit** — conventional commit, scoped to the phase:
   ```bash
   git add -A
   git commit -m "feat(phase-4): public and guest flow screens"
   git push origin feat/mobile-ui
   ```
6. **Log** — rewrite the phase's row and add its block to `PROGRESS.md` (built, gate
   results, decisions, deviations). Commit that too.
7. **Advance** — state "Phase N complete. Starting Phase N+1." and immediately begin.
   Do not wait for a reply. Do not summarise and stop.

If a gate keeps failing, try up to **three** different fixes. If it still fails, isolate
the failure behind a clearly-named file, log it under **Deferred / follow-up** in
`PROGRESS.md` with the error text, and move to the next phase — do not let one broken
file halt the run.

## Decide, don't block

When the design does not settle something, **decide and keep moving**. Do not open a
question tool and wait — nobody is there to answer, and a blocked run wastes the whole
session.

Apply this order:
1. Is it in `CLAUDE.md` or a skill? Follow it.
2. Is it in the prototype? Match the prototype — it wins over your instincts.
3. Does an existing screen solve the same problem? Copy that pattern.
4. Otherwise: pick the **most conservative** option (fewest new components, no new tokens,
   no new copy), implement it, and log it in **Decisions taken autonomously** with a
   one-line rationale so it can be reversed in minutes.

Budget roughly **30 seconds of deliberation** per open question. If you are still weighing
options past that, take option 4 and log it. A logged decision is always better than a
stalled build.

## The only four stop conditions

Stop, write the reason at the top of **Open questions for the owner** in `PROGRESS.md`,
commit, and end the run — only for these:

1. **Destructive or irreversible** — something outside the repo, a force push, a history
   rewrite, a published artifact, or deleting work you did not create.
2. **Secrets or money** — anything needing a real credential, API key, account or payment.
   (Should never happen: this build is fully mocked.)
3. **A contradiction you cannot resolve conservatively** — two sources of truth that
   genuinely conflict on a domain rule (not a visual detail), where guessing wrong would
   mean rebuilding several screens.
4. **Environment broken beyond three repair attempts** — the toolchain will not install or
   the app will not boot at all.

Everything else — naming, file splits, spacing, which component to extract, mock copy for
an unspecified field, animation curves, folder layout — you decide.

## Definition of done for the whole run

- Every phase row in `PROGRESS.md` is ✅ (or ⚠️ with a logged decision)
- All 51 screens exist, are reachable through real navigation, and render mock content
- No orphan screens, no dead ends, no `// TODO`, no `fetch`, no file over 200 lines
- `tsc`, `eslint` and the line-limit script are clean on the final commit
- Every commit is pushed to `feat/mobile-ui`
- `PROGRESS.md` reads as a complete account of what was built and what was decided

Finish with one short report: phases completed, screens built, decisions logged, anything
deferred.

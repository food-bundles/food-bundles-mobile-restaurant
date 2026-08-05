# PROGRESS.md — FoodBundles Restaurant (React Native)

Autonomous build log. **Claude Code owns this file** and rewrites it after every phase.
Keep it short enough to read in one screen per phase.

Repo state: branch `feat/mobile-ui`, base `main`.

---

## Status

| Phase | Scope | State | Commit |
|---|---|---|---|
| 1 | Foundation — scaffold, theme, lib, i18n, nav shell | ✅ | 30f29bf |
| 2 | Primitives + layout + icons | ⬜ | — |
| 3 | Mock data, stores, domain components | ⬜ | — |
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

## Decisions taken autonomously

Anything the design did not settle, that I decided rather than blocking on. Each needs a
one-line rationale so it can be reversed cheaply.

| # | Question | Decision | Rationale | Review |
|---|---|---|---|---|
| 0 | Premium subscription price — 50,000 (landing) vs 100,000 (in-app Plans) | **100,000 RWF/mo, 28,000 RWF/wk**; landing copy corrected to match | Confirmed by the product owner before the build started | settled |
| 1 | Tab bar needs icons before Phase 2 builds the real SVG icon set | Letter-glyph placeholders (S/O/W/V/M) in tokenised colour/type, no emoji, no icon font | Component-library skill assigns `src/components/icons` to Phase 2; blocking Phase 1 on the full icon set would stall the nav shell for no reason | reversible in Phase 2 |
| 2 | `npm ls` showed an invalid `ajv@6` vs `ajv@8` resolution (eslint wants 6, expo-router's `schema-utils`→`ajv-keywords` wants 8) that crashed `expo start` on `ajv/dist/compile/codegen` | Scoped `package.json` `overrides` to force `ajv@8` only inside `schema-utils`'s `ajv-keywords`, leaving eslint's own `ajv@6` untouched | A blanket `ajv` override (attempt 1) broke eslint itself (`ajv@6`-only API); scoping the override to the one subtree that needed it fixed `expo start` without regressing the lint gate | settled, verified both gates green after |

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
- **Tab bar icons are letter-glyph placeholders**, not the real SVG set — see Decision #1.
  Phase 2 replaces them with proper `react-native-svg` icons from `src/components/icons`.

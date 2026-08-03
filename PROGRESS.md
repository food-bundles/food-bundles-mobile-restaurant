# PROGRESS.md — FoodBundles Restaurant (React Native)

Autonomous build log. **Claude Code owns this file** and rewrites it after every phase.
Keep it short enough to read in one screen per phase.

Repo state: branch `feat/mobile-ui`, base `main`.

---

## Status

| Phase | Scope | State | Commit |
|---|---|---|---|
| 1 | Foundation — scaffold, theme, lib, i18n, nav shell | ⬜ not started | — |
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

## Decisions taken autonomously

Anything the design did not settle, that I decided rather than blocking on. Each needs a
one-line rationale so it can be reversed cheaply.

| # | Question | Decision | Rationale | Review |
|---|---|---|---|---|
| 0 | Premium subscription price — 50,000 (landing) vs 100,000 (in-app Plans) | **100,000 RWF/mo, 28,000 RWF/wk**; landing copy corrected to match | Confirmed by the product owner before the build started | settled |

---

## Open questions for the owner

Only things that genuinely blocked a phase. Empty is the goal.

- _none_

---

## Deferred / follow-up

Work deliberately left out of scope, with the reason.

- _none_

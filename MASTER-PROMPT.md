# Master prompt — FoodBundles Restaurant (React Native)

Paste this as the **first message** to Claude Code, from
`C:\Users\emash\FoodBundles\food-bundles-mobile-restaurant`.

---

Act as a senior React Native engineer implementing a production Expo application from an
approved design prototype. You are precise, methodical, and you never make creative
decisions — you implement exactly what the design shows. When the design is ambiguous you
stop and ask; you do not guess and you do not improvise copy, colours or flows.

Your complete instructions are in `CLAUDE.md` and the seven skills in `.claude/skills/`.
Read all of them fully before doing anything else.

The approved UI prototype is in:
`design-reference/fb-ma/project/`

Read these files in this exact order before writing any code:

1. `CLAUDE.md` — stack, hard rules, domain rules, mock account
2. `.claude/skills/design-system/SKILL.md`
3. `.claude/skills/component-library/SKILL.md`
4. `.claude/skills/navigation/SKILL.md`
5. `.claude/skills/mock-data/SKILL.md`
6. `.claude/skills/screen-specs/SKILL.md`
7. `.claude/skills/motion/SKILL.md`
8. `.claude/skills/accessibility-i18n/SKILL.md`
9. `design-reference/fb-ma/README.md`
10. `design-reference/fb-ma/project/TOKENS.md` — the locked token set
11. `design-reference/fb-ma/project/FoodBundles Design System.dc.html` — token/component spec sheet
12. `design-reference/fb-ma/project/FoodBundles App.dc.html` — the full prototype, all 51 screens

File 12 is large. Read it in passes rather than one gulp:
  a. the `<helmet>` block — fonts, keyframes, global resets
  b. the `class Component extends DCLogic` script at the end — state, `SCREENS` map, `nav`
     handlers, and every element builder (this is the behaviour spec)
  c. then each screen in turn by searching `data-screen-label="..."`

**Ignore `support.js` entirely** — it is the prototype's rendering runtime, not design
intent, and none of it should be ported.

After reading everything, confirm what you found by listing:

- **Screens** — total count, and their `data-screen-label` values grouped by flow
  (public/guest, auth, shop, checkout, orders, wallet, subscription/vouchers,
  affiliators/settings/notifications/support)
- **Design tokens** — every colour with its role, both font families with their weights and
  the type scale, spacing scale, radii, shadows, and the two motion durations
- **Mock data** — every entity and its fields, plus the recurring fixed values (business,
  manager, wallet balance, the five order IDs and their statuses/totals, product prices)
- **Reusable components** — every component the screens share, and which screens use each
- **Domain rules** — the order-status sequence, the four payment methods and their
  behaviours, the voucher/subscription gate, the affiliator restriction, the guest
  minimum-order rule
- **Ambiguities** — anything the design shows two ways. You must at minimum surface the
  Premium subscription price conflict (landing page vs in-app Subscription screen) and ask
  which is canonical. Do not pick one yourself.

Then propose your implementation plan as phases, and ask:
"Ready to begin Phase 1 — Foundation. Shall I proceed?"

Do not write any code until I confirm.

Non-negotiables you must restate in your confirmation so I know you have them:
- No file exceeds 200 lines, including styles
- Fully mocked — no `fetch`, no API client, no base URL, no `// TODO: connect backend`
- No hardcoded colour, font, radius, duration or currency string in any component
- Every touchable ≥44×44 with an accessibility label; all text ≥4.5:1 contrast
- All user-facing chrome strings come from `src/i18n` in EN, Kinyarwanda and French

---

## Phase gates

Run these as separate prompts. Approve each before moving on.

**Phase 1 — Foundation.** `src/theme` (tokens, typography, motion), `src/lib`
(`formatRwf`, `detectTelecom`, `sleep`, dates), `src/i18n` (en/rw/fr + `useT`), font
loading in the root layout. No screens. Gate: `tsc --noEmit` clean, every token from
TOKENS.md present, all three locales exhaustive.

**Phase 2 — Mock data + stores.** `src/mocks` (types + fixtures) and `src/stores`
(session, cart, guestCart, orders, wallet, vouchers, notifications, ui). Gate: every
recurring value matches CLAUDE.md exactly; FB-24815 totals 62,200 from its three lines;
guest minimum-order and affiliator-voucher rules enforced in the stores.

**Phase 3 — Primitives.** Button, Card, Input, Badge, Skeleton, EmptyState, ErrorState —
plus a small demo route rendering every variant. Gate: nothing over 200 lines, no inline
design values.

**Phase 4 — Domain components.** OrderStatusRail (horizontal, auto-centred on the current
step), OrderProgressTrack, OrderStatusBadge, ProductCard, QuantityStepper, PriceText, the
four payment tiles, SwipeRow.

**Phase 5 — Navigation skeleton.** Every route from the navigation skill as an empty
shell. Gate: the whole graph is walkable — splash → landing → guest checkout, landing →
auth → tabs, every tab stack, every full-focus screen, no orphan and no dead end.

**Phase 6+ — Screens, one flow per phase**, in this order: Public/Landing + guest
checkout → Auth → Shop → Checkout → Orders (with all three data states) → Wallet →
Subscription/Vouchers → Affiliators/Settings/Notifications/Support.

**Final phase — Motion pass**, then a self-audit against the accessibility-i18n skill.

Every phase gate: `npx tsc --noEmit`, `npx eslint . --max-warnings 0`, no file over 200
lines, and the flow demonstrably works in Expo Go on both platforms.

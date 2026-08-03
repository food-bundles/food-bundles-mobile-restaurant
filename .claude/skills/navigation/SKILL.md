---
name: navigation
description: Use when adding or changing routes, tab bars, stacks, modals, deep links or session guards with expo-router. Contains the full FoodBundles navigation graph — public/guest, auth, and the five-tab authenticated shell.
---

# Navigation (expo-router v3)

Three route groups. The tab bar exists **only** inside `(app)/(tabs)`. Full-focus screens
(checkout, OTP, confirmation, top-up, terms, underwriting, chat) hide it.

```
src/app/
  _layout.tsx                      # fonts, providers, gesture root, session gate
  (public)/
    landing.tsx                    # long scrolling public page — entry after splash
    guest/shop.tsx  guest/cart.tsx
    guest/delivery.tsx  guest/payment.tsx  guest/confirmation.tsx
    farmer-join.tsx
  (auth)/
    splash.tsx  login.tsx  signup.tsx  forgot-password.tsx
  (app)/
    (tabs)/
      _layout.tsx                  # Shop · Orders · Wallet · Vouchers · More
      index.tsx                    # Shop home
      orders.tsx  wallet.tsx  vouchers.tsx  more.tsx
    shop/category.tsx  shop/search.tsx  shop/product/[id].tsx  shop/cart.tsx
    checkout/delivery.tsx  checkout/payment.tsx  checkout/voucher.tsx
    checkout/otp.tsx  checkout/confirmation.tsx
    orders/[id].tsx  orders/reorder.tsx
    wallet/top-up.tsx  wallet/transactions.tsx
    subscription/current.tsx  subscription/plans.tsx
    subscription/terms.tsx  subscription/underwriting.tsx
    vouchers/credit-line.tsx
    affiliators/index.tsx  affiliators/add.tsx  affiliators/session.tsx
    settings/account.tsx  settings/business.tsx  settings/addresses.tsx
    settings/address/[id].tsx  settings/two-factor.tsx  settings/ebm.tsx  settings/help.tsx
    notifications/index.tsx  notifications/[orderId].tsx
    support/chat.tsx
```

## Flow contract

**Splash → Landing.** Splash auto-advances after ~1.7s (tappable to skip). Anyone without
a session lands on `(public)/landing`.

**Landing header:** large FoodBundles mark, a **Shop Now** primary CTA → `(public)/guest/shop`,
and a single person icon → `(auth)/login`. Those are the only two ways out of the header.

**Guest flow is real.** `guest/shop → guest/cart → guest/delivery → guest/payment →
guest/confirmation`. Payment offers Mobile Money and Card **only**. A non-blocking
"Create an account?" prompt appears in the cart and on confirmation.

**Abandoning auth** (back from login or signup) returns to `(public)/landing`, never to
splash.

**Successful login or signup** replaces the stack with `(app)/(tabs)` — public and auth
routes must not be reachable by back gesture from an authenticated session. Use
`router.replace`, and guard `(app)/_layout.tsx` on `sessionStore.isAuthenticated`.

**Tabs** each own a stack and remember their last position when you switch away and back.
Tapping the active tab pops its stack to root. Cross-fade between tabs; slide within a
stack.

**Vouchers tab** is always visible and tappable at every tier. With no subscription it
renders the locked/upgrade screen. Never disable, hide or grey the tab.

**Full-focus screens** present over the tab bar with a scale/fade, not a slide, and hide
the tab bar entirely: all `checkout/*`, `wallet/top-up`, `subscription/terms`,
`subscription/underwriting`, `support/chat`, `affiliators/session`.

**Confirmation exits forward**, never back through checkout: "Track order" →
`orders/[id]` with the Orders tab active; "Continue shopping" → tabs root with the cart
cleared.

**Deep links from notifications** open `notifications/[orderId]` or the related order —
wire `href` on each notification row.

## Tab bar

Five items: Shop, Orders, Wallet, Vouchers, More. Active item gets a `tintLeaf` pill
behind the icon and `leaf` icon + label; inactive is `muted`. Labels come from i18n
(`tab_shop`, `tab_orders`, `tab_wallet`, `tab_vouchers`, `tab_more`). Height respects
`useSafeAreaInsets().bottom`. Cart badge on Shop shows the live item count with a spring
bump on add.

## More hub

`More` is a menu, not a screen full of content: Subscription (shows the live plan label),
Affiliators (count), Notifications (unread dot), then Account & settings and Help. Every
row navigates — no dead rows.

## Rules

- Route files are thin: read stores, compose components, no business logic.
- Never navigate with string concatenation — use typed `Href` objects.
- Every non-root screen has a back affordance with `accessibilityLabel="Go back"`.
- Modal sheets (language picker, delivery window, support, EBM preview) are
  `presentation: 'formSheet'` or a Reanimated bottom sheet — not routes, unless they need
  a URL.
- No screen is an orphan: if nothing routes to it, delete it.

---
name: screen-specs
description: Use when implementing any specific screen. Lists all 51 screens in the approved prototype with what each must contain, so nothing is invented and nothing is missed. Read the matching HTML section in design-reference/fb-ma/project/FoodBundles App.dc.html before building.
---

# Screen specs

51 screens. Open `design-reference/fb-ma/project/FoodBundles App.dc.html` and find the
matching `data-screen-label` before building — it carries the exact copy, order and
spacing. Do not invent sections, and do not drop any listed here.

## Public (pre-auth)

**Landing** — one long scroll. Header: large FoodBundles mark, `Shop Now` CTA, single
person icon → Login. Then, in order: full-bleed chef hero with "Fresh Quality Ingredients
From Our Farm", subhead and a `Same Day Delivery` badge → auto-scrolling restaurant
marquee (12 chips, doubled and looped) → **Voucher & Subscribe** (Basic 20,000 / Premium —
see the price question in CLAUDE.md) → **Connect to our farm** with photo and three stat
cards that count up when scrolled into view (24/7, 99%, 50+) → **Get Support** (both
emails, phone, KG 5 Ave, call centre 6054, emergency line, contact form, "Chat with our
Agent" → support chat) → **Our Farms** auto-advancing carousel with dot override →
farmer recruitment band with `Join Now` → footer (blurb, Quick Links, contact, copyright).

**Guest Shop** — back, title, basket icon with live count, person icon → Login. Persistent
banner: "Shopping as Guest — minimum order 100,000 RWF. Orders below this amount will have
an additional delivery fee applied." Six category chips (All / Animal Products / Fresh
Fruits / Fresh Vegetables / Others / Discounted). Two-per-row product grid with star
ratings, discount badges and working steppers. Sticky footer: item count, running total,
`View basket`.

**Guest Cart** — swipe-to-delete rows with steppers, totals card (subtotal, small-order fee
when under minimum, total), non-blocking "Create an account?" prompt, `Checkout as guest`.

**Guest Delivery** — step 1 of 2. Manual entry only (contact name, phone, street, landmark)
— no saved addresses — plus the delivery-window picker, and a note that guest orders are
not saved to an address book.

**Guest Payment** — step 2 of 2. Totals, then **Mobile Money** and **Card** tiles only,
plus a note that wallet and vouchers need an account. `Pay <total>` → processing → confirm.

**Guest Confirmation** — animated check draw-in, "Order placed", reference **FB-G-4471**,
dark total card, delivery window, convert prompt, `Continue browsing`.

**Farmer Join** — Pine intro card, name / phone / district / crops fields, submit note
("a field officer calls within two working days").

## Auth

**Splash** (Pine, logo, progress, auto-advance) · **Login** (email, password with Show,
Forgot password, Log in, Create a business account) · **Signup** (business name,
Restaurant/Hotel toggle, phone, **optional TIN** with the EBM helper note, staff-added-later
note) · **Forgot password** (email, send reset link, in-voice confirmation, back to login).

## Shop

**Shop Home** — restaurant photo + name + "Ordering for", weather-aware greeting,
notification bell with unread badge, cart icon. One **auto-rotating carousel band**
(uniform 142px, dot indicators, 2.5s, pause on interaction) cycling: active order → wallet
→ vouchers/upsell → repayment (subscribed only) → weekly deal → market prices → weather.
Each card taps through to its full screen and has its own entrance motion. Then category
chips, then the two-per-row product grid. Floating `Ask for support`.

**Category** — back, title, product count, working price sort, two-per-row grid.
**Search** — focused field, results, recent chips. **Product detail** — hero photo, name,
unit, role price with "Your Restaurant price", stock + next-day chips, description,
quantity stepper, subtotal and `Add to cart`. **Cart** — swipe-to-delete rows with live
steppers, reactive totals, `Checkout`.

## Checkout (full-focus)

**Delivery** — styled Kigali map with Marigold pin, accuracy radius, "Use current
location", "Drag pin to adjust"; saved address card, add-another, manual-entry toggle,
delivery-window picker; `Continue to payment`. **Payment** — order total, the four tiles
(merged Mobile Money with telecom detection, merged Card, wallet, voucher), then an
**"Items in this order"** card at the bottom; `Pay <total>`. **Voucher step** — credit
maths and OTP notice. **OTP** — six boxes, resend timer, `Verify & pay`. **Confirmation** —
check draw-in, dark big-price card, line items, `Track order` / `Continue shopping`.

## Orders

**List** — demo-state control (live/loading/empty/error), active-order card, filter chips,
pull-to-refresh, order cards with `OrderProgressTrack`. Plus **Loading** (shimmer),
**Empty** (specific + Browse produce) and **Error** (explains + retry) variants.
**Detail** — id + status badge, **horizontal scrollable rail auto-centred on the current
step**, delivery/window/total card, items with thumbnails, `Download EBM` (opens preview
sheet) and `Payment history`, reorder, contact support. **Reorder** — photo rows,
out-of-stock line, `Add N items to cart`.

## Wallet

**Balance** — Pine balance card, Top up / History, recent activity. **Top-up** —
**manually typed amount** (numeric input, thousands-separated) plus quick-amount chips,
merged Mobile Money + Card tiles, phone row, Share link and Ask accountant sheets, CTA
reflecting the typed amount. **Transactions** — filter chips; order-linked rows open that
order.

## Subscription & vouchers

**Current plan** (live tier label, billing line, included list, upgrade prompt) ·
**Plans** (weekly/monthly toggle, Basic and Premium cards) · **Terms** (must expand and
accept before a first upgrade) · **Underwriting** (TIN, reason, first-time, frequency,
repayment duration → OTP → completed state) · **Vouchers Locked** (upgrade prompt, never
an empty list) · **Vouchers Active** (credit line with its **own** Active/Repayment-due
label — not `OrderStatusBadge`, use at checkout, apply for more, next settlement) ·
**Credit line** (adjust amount within the approved limit → OTP → visible approval).

## Affiliators, settings, notifications, support

**Affiliators list** (staff with status, add, preview staff view) · **Add affiliator**
(photo upload, name, email/credentials, role, phone, permissions with vouchers off by
default and an explanation) · **Affiliator session** (staff view with the persistent
"Ordering as Kigali Bistro" banner, wallet allowed, **voucher tile visibly restricted**) ·
**Account** (profile, business details, addresses, EBM, messages, 2FA, language, log out) ·
**Business details** · **Delivery addresses** + **Edit address** · **EBM invoices** (list
with preview → download) · **2FA setup** (QR, secret, code field) · **Help centre** ·
**Notifications** (thumbnail, deep link, reply/acknowledge) · **Order feed** (per-order
timeline) · **AI Support chat** (bubbles, suggested chips, composer).

## Every screen

Safe-area aware · one visible screen at a time · loading/empty/error where data exists ·
44px minimum targets · i18n strings for all chrome · no invented copy.

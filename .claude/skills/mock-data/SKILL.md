---
name: mock-data
description: Use when defining data types, mock fixtures, zustand stores, simulated async, currency formatting or telecom detection. Enforces the fully-mocked rule — no backend, no API client, no TODOs — and the exact domain enums and recurring mock values.
---

# Mock data layer

The app ships **fully mocked and production-ready**. There is no server, no API client,
no environment variable pointing anywhere, and no `// TODO: wire backend`. Reviewers
should be able to run the app offline and exercise every flow.

## Simulated async

```ts
// src/lib/sleep.ts
export const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
```

Stores expose `status: 'idle' | 'loading' | 'ready' | 'error'` and mutate it around a
`sleep(600–1200)`. Payment "processing" is `sleep(1300)`. Never fake latency inside a
component.

Provide a deliberate error path per domain (e.g. `ordersStore.simulateFailure()`), used by
the Orders demo-state control so loading / empty / error are all reachable in the build.

## Types — `src/mocks/types.ts`

```ts
export type OrderStatus =
  | 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'IN_TRANSIT' | 'DELIVERED'
  | 'CANCELLED' | 'REFUNDED';                    // last two are terminal, badge-only

export const ORDER_STEPS = [
  'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'IN_TRANSIT', 'DELIVERED',
] as const;                                       // exactly six, this order

export type PaymentMethod = 'CASH' | 'MOBILE_MONEY' | 'CARD' | 'VOUCHER';
export type Telecom = 'MTN' | 'AIRTEL';
export type Tier = 'NONE' | 'BASIC' | 'PREMIUM';
export type BillingCycle = 'WEEKLY' | 'MONTHLY';
export type Role = 'RESTAURANT' | 'HOTEL' | 'AFFILIATOR';
export type ProductCategory =
  | 'ANIMAL_PRODUCTS' | 'FRESH_FRUITS' | 'FRESH_VEGETABLES' | 'OTHERS' | 'DISCOUNTED';

export interface Product {
  id: string; name: string; unit: string; price: number;   // RWF, integer
  wasPrice?: number; rating: number; category: ProductCategory; image: ImageSourcePropType;
}
export interface OrderLine { productId: string; name: string; unit: string; qty: number; each: number; }
export interface Order {
  id: string; placedAt: string; status: OrderStatus; step: number;   // 0 when terminal
  lines: OrderLine[]; subtotal: number; deliveryFee: number; total: number;
  method: PaymentMethod; window: string; address: string; ebmAvailable: boolean;
}
```

## Money + telecom — `src/lib`

```ts
export const formatRwf = (n: number) =>
  `${Math.round(n).toLocaleString('en-US')} RWF`;   // no decimals, always separated

export const detectTelecom = (phone: string): Telecom => {
  const p = phone.replace(/\D/g, '').slice(3, 5);   // after +250
  return p === '72' || p === '73' ? 'AIRTEL' : 'MTN';
};
```

`formatRwf` is the only place a currency string is built. `detectTelecom` drives which
logo highlights on the single Mobile Money tile.

## Recurring mock values (must match across every screen)

- Business **Kigali Bistro**, manager **Aline Uwase**, `orders@kigalibistro.rw`,
  `+250 788 123 456`, alternate Airtel number `+250 730 112 233`, TIN `102 938 471`,
  KG 11 Ave, Kimihurura, Kigali.
- Wallet balance **1,240,000 RWF**. Credit line 300,000 with 120,000 used, due 31 Aug.
- Orders: **FB-24815** In transit 62,200 · **FB-24790** Delivered 48,900 ·
  **FB-24762** Preparing 19,400 · **FB-24801** Pending 21,300 ·
  **FB-24755** Cancelled 31,600 · guest **FB-G-4471**.
- FB-24815 lines: Irish Potatoes 10 kg ×2 = 25,000 · Fresh Tomatoes 5 kg crate ×3 =
  24,600 · Red Onions 10 kg ×1 = 9,600 → subtotal 59,200 + 3,000 delivery = **62,200**.
  These numbers appear on cart, payment, confirmation, order detail and EBM — keep them
  consistent.
- Products (RWF): Irish Potatoes 12,500 · Fresh Tomatoes 8,200 · Red Onions 9,600 ·
  Cabbage 4,200 (discounted 3,800) · Spinach 3,900 · Green Beans 6,800 · Carrots 5,400 ·
  Eggs tray of 30 9,800 · Fresh Milk 5 L 6,500 · Bananas 10 kg 7,400 · Rice 25 kg 32,000 ·
  Cooking Oil 20 L 41,000 · Avocados crate of 40 8,900 (was 10,400).
- Farms: Kinyinya (Vegetables), Musanze (Vegetables), Nasho (Fresh Fruits).
- Public landing stats: 240+ restaurants, 18 cooperatives, 24/7 delivery, 99% fulfilled,
  50+ restaurants served. Support: sales@food.rw, info@food.rw, +250 796 897 823,
  KG 5 Ave Kigali, call centre 6054.
- Restaurant marquee: Imboni, Laza, Mr Chip's, Tugende Hostel, Food & Stuff, Sole Luna,
  Petit Marché, Simple by Inki, Ewaka, Bicu Lounge, Mukati na Butta, Country Roots.

## Stores — `src/stores`

One slice per domain, each under 200 lines: `sessionStore` (role, tier, subscribed,
`canRequestVouchers`), `cartStore`, `guestCartStore`, `ordersStore`, `walletStore`,
`vouchersStore`, `notificationsStore`, `uiStore` (language, sheets, demo state).

Business rules live in stores, not components:

- `guestCartStore` — minimum order **100,000 RWF**; below it add a **5,000** small-order
  delivery fee as a visible line. Never block checkout.
- `guestCartStore.allowedMethods` returns `['MOBILE_MONEY', 'CARD']` only.
- `vouchersStore.isUnlocked = sessionStore.tier !== 'NONE'`.
- `sessionStore.canRequestVouchers = role !== 'AFFILIATOR'` — affiliators do everything
  else a restaurant can. Enforce in the store; the UI reflects it.
- `walletStore.topUp(amount)` accepts a **manually typed** amount (clamped 0–5,000,000)
  as well as the quick-amount chips.
- Credit approval raises the rendered limit and surfaces a confirmation state — approval
  must be visible, not just stored.

## Forbidden

`fetch` · `axios` · `XMLHttpRequest` · `process.env.API_*` · `expo-constants` API URLs ·
`// TODO`, `// FIXME`, `// mock for now` · `console.log` · unused exports · lorem ipsum ·
random data that changes between renders (seed it).

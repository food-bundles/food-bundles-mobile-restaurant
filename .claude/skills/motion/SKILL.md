---
name: motion
description: Use when adding any transition, gesture, animated feedback or looping animation with react-native-reanimated. Contains the two-duration motion contract, the per-card carousel entrances and the gesture specs for swipe-to-delete and drag-to-dismiss.
---

# Motion

One motion language across the app. Purposeful only: every animation communicates state
or acknowledges input. No parallax for its own sake, no elastic overshoot except the two
sanctioned springs, no motion on decorative elements.

## `src/theme/motion.ts`

```ts
import { Easing } from 'react-native-reanimated';

export const duration = {
  nav: 380,      // stack push/pop, full-focus present, bottom sheets
  overlay: 300,  // tab cross-fade, pull-to-refresh, opacity/background states
  press: 120,    // touch feedback
  tint: 150,     // border/background colour change on selection
} as const;

export const easing = {
  standard: Easing.bezier(0.33, 0.7, 0, 1),      // everything
  spring:   Easing.bezier(0.34, 1.56, 0.64, 1),  // cart badge bump + confirmation check
} as const;
```

**Two durations only.** If a value is not `nav` or `overlay` (or the micro `press`/`tint`),
it does not belong. Easing is `standard` everywhere; `spring` is reserved for exactly two
moments.

## Screen transitions

| Move | Motion |
|---|---|
| Stack push / pop | Slide from right / back, `nav`, `standard` |
| Full-focus present | Scale 0.965 → 1 with fade, `nav` |
| Tab switch | Cross-fade, `overlay` — never a slide |
| Bottom sheet | Translate from below, `nav`; scrim fades `overlay` |

Configure in `expo-router` `Stack.Screen` options; do not hand-roll per screen.

## Micro-interactions

- **Press** — buttons and cards scale to 0.98 (small icon buttons 0.92 / 0.9) over `press`.
  Use `Pressable` with a Reanimated shared value, not `activeOpacity`.
- **Selection** — payment/plan tile borders animate over `tint`.
- **Cart badge** — spring bump to 1.42 and back over ~280ms on add, using `easing.spring`.
- **Skeleton** — continuous gradient sweep, ~1.4s linear, looping. Only mounted while the
  loading state is showing; unmount it otherwise so nothing animates off-screen.

## Signature motion

- **OrderStatusRail current step** — a soft breathing pulse: a Marigold ring scaling
  1 → 2.2 while fading out, 2s loop, `Easing.out`. This is the app's recognisable moment;
  keep it and don't let anything else compete with it.
- **Confirmation success** — the check path draws in (`strokeDashoffset`) after a 250ms
  delay while the disc pops with `easing.spring`. Restrained, celebratory, no confetti.

## Home carousel

Advance every **2500ms**. Pause permanently on any interaction (dot tap or card touch).
Cards mount on activation so their entrance replays every cycle. Uniform height — motion
differentiates card types, never height:

| Card | Entrance |
|---|---|
| Active order | Progress bar wipes in (`clip-path`/width, 800ms, 120ms delay) |
| Wallet | Balance figure counts up (~700ms, cubic ease-out) |
| Vouchers / upsell | Marigold shimmer sweep across the card (1.1s) |
| Weekly deal | Slow Ken Burns photo zoom (1 → 1.13 over 9s) while visible |
| Market prices | Each price figure counts up, staggered ~90ms |
| Weather | Sun rotation re-plays on activation (9s linear loop) |

The whole band fades + rises 7px on change (`nav`), so rotation reads as one component.

## Landing motion

- **Restaurant marquee** — duplicate the chip list and translate X from 0 to −50% over
  30s linear, looping; edges masked. Pure CSS-equivalent transform, no JS per frame.
- **Farm carousel** — auto-advance every 3800ms, dot taps take over permanently. Active
  card fades/rises and its photo runs the same Ken Burns zoom.
- **Stat count-ups** — trigger on scroll into view (~35% visible) using `onLayout` +
  scroll offset or an in-view hook, once per mount. Never animate off-screen numbers.

## Gestures (`react-native-gesture-handler`)

- **SwipeRow (cart rows)** — `Pan` on X, clamped `-104…0`. Past `-58` on release, fire
  `onDelete`; otherwise spring home over `nav`. A red Remove action sits underneath and is
  also a real button, so the action stays reachable without the gesture. `activeOffsetX`
  prevents fighting the vertical scroll.
- **Sign-in nudge** — `Pan` on Y, clamped to +16 downward; release past `-24` dismisses.
  Keeps its 4.2s auto-hide as well.
- **Pull-to-refresh (orders)** — only engages at `scrollTop <= 0`; content translates by
  half the drag, capped at 74px; past 46px on release triggers the refresh, spinner rotates
  with drag then spins continuously.
- **Map pin** — draggable affordance is mocked; show the hint and let the pin follow a pan
  within the map bounds.

## Performance

- Animate `transform` and `opacity` only. Never animate layout properties.
- Every animated value is a `useSharedValue`; drive through `useAnimatedStyle`.
- Cancel timers, intervals and `withRepeat` loops in cleanup — an interval that keeps
  ticking on an unmounted screen is a defect.
- Pause intervals when the screen is not focused (`useIsFocused`).
- `reduceMotion`: respect `AccessibilityInfo.isReduceMotionEnabled()` — drop looping
  decorative motion (marquee, Ken Burns, sun) and keep functional transitions.

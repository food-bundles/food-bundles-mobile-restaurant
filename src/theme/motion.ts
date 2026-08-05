import { Easing } from 'react-native-reanimated';

export const duration = {
  nav: 380,
  overlay: 300,
  press: 120,
  tint: 150,
} as const;

export const easing = {
  standard: Easing.bezier(0.33, 0.7, 0, 1),
  spring: Easing.bezier(0.34, 1.56, 0.64, 1),
} as const;

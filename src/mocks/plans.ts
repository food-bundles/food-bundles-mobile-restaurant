import type { Plan } from './types';

export const plans: Plan[] = [
  {
    id: 'BASIC',
    name: 'Basic',
    monthly: 20000,
    weekly: 6000,
    features: [
      'FoodBundles market + 2 more markets',
      'Standard delivery',
      'WhatsApp-only support',
      'Fixed voucher limit',
    ],
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    monthly: 100000,
    weekly: 28000,
    features: [
      'All markets + price comparison',
      'Free delivery',
      'Direct AI-call support',
      'Negotiable voucher limit',
    ],
  },
];

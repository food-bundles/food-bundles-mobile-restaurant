import type { ImageSourcePropType } from 'react-native';
import type { Telecom } from '@/lib';

export type { Telecom };

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export const ORDER_STEPS = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'IN_TRANSIT',
  'DELIVERED',
] as const;

export type PaymentMethod = 'CASH' | 'MOBILE_MONEY' | 'CARD' | 'VOUCHER';
export type Tier = 'NONE' | 'BASIC' | 'PREMIUM';
export type BillingCycle = 'WEEKLY' | 'MONTHLY';
export type Role = 'RESTAURANT' | 'HOTEL' | 'AFFILIATOR';
export type ProductCategory =
  | 'ANIMAL_PRODUCTS'
  | 'FRESH_FRUITS'
  | 'FRESH_VEGETABLES'
  | 'OTHERS'
  | 'DISCOUNTED';

export interface Product {
  id: string;
  name: string;
  unit: string;
  price: number;
  wasPrice?: number;
  rating: number;
  category: ProductCategory;
  image: ImageSourcePropType;
}

export interface OrderLine {
  productId: string;
  name: string;
  unit: string;
  qty: number;
  each: number;
}

export interface Order {
  id: string;
  placedAt: string;
  status: OrderStatus;
  step: number;
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  method: PaymentMethod;
  window: string;
  address: string;
  ebmAvailable: boolean;
}

export interface Transaction {
  id: string;
  type: 'TOP_UP' | 'PAYMENT' | 'REFUND';
  amount: number;
  date: string;
  orderId?: string;
  note: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  orderId?: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  landmark?: string;
  phone: string;
  isDefault: boolean;
}

export type AffiliatorStatus = 'ACTIVE' | 'INVITED';

export interface Affiliator {
  id: string;
  name: string;
  role: string;
  status: AffiliatorStatus;
}

export interface Farm {
  id: string;
  name: string;
  category: ProductCategory;
}

export interface Plan {
  id: Exclude<Tier, 'NONE'>;
  name: string;
  monthly: number;
  weekly: number;
  features: string[];
}

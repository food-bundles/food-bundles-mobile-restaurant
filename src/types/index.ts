/**
 * Canonical domain types for the FoodBundles mobile restaurant app.
 * All stores, API layers, components, and screens should import from '@/types'.
 * Chat runtime types (ChatMessage, Conversation, CallKind…) live in '@/api/chat.api'.
 * Market runtime types (CommodityId, OhlcDay…) live in '@/api/market.api'.
 */
import type { ImageSourcePropType } from 'react-native';
import type { Telecom } from '@/lib';

export type { Telecom };

// ─── Orders ──────────────────────────────────────────────────────────────────

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

export interface OrderLine {
  productId: string;
  name: string;
  unit: string;
  qty: number;
  each: number;
  pricePerUnitAtOrderTime?: number;
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

// ─── Products ─────────────────────────────────────────────────────────────────

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

// ─── Wallet ───────────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  type: 'TOP_UP' | 'PAYMENT' | 'REFUND';
  amount: number;
  date: string;
  orderId?: string;
  note: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationChannel =
  | 'order'
  | 'wallet'
  | 'voucher'
  | 'marketPrice'
  | 'priceAlert'
  | 'consent'
  | 'repayment'
  | 'system';

export interface AppNotification {
  id: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  imageUri?: string;
  deepLink?: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
}

// ─── Addresses ────────────────────────────────────────────────────────────────

export interface Address {
  id: string;
  label: string;
  street: string;
  landmark?: string;
  phone: string;
  isDefault: boolean;
}

// ─── Affiliators ──────────────────────────────────────────────────────────────

export type AffiliatorStatus = 'ACTIVE' | 'INVITED';

export interface AffiliatorOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface Affiliator {
  id: string;
  name: string;
  role: string;
  status: AffiliatorStatus;
  phone?: string;
  email?: string;
  createdAt?: string;
  orders?: AffiliatorOrder[];
  conversationId?: string;
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export type Tier = 'NONE' | 'BASIC' | 'STANDARD' | 'PREMIUM';
export type BillingCycle = 'WEEKLY' | 'MONTHLY';

export interface Plan {
  id: Exclude<Tier, 'NONE'>;
  name: string;
  monthly: number;
  weekly: number;
  features: string[];
  voucherAccess?: boolean;
  freeDelivery?: boolean;
  stablePricing?: boolean;
  receiveEBM?: boolean;
  advertisingAccess?: boolean;
}

// ─── Vouchers ─────────────────────────────────────────────────────────────────

export type VoucherStatus = 'AVAILABLE' | 'USED' | 'EXPIRED';

export interface Voucher {
  id: string;
  code: string;
  amount: number;
  status: VoucherStatus;
  issuedAt: string;
  expiresAt: string;
  usedAt?: string;
  orderId?: string;
}

// ─── Auth / Session ───────────────────────────────────────────────────────────

export type Role = 'RESTAURANT' | 'HOTEL' | 'AFFILIATOR';

// ─── Data Consent / Credit ────────────────────────────────────────────────────

export type DataConsentSource = 'eucl' | 'rra' | 'vubaVuba' | 'kayko' | 'foodbundles' | 'creditBureau';

export interface DataConsent {
  source: DataConsentSource;
  granted: boolean;
  grantedAt: string | null;
  expiresAt: string | null;
}

export type CreditTier = 'A' | 'B' | 'C' | 'D';

export interface ScoreContribution {
  source: DataConsentSource;
  weight: number;
  contribution: number;
}

export interface CreditScore {
  tier: CreditTier;
  limitRwf: number;
  scoreBreakdown: ScoreContribution[];
}

// ─── Menu Planning ────────────────────────────────────────────────────────────

export type CuisineType = 'AFRICAN' | 'INDIAN' | 'WESTERN' | 'ASIAN' | 'MEDITERRANEAN' | 'FUSION';
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'ALL_DAY';

export interface MenuIngredient {
  productId: string;
  qty: number;
}

export interface MenuDish {
  id: string;
  name: string;
  cuisine: CuisineType;
  mealTypes: MealType[];
  source: string;
  ingredients: MenuIngredient[];
  image: ImageSourcePropType;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export type MessageKind = 'text' | 'voice' | 'file' | 'image';

export interface ChatMessage {
  id: string;
  senderId: string;
  kind: MessageKind;
  body: string;
  attachment?: string;
  durationMs?: number;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
}

export type ConversationKind = 'support' | 'peer';

export interface Conversation {
  id: string;
  kind: ConversationKind;
  participantIds: string[];
  lastMessage: ChatMessage;
  unreadCount: number;
}

export type CallKind = 'audio' | 'video';
export type CallState = 'ringing' | 'connecting' | 'active' | 'ended';

export interface CallSession {
  id: string;
  conversationId: string;
  kind: CallKind;
  state: CallState;
  startedAt: string;
  endedAt?: string;
}

import { create } from 'zustand';

export interface GuestDeliveryInfo {
  name: string;
  phone: string;
  street: string;
  landmark: string;
  windowIndex: number;
}

interface GuestDeliveryState extends GuestDeliveryInfo {
  set: (info: GuestDeliveryInfo) => void;
  clear: () => void;
}

const DEFAULT: GuestDeliveryInfo = { name: '', phone: '', street: '', landmark: '', windowIndex: 0 };

export const useGuestDeliveryStore = create<GuestDeliveryState>((set) => ({
  ...DEFAULT,
  set: (info) => set(info),
  clear: () => set(DEFAULT),
}));

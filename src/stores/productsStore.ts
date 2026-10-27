import { create } from "zustand";
import type { Product } from "@/types";
import { getProductsApi, getProductByIdApi } from "@/api/products.api";

export type AsyncStatus = "idle" | "loading" | "ready" | "error";

interface ProductsState {
  status: AsyncStatus;
  error: string | null;
  products: Product[];
  fetch: (params?: {
    categoryId?: string;
    search?: string;
    page?: number;
  }) => Promise<void>;
  getById: (productId: string) => Promise<Product | null>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  status: "idle",
  error: null,
  products: [],

  fetch: async (params) => {
    set({ status: "loading", error: null });
    try {
      const result = await getProductsApi({ limit: 100, ...params });
      set({ status: "ready", products: result.products });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error('[productsStore] fetch failed:', message);
      set({ status: "error", products: [], error: message });
    }
  },

  getById: async (productId) => {
    const local = get().products.find((p) => p.id === productId);
    if (local) return local;
    try {
      return await getProductByIdApi(productId);
    } catch (e) {
      console.error('[productsStore] getById failed:', e instanceof Error ? e.message : String(e));
      return null;
    }
  },
}));

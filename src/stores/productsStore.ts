import { create } from "zustand";
import type { Product } from "@/mocks/types";
import { getProductsApi, getProductByIdApi } from "@/api/products.api";

export type AsyncStatus = "idle" | "loading" | "ready" | "error";

interface ProductsState {
  status: AsyncStatus;
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
  products: [],

  fetch: async (params) => {
    set({ status: "loading" });
    try {
      const result = await getProductsApi({ limit: 100, ...params });
      set({ status: "ready", products: result.products });
    } catch {
      set({ status: "error", products: [] });
    }
  },

  getById: async (productId) => {
    const local = get().products.find((p) => p.id === productId);
    if (local) return local;
    try {
      return await getProductByIdApi(productId);
    } catch {
      return null;
    }
  },
}));

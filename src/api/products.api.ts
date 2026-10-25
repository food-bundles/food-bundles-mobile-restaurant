import { request } from './client';
import type { Product, ProductCategory } from '@/mocks/types';

interface ApiProduct {
  id: string;
  productName: string;
  unitPrice: number;
  discountedPrice: number | null;
  bonus: number;
  unit: string;
  quantity: number;
  images: string[];
  category: { id: string; name: string };
  latestMarketPrices: { marketPrice: number; recordedDate: string; market: { id: string; name: string } }[];
}

interface ProductsResponse {
  data: ApiProduct[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

/** Maps backend category name to the mobile ProductCategory enum. */
function mapCategory(name: string): ProductCategory {
  const n = name.toUpperCase();
  if (n.includes('VEGETABLE') || n.includes('ROOT')) return 'FRESH_VEGETABLES';
  if (n.includes('FRUIT')) return 'FRESH_FRUITS';
  if (n.includes('ANIMAL') || n.includes('DAIRY') || n.includes('EGG') || n.includes('MEAT')) return 'ANIMAL_PRODUCTS';
  return 'OTHERS';
}

function toMobileProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.productName,
    unit: p.unit,
    price: p.discountedPrice ?? p.unitPrice,
    wasPrice: p.discountedPrice ? p.unitPrice : undefined,
    rating: 4.5,
    category: mapCategory(p.category?.name ?? ''),
    image: p.images?.[0] ? { uri: p.images[0] } : require('@/mocks/productImages').PRODUCT_IMAGES.irishPotatoes,
  };
}

export async function getProductsApi(params?: {
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
  const res = await request<ProductsResponse>('/products', { params: params as any });
  return {
    products: res.data.map(toMobileProduct),
    total: res.pagination.total,
    page: res.pagination.page,
    totalPages: res.pagination.totalPages,
  };
}

export async function getProductByIdApi(productId: string): Promise<Product> {
  const res = await request<{ data: ApiProduct }>(`/products/${productId}`);
  return toMobileProduct(res.data);
}

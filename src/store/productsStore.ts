import { create } from "zustand";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  weight: number;
  dimensions: { width: number; height: number; depth: number };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
}

interface ProductsState {
  // List state
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  searchQuery: string;
  selectedCategory: string;

  // Categories
  categories: string[];
  categoriesLoaded: boolean;

  // Single product
  currentProduct: Product | null;
  productLoading: boolean;
  productError: string | null;

  /*
   * In-memory cache: keyed by a string like "page:0|size:12|q:|cat:"
   * This avoids re-fetching the same page when the user navigates back,
   * changes tabs, or hits pagination multiple times. It's intentionally
   * kept in Zustand (not localStorage) because product data changes often
   * enough that we don't want stale data surviving across sessions.
   */
  listCache: Record<string, { products: Product[]; total: number }>;

  // Actions
  fetchProducts: (page: number, size: number, query: string, category: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProduct: (id: number) => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (query: string) => void;
  setCategory: (category: string) => void;
}

function cacheKey(page: number, size: number, query: string, category: string) {
  return `p:${page}|s:${size}|q:${query}|c:${category}`;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  total: 0,
  loading: false,
  error: null,
  page: 0,
  pageSize: 12,
  searchQuery: "",
  selectedCategory: "",
  categories: [],
  categoriesLoaded: false,
  currentProduct: null,
  productLoading: false,
  productError: null,
  listCache: {},

  setPage: (page) => {
    set({ page });
    const { pageSize, searchQuery, selectedCategory } = get();
    get().fetchProducts(page, pageSize, searchQuery, selectedCategory);
  },

  setSearch: (query) => {
    // Reset page and category when searching by text
    set({ searchQuery: query, page: 0, selectedCategory: "" });
    const { pageSize } = get();
    get().fetchProducts(0, pageSize, query, "");
  },

  setCategory: (category) => {
    // Reset page and search when filtering by category
    set({ selectedCategory: category, page: 0, searchQuery: "" });
    const { pageSize } = get();
    get().fetchProducts(0, pageSize, "", category);
  },

  fetchProducts: async (page, size, query, category) => {
    const key = cacheKey(page, size, query, category);
    const cached = get().listCache[key];

    // Return cached result immediately — no spinner needed for cached pages
    if (cached) {
      set({ products: cached.products, total: cached.total });
      return;
    }

    set({ loading: true, error: null });

    try {
      const skip = page * size;
      let url: string;

      if (query) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=${size}&skip=${skip}`;
      } else if (category) {
        // Category endpoint doesn't support skip natively at the category level,
        // so we fetch with limit/skip appended and fall back gracefully
        url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${size}&skip=${skip}`;
      } else {
        url = `https://dummyjson.com/products?limit=${size}&skip=${skip}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      const result = { products: data.products, total: data.total };

      // Store in cache and update state
      set((state) => ({
        ...result,
        loading: false,
        listCache: { ...state.listCache, [key]: result },
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Something went wrong",
        loading: false,
      });
    }
  },

  fetchCategories: async () => {
    if (get().categoriesLoaded) return;

    try {
      const res = await fetch("https://dummyjson.com/products/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      // API returns array of { slug, name, url } objects
      const names = data.map((c: { slug: string; name: string }) => c.slug);
      set({ categories: names, categoriesLoaded: true });
    } catch {
      // Categories failing shouldn't break the page — just skip the filter
    }
  },

  fetchProduct: async (id) => {
    set({ productLoading: true, productError: null, currentProduct: null });
    try {
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      const data = await res.json();
      set({ currentProduct: data, productLoading: false });
    } catch (err) {
      set({
        productError: err instanceof Error ? err.message : "Failed to load product",
        productLoading: false,
      });
    }
  },
}));

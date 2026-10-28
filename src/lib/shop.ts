import { productById, products } from "../data/products";
import type { Category, Product, Scene } from "../data/products";

export const MAX_QUANTITY = 20;
export const STORAGE_KEY = "cozy-corner-cart-v1";
export const money = (fen: number) =>
  new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(fen / 100);
export type Cart = { id: string; quantity: number }[];
export type CartAction =
  | { type: "add"; id: string; quantity: number }
  | { type: "quantity"; id: string; quantity: number }
  | { type: "remove"; id: string }
  | { type: "restore"; id: string; quantity: number };
export type Sort = "featured" | "price-asc" | "price-desc";
export type Filters = {
  query: string;
  category: Category;
  scene: Scene;
  sort: Sort;
};
export const defaultFilters: Filters = {
  query: "",
  category: "全部好物",
  scene: "all",
  sort: "featured",
};

export function validCart(raw: unknown): Cart {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  return raw.flatMap((item) => {
    if (
      !item ||
      typeof item !== "object" ||
      typeof item.id !== "string" ||
      !productById.has(item.id) ||
      seen.has(item.id) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > MAX_QUANTITY
    )
      return [];
    seen.add(item.id);
    return [{ id: item.id, quantity: item.quantity as number }];
  });
}

export function cartReducer(cart: Cart, action: CartAction): Cart {
  if (!productById.has(action.id)) return cart;
  if (action.type === "remove")
    return cart.filter((item) => item.id !== action.id);
  if (!Number.isInteger(action.quantity) || action.quantity < 1) return cart;
  const quantity = Math.min(action.quantity, MAX_QUANTITY);
  const existing = cart.find((item) => item.id === action.id);
  if (action.type === "quantity" && !existing) return cart;
  if (!existing) return [...cart, { id: action.id, quantity }];
  return cart.map((item) =>
    item.id === action.id
      ? {
          ...item,
          quantity:
            action.type === "quantity"
              ? quantity
              : Math.min(MAX_QUANTITY, item.quantity + quantity),
        }
      : item,
  );
}

export const cartCount = (cart: Cart) =>
  cart.reduce((sum, item) => sum + item.quantity, 0);
export const cartSubtotal = (cart: Cart) =>
  cart.reduce(
    (sum, item) => sum + (productById.get(item.id)?.price ?? 0) * item.quantity,
    0,
  );

export function filterProducts(filters: Filters): Product[] {
  const terms = filters.query
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const result = products.filter((p) => {
    const text =
      `${p.name} ${p.subtitle} ${p.keywords} ${p.category} ${p.material}`.toLocaleLowerCase();
    return (
      terms.every((term) => text.includes(term)) &&
      (filters.category === "全部好物" || p.category === filters.category) &&
      (filters.scene === "all" || p.scenes.includes(filters.scene)) &&
      (filters.scene !== "gift" || p.price <= 30000)
    );
  });
  if (filters.sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (filters.sort === "price-desc") result.sort((a, b) => b.price - a.price);
  return result;
}

export function readFilters(): Filters {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const scene = params.get("scene");
  const sort = params.get("sort");
  return {
    query: (params.get("q") ?? "").slice(0, 100),
    category: ["桌面好物", "居家氛围", "日常器物"].includes(category ?? "")
      ? (category as Category)
      : "全部好物",
    scene: ["focus", "slow", "gift"].includes(scene ?? "")
      ? (scene as Scene)
      : "all",
    sort: sort === "price-asc" || sort === "price-desc" ? sort : "featured",
  };
}

export function writeFilters(filters: Filters) {
  const params = new URLSearchParams(window.location.search);
  for (const key of ["q", "category", "scene", "sort"]) params.delete(key);
  if (filters.query) params.set("q", filters.query);
  if (filters.category !== "全部好物") params.set("category", filters.category);
  if (filters.scene !== "all") params.set("scene", filters.scene);
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  const query = params.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
  );
}

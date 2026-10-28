import { describe, expect, it } from "vitest";
import {
  cartReducer,
  cartSubtotal,
  filterProducts,
  defaultFilters,
  validCart,
  MAX_QUANTITY,
} from "./shop";
import { productById } from "../data/products";

describe("cart invariants", () => {
  it("merges repeated additions and calculates totals in fen", () => {
    let cart = cartReducer([], { type: "add", id: "cloud-mug", quantity: 2 });
    cart = cartReducer(cart, { type: "add", id: "cloud-mug", quantity: 1 });
    cart = cartReducer(cart, { type: "add", id: "warm-lamp", quantity: 1 });
    expect(cart).toHaveLength(2);
    expect(cart[0].quantity).toBe(3);
    expect(cartSubtotal(cart)).toBe(
      3 * productById.get("cloud-mug")!.price +
        productById.get("warm-lamp")!.price,
    );
  });
  it("enforces quantity limits, rejects invalid changes and removes items", () => {
    const cart = cartReducer([], {
      type: "add",
      id: "cloud-mug",
      quantity: 99,
    });
    expect(cart[0].quantity).toBe(MAX_QUANTITY);
    expect(
      cartReducer(cart, { type: "quantity", id: "cloud-mug", quantity: 0 }),
    ).toEqual(cart);
    expect(
      cartReducer(cart, { type: "quantity", id: "cloud-mug", quantity: 1.5 }),
    ).toEqual(cart);
    expect(cartReducer(cart, { type: "remove", id: "cloud-mug" })).toEqual([]);
  });
  it("rejects stale, duplicated and corrupt stored data without losing valid lines", () => {
    expect(validCart({})).toEqual([]);
    expect(
      validCart([
        null,
        { id: "missing", quantity: 1 },
        { id: "cloud-mug", quantity: "2" },
        { id: "warm-lamp", quantity: 2 },
        { id: "warm-lamp", quantity: 3 },
        { id: "cloud-mug", quantity: 21 },
      ]),
    ).toEqual([{ id: "warm-lamp", quantity: 2 }]);
  });
  it("restores a removed line for undo", () => {
    const cart = cartReducer([], {
      type: "restore",
      id: "cloud-mug",
      quantity: 3,
    });
    expect(cart).toEqual([{ id: "cloud-mug", quantity: 3 }]);
    expect(
      cartReducer(cart, { type: "restore", id: "cloud-mug", quantity: 2 }),
    ).toEqual([{ id: "cloud-mug", quantity: 5 }]);
  });
});

describe("product discovery", () => {
  it("combines search and category without modifying the source catalog", () => {
    expect(
      filterProducts({
        ...defaultFilters,
        query: "杯子",
        category: "日常器物",
      }).map((p) => p.id),
    ).toEqual(["cloud-mug"]);
    expect(
      filterProducts({
        ...defaultFilters,
        query: "杯子",
        category: "桌面好物",
      }),
    ).toEqual([]);
    expect(filterProducts(defaultFilters)).toHaveLength(12);
  });
  it("sorts numerically and keeps gifts within the stated budget", () => {
    const asc = filterProducts({ ...defaultFilters, sort: "price-asc" });
    expect(asc.map((p) => p.price)).toEqual(
      asc.map((p) => p.price).sort((a, b) => a - b),
    );
    const gifts = filterProducts({ ...defaultFilters, scene: "gift" });
    expect(gifts.length).toBeGreaterThan(0);
    expect(gifts.every((p) => p.price <= 30000)).toBe(true);
    expect(gifts.some((p) => p.id === "reading-chair")).toBe(false);
  });
});

import { ArrowUpRight, Plus, Check } from "lucide-react";
import type { MouseEvent } from "react";
import type { Product } from "../data/products";
import { money, MAX_QUANTITY } from "../lib/shop";
import { ProductImage } from "./ProductImage";

type Props = {
  product: Product;
  index: number;
  quantity: number;
  onOpen: (product: Product, opener: HTMLElement) => void;
  onAdd: (id: string) => void;
};
export function ProductCard({
  product,
  index,
  quantity,
  onOpen,
  onAdd,
}: Props) {
  const params = new URLSearchParams(window.location.search);
  params.set("product", product.id);
  const href = `?${params.toString()}#collection`;
  const open = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    onOpen(product, event.currentTarget);
  };
  return (
    <article className="product-card">
      <a
        href={href}
        className="product-photo"
        onClick={open}
        aria-label={`查看${product.name}详情`}
      >
        <ProductImage product={product} priority={index < 4} />
        {product.tag && (
          <span className={`product-tag ${index === 0 ? "tag-featured" : ""}`}>
            {product.tag}
          </span>
        )}
        <span className="photo-link">
          <span>发现细节</span>
          <ArrowUpRight size={17} aria-hidden="true" />
        </span>
      </a>
      <div className="product-meta">
        <span>{product.category}</span>
        <span className="product-color">
          <i aria-hidden="true" />
          {product.color}
        </span>
      </div>
      <h3>
        <a href={href} onClick={open}>
          {product.name}
        </a>
      </h3>
      <p className="product-subtitle">{product.subtitle}</p>
      <div className="product-bottom">
        <span className="price">{money(product.price)}</span>
        <button
          className={`quick-add ${quantity > 0 ? "has-item" : ""}`}
          aria-label={
            quantity >= MAX_QUANTITY
              ? `${product.name}已达数量上限`
              : `将${product.name}加入购物车`
          }
          disabled={quantity >= MAX_QUANTITY}
          onClick={() => onAdd(product.id)}
        >
          {quantity > 0 ? (
            <Check size={17} aria-hidden="true" />
          ) : (
            <Plus size={18} aria-hidden="true" />
          )}
          <span>
            {quantity >= MAX_QUANTITY
              ? "已达上限"
              : quantity > 0
                ? `已加 ${quantity} 件`
                : "加入购物车"}
          </span>
        </button>
      </div>
    </article>
  );
}

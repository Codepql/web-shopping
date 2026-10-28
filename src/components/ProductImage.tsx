import { useState } from "react";
import { ImageOff } from "lucide-react";
import type { Product } from "../data/products";

type Props = { product: Product; className?: string; priority?: boolean };
export function ProductImage({
  product,
  className = "",
  priority = false,
}: Props) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div
        className={`image-fallback ${className}`}
        role="img"
        aria-label={`${product.name}，图片暂时无法显示`}
      >
        <ImageOff aria-hidden="true" />
        <span>图片暂时无法显示</span>
        <small>{product.name}</small>
      </div>
    );
  return (
    <img
      className={className}
      src={product.image}
      alt={product.name}
      width="800"
      height="1000"
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={{ objectPosition: product.imagePosition }}
      onError={() => setFailed(true)}
    />
  );
}

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Check, Leaf, Package, ShoppingBag, X } from "lucide-react";
import type { Product } from "../data/products";
import { MAX_QUANTITY, money } from "../lib/shop";
import { ProductImage } from "./ProductImage";
import { Quantity } from "./Quantity";

type Props = {
  product: Product | undefined;
  inCart: number;
  onClose: () => void;
  onAdd: (id: string, quantity: number) => void;
  onCart: () => void;
  opener: React.RefObject<HTMLElement | null>;
  notification?: React.ReactNode;
};
export function ProductDetail({
  product,
  inCart,
  onClose,
  onAdd,
  onCart,
  opener,
  notification,
}: Props) {
  return (
    <Dialog.Root
      open={!!product}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content
          className="detail-dialog"
          aria-describedby="detail-description"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            opener.current?.focus();
          }}
        >
          {product && (
            <DetailContent
              key={product.id}
              product={product}
              inCart={inCart}
              onAdd={onAdd}
              onCart={onCart}
            />
          )}
          <Dialog.Close
            className="icon-button detail-close"
            aria-label="关闭商品详情"
          >
            <X size={21} aria-hidden="true" />
          </Dialog.Close>
          {notification}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DetailContent({
  product,
  inCart,
  onAdd,
  onCart,
}: Pick<Props, "inCart" | "onAdd" | "onCart"> & { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const available = MAX_QUANTITY - inCart;
  const selected = Math.min(quantity, Math.max(1, available));
  return (
    <>
      <div className="detail-photo">
        <ProductImage product={product} priority />
        {product.tag && (
          <span className="product-tag tag-featured">{product.tag}</span>
        )}
      </div>
      <div className="detail-content">
        <span className="eyebrow">{product.category} / 日常的好设计</span>
        <Dialog.Title className="detail-title">{product.name}</Dialog.Title>
        <p className="detail-subtitle">{product.subtitle}</p>
        <p className="detail-price">{money(product.price)}</p>
        <Dialog.Description
          id="detail-description"
          className="detail-description"
        >
          {product.description}
        </Dialog.Description>
        <dl className="specs">
          <div>
            <dt>颜色</dt>
            <dd>{product.color}</dd>
          </div>
          <div>
            <dt>材质</dt>
            <dd>{product.material}</dd>
          </div>
          <div>
            <dt>规格</dt>
            <dd>{product.size}</dd>
          </div>
        </dl>
        <div className="detail-benefits">
          <span>
            <Leaf size={16} aria-hidden="true" />
            认真挑选日常好物
          </span>
          <span>
            <Package size={16} aria-hidden="true" />
            商品信息为模拟数据
          </span>
        </div>
        <p className="demo-note">
          这是选购体验演示，商品图片为风格示意，暂不提供真实交易与配送。
        </p>
        <div className="detail-purchase">
          <div className="detail-quantity">
            <span>购买数量</span>
            <Quantity
              name={product.name}
              value={selected}
              max={Math.max(1, available)}
              onChange={setQuantity}
            />
          </div>
          <p className="stock-note">
            <Check size={14} aria-hidden="true" />
            {inCart ? `购物车已有 ${inCart} 件 · ` : ""}每款限加 {MAX_QUANTITY}{" "}
            件
          </p>
          <button
            className="primary-button detail-add"
            disabled={available === 0}
            onClick={() => onAdd(product.id, selected)}
          >
            <ShoppingBag size={18} aria-hidden="true" />
            {available === 0 ? "已达购物车数量上限" : "加入购物车"}
            {available > 0 && <span>{money(product.price * selected)}</span>}
          </button>
          {inCart > 0 && (
            <button className="text-button go-cart" onClick={onCart}>
              查看购物车
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, ShoppingBag, Trash2, X } from "lucide-react";
import type { Cart } from "../lib/shop";
import { cartCount, cartSubtotal, money } from "../lib/shop";
import { productById } from "../data/products";
import { ProductImage } from "./ProductImage";
import { Quantity } from "./Quantity";
import { PurchaseNotice } from "./PurchaseNotice";

type Props = {
  open: boolean;
  cart: Cart;
  onClose: () => void;
  onQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  opener: React.RefObject<HTMLElement | null>;
  notification?: React.ReactNode;
};
export function CartDrawer({
  open,
  cart,
  onClose,
  onQuantity,
  onRemove,
  opener,
  notification,
}: Props) {
  const total = cartSubtotal(cart);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content
          className="cart-drawer"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            opener.current?.focus();
          }}
        >
          <header className="cart-header">
            <div>
              <span className="eyebrow">把喜欢的日常带回家</span>
              <Dialog.Title>
                我的购物车 <span>（{cartCount(cart)}）</span>
              </Dialog.Title>
            </div>
            <Dialog.Close className="icon-button" aria-label="关闭购物车">
              <X aria-hidden="true" size={22} />
            </Dialog.Close>
          </header>
          <Dialog.Description className="sr-only">
            管理选中的商品、数量，查看商品合计。当前为选购演示，不提供结算。
          </Dialog.Description>
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-bag">
                <ShoppingBag size={38} strokeWidth={1.25} aria-hidden="true" />
              </div>
              <h3>给喜欢的好物，留个位置</h3>
              <p>购物车还是空的，去发现属于你的舒适一角。</p>
              <Dialog.Close className="primary-button">
                去逛逛
                <ArrowRight size={18} aria-hidden="true" />
              </Dialog.Close>
            </div>
          ) : (
            <>
              <div className="cart-items">
                <div className="cart-hint">
                  <ShoppingBag size={16} aria-hidden="true" />
                  你挑选的每一件，都让日常更可爱。
                </div>
                <ul>
                  {cart.map((item) => {
                    const product = productById.get(item.id)!;
                    return (
                      <li className="cart-item" key={item.id}>
                        <ProductImage
                          product={product}
                          className="cart-item-image"
                        />
                        <div className="cart-item-content">
                          <div className="cart-item-top">
                            <h3>{product.name}</h3>
                            <button
                              className="icon-button remove-item"
                              aria-label={`删除${product.name}`}
                              onClick={() => onRemove(item.id)}
                            >
                              <Trash2 size={16} aria-hidden="true" />
                            </button>
                          </div>
                          <p>{product.color}</p>
                          <span className="unit-price">
                            单价 {money(product.price)}
                          </span>
                          <div className="cart-item-bottom">
                            <Quantity
                              name={product.name}
                              value={item.quantity}
                              onChange={(quantity) =>
                                onQuantity(item.id, quantity)
                              }
                            />
                            <strong>
                              {money(product.price * item.quantity)}
                            </strong>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <footer className="cart-summary">
                <div className="summary-line">
                  <span>
                    商品合计 <small>共 {cartCount(cart)} 件</small>
                  </span>
                  <strong data-testid="cart-subtotal">{money(total)}</strong>
                </div>
                <p>仅计算商品金额，不含运费及税费。</p>
                <PurchaseNotice />
                <Dialog.Close className="text-button continue-shopping">
                  继续挑选好物
                  <ArrowRight size={18} aria-hidden="true" />
                </Dialog.Close>
                <div className="cart-demo">
                  <span className="demo-dot" />
                  选购体验演示 · 暂不提供结算
                </div>
              </footer>
            </>
          )}
          {notification}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Sprout, X } from "lucide-react";

export function PurchaseNotice() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="primary-button buy-now">
          立即购买
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay purchase-overlay" />
        <Dialog.Content className="purchase-dialog">
          <Dialog.Close
            className="icon-button purchase-close"
            aria-label="关闭购买提示"
          >
            <X size={20} aria-hidden="true" />
          </Dialog.Close>
          <div className="purchase-illustration">
            <Sprout size={36} strokeWidth={1.3} aria-hidden="true" />
          </div>
          <Dialog.Title>购买功能，还在慢慢准备中</Dialog.Title>
          <Dialog.Description>
            当前为选购体验演示，下单与支付功能暂未实现。
            你挑选的好物仍在购物车里，可以继续调整，或再逛一逛。
          </Dialog.Description>
          <Dialog.Close className="primary-button">返回购物车</Dialog.Close>
          <span className="purchase-note">感谢你发现这些日常的小美好。</span>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

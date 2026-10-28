import { Check, X } from "lucide-react";
import type { Cart } from "../lib/shop";

export type Notice = {
  message: string;
  action?: "cart" | "undo";
  removed?: Cart[number];
};
export function Toast({
  notice,
  onAction,
  onClose,
}: {
  notice: Notice | null;
  onAction: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className={`toast ${notice ? "visible" : ""}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {notice && (
        <>
          <Check size={18} aria-hidden="true" />
          <span>{notice.message}</span>
          {notice.action && (
            <button onClick={onAction}>
              {notice.action === "cart" ? "查看购物车" : "撤销"}
            </button>
          )}
          <button
            className="toast-close"
            aria-label="关闭提示"
            onClick={onClose}
          >
            <X size={15} aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}

import { Minus, Plus } from "lucide-react";
import { MAX_QUANTITY } from "../lib/shop";

type Props = {
  value: number;
  onChange: (value: number) => void;
  name: string;
  max?: number;
};
export function Quantity({ value, onChange, name, max = MAX_QUANTITY }: Props) {
  return (
    <div className="quantity" role="group" aria-label={`${name}数量`}>
      <button
        type="button"
        aria-label={`减少${name}数量`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={15} aria-hidden="true" />
      </button>
      <span aria-live="polite" aria-atomic="true">
        {value}
      </span>
      <button
        type="button"
        aria-label={`增加${name}数量`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

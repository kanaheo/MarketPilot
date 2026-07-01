import type { FormEvent } from "react";

export const ORDER_QUANTITY_INPUT_STEP = "0.01";
export const ORDER_QUANTITY_INPUT_MIN = "0.01";

export function sanitizeOrderQuantityInputValue(value: string): string {
  const numericValue = value.replace(/[^\d.]/g, "");
  const [integerPart, ...decimalParts] = numericValue.split(".");

  if (decimalParts.length === 0) {
    return integerPart;
  }

  return `${integerPart || "0"}.${decimalParts.join("").slice(0, 2)}`;
}

export function sanitizeOrderQuantityInput(
  event: FormEvent<HTMLInputElement>,
): void {
  const input = event.currentTarget;
  const sanitizedValue = sanitizeOrderQuantityInputValue(input.value);
  if (input.value !== sanitizedValue) {
    input.value = sanitizedValue;
  }
}

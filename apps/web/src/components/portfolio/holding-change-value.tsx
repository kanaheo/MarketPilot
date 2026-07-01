"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import {
  formatMarketPriceDelta,
  formatPercent,
} from "@/lib/formatters";
import type { Locale } from "@/types/i18n";
import type { SupportedCurrency } from "@/types/marketpilot-api";

type HoldingChangeDirection = "decrease" | "increase" | "none";
type HoldingChangeDeltaType = "currency" | "percent" | "quantity";

type HoldingChangeValueProps = Readonly<{
  children: ReactNode;
  className?: string;
  currency?: SupportedCurrency;
  deltaType: HoldingChangeDeltaType;
  locale: Locale;
  role?: string;
  shareUnit?: string;
  value: number;
}>;

const QUANTITY_DELTA_FORMAT_OPTIONS = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
  signDisplay: "always",
} as const satisfies Intl.NumberFormatOptions;

function formatHoldingDelta({
  currency,
  delta,
  deltaType,
  locale,
  shareUnit,
}: Readonly<{
  currency?: SupportedCurrency;
  delta: number;
  deltaType: HoldingChangeDeltaType;
  locale: Locale;
  shareUnit?: string;
}>): string {
  if (deltaType === "currency" && currency !== undefined) {
    return formatMarketPriceDelta(delta, currency, locale);
  }

  if (deltaType === "percent") {
    return formatPercent(delta, locale);
  }

  return `${delta.toLocaleString(locale, QUANTITY_DELTA_FORMAT_OPTIONS)}${
    shareUnit ?? ""
  }`;
}

export function HoldingChangeValue({
  children,
  className,
  currency,
  deltaType,
  locale,
  role,
  shareUnit,
  value,
}: HoldingChangeValueProps) {
  const previousValueRef = useRef(value);
  const [delta, setDelta] = useState(0);
  const [direction, setDirection] =
    useState<HoldingChangeDirection>("none");

  useEffect(() => {
    const previousValue = previousValueRef.current;
    previousValueRef.current = value;

    if (value === previousValue) {
      return;
    }

    setDelta(value - previousValue);
    setDirection(value > previousValue ? "increase" : "decrease");
    const timeoutId = window.setTimeout(() => {
      setDirection("none");
      setDelta(0);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [value]);

  const classNames = [
    className,
    "holding-change-value",
    direction !== "none" ? `is-${direction}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classNames} role={role}>
      <span className="holding-change-current">{children}</span>
      {direction !== "none" ? (
        <span className="holding-change-delta">
          {formatHoldingDelta({
            currency,
            delta,
            deltaType,
            locale,
            shareUnit,
          })}
        </span>
      ) : null}
    </span>
  );
}

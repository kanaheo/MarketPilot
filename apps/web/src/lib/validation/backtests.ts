import { z } from "zod";

import type { BacktestsMessages } from "@/types/backtests";

export function createBacktestSchema(
  messages: BacktestsMessages["validation"],
) {
  return z
    .object({
      startDate: z.string().min(1, messages.required),
      endDate: z.string().min(1, messages.required),
      initialCapital: z
        .number(messages.number)
        .min(1000, messages.initialCapital),
      currency: z.enum(["USD", "KRW", "JPY"]),
      benchmark: z.enum(["SPY", "KOSPI", "NIKKEI225"]),
      strategy: z.enum(["momentum", "movingAverage", "buyAndHold"]),
      maxPositionWeight: z
        .number(messages.number)
        .min(1, messages.percentage)
        .max(100, messages.percentage),
      cashReserve: z
        .number(messages.number)
        .min(0, messages.percentage)
        .max(100, messages.percentage),
      stopLoss: z
        .number(messages.number)
        .min(0, messages.stopLoss)
        .max(50, messages.stopLoss),
      rebalanceFrequency: z.enum(["weekly", "monthly", "quarterly"]),
      feeRate: z
        .number(messages.number)
        .min(0, messages.cost)
        .max(5, messages.cost),
      slippageRate: z
        .number(messages.number)
        .min(0, messages.cost)
        .max(5, messages.cost),
      executionTiming: z.enum(["nextOpen", "sameClose"]),
    })
    .superRefine((values, context) => {
      if (values.startDate >= values.endDate) {
        context.addIssue({
          code: "custom",
          message: messages.dateRange,
          path: ["endDate"],
        });
      }

      if (values.maxPositionWeight + values.cashReserve > 100) {
        context.addIssue({
          code: "custom",
          message: messages.allocation,
          path: ["cashReserve"],
        });
      }
    });
}

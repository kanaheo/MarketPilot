import { z } from "zod";

import type { PortfolioMessages } from "@/types/i18n/portfolio";

const ORDER_QUANTITY_SCALE = 100;

function hasAtMostTwoDecimalPlaces(value: number): boolean {
  return (
    Math.abs(
      value * ORDER_QUANTITY_SCALE -
        Math.round(value * ORDER_QUANTITY_SCALE),
    ) < 1e-9
  );
}

export function createPortfolioSchema(
  messages: PortfolioMessages["createForm"]["validation"],
) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, messages.nameRequired)
      .max(120, messages.nameLength),
    baseCurrency: z.enum(["USD", "KRW", "JPY"], {
      error: messages.currency,
    }),
    initialCapital: z
      .number(messages.initialCapitalRequired)
      .finite(messages.initialCapitalRequired)
      .positive(messages.initialCapitalPositive),
  });
}

export type PortfolioCreateFormValues = z.infer<
  ReturnType<typeof createPortfolioSchema>
>;

export function createCashTransactionSchema(
  messages: PortfolioMessages["cashTransactionForm"]["validation"],
) {
  return z.object({
    amount: z
      .number(messages.amountRequired)
      .finite(messages.amountRequired)
      .positive(messages.amountPositive),
    note: z.string().trim().max(500, messages.noteLength).optional(),
    transactionType: z.enum(["DEPOSIT", "WITHDRAWAL"], {
      error: messages.transactionType,
    }),
  });
}

export type CashTransactionFormValues = z.infer<
  ReturnType<typeof createCashTransactionSchema>
>;

export function createOrderSchema(
  messages: PortfolioMessages["orderForm"]["validation"],
) {
  return z
    .object({
      decisionEvidence: z
        .string()
        .trim()
        .max(2000, messages.decisionEvidenceLength)
        .optional(),
      limitPrice: z.number().positive(messages.limitPricePositive).optional(),
      orderType: z.enum(["MARKET", "LIMIT"], {
        error: messages.orderType,
      }),
      quantity: z
        .number(messages.quantityRequired)
        .finite(messages.quantityRequired)
        .positive(messages.quantityPositive)
        .refine(
          hasAtMostTwoDecimalPlaces,
          messages.quantityDecimalPlaces,
        ),
      side: z.enum(["BUY", "SELL"], {
        error: messages.side,
      }),
      symbol: z
        .string()
        .trim()
        .min(1, messages.symbolRequired)
        .max(32, messages.symbolFormat)
        .regex(/^[A-Za-z0-9][A-Za-z0-9.-]{0,31}$/, messages.symbolFormat),
    })
    .superRefine((values, context) => {
      if (values.orderType === "MARKET" && values.limitPrice !== undefined) {
        context.addIssue({
          code: "custom",
          message: messages.marketLimitPrice,
          path: ["limitPrice"],
        });
      }

      if (values.orderType === "LIMIT" && values.limitPrice === undefined) {
        context.addIssue({
          code: "custom",
          message: messages.limitPriceRequired,
          path: ["limitPrice"],
        });
      }
    });
}

export type OrderFormValues = z.infer<ReturnType<typeof createOrderSchema>>;

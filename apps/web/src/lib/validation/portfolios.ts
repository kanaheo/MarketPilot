import { z } from "zod";

import type { PortfolioMessages } from "@/types/i18n/portfolio";

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

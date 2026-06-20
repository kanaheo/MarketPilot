import { z } from "zod";

export function createEmailAuthSchema(invalidEmailMessage: string) {
  return z.object({
    email: z.email(invalidEmailMessage),
  });
}

export type EmailAuthValues = z.infer<
  ReturnType<typeof createEmailAuthSchema>
>;

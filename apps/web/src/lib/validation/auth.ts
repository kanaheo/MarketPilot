import { z } from "zod";

const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,128}$/;

export function createEmailAuthSchema(
  invalidEmailMessage: string,
  invalidPasswordMessage: string,
) {
  return z.object({
    email: z.email(invalidEmailMessage),
    password: z.string().regex(passwordPolicy, invalidPasswordMessage),
  });
}

export type EmailAuthValues = z.infer<
  ReturnType<typeof createEmailAuthSchema>
>;

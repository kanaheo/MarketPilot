import Link from "next/link";

import { confirmEmailVerification } from "@/lib/server/password-auth";
import { assertLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import type { TokenAuthPageProps } from "@/types/auth";

export default async function VerifyEmailPage({
  params,
  searchParams,
}: TokenAuthPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);

  assertLocale(locale);

  const messages = getMessages(locale).auth.verifyEmail;
  const token = query.token;
  let isVerified = false;

  if (token) {
    try {
      await confirmEmailVerification(token);
      isVerified = true;
    } catch {
      isVerified = false;
    }
  }

  return (
    <section className="auth-workspace">
      <div className="auth-card">
        <div className="auth-card-heading">
          <h2>{isVerified ? messages.successTitle : messages.errorTitle}</h2>
          <p>
            {isVerified
              ? messages.successDescription
              : messages.errorDescription}
          </p>
        </div>

        <p className="auth-switch">
          <Link href={`/${locale}/login`}>{messages.loginAction}</Link>
        </p>
      </div>
    </section>
  );
}

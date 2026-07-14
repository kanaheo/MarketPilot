import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { assertLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import type { AuthPageProps } from "@/types/auth";

export default async function ForgotPasswordPage({ params }: AuthPageProps) {
  const { locale } = await params;

  assertLocale(locale);

  return (
    <section className="auth-workspace">
      <ForgotPasswordForm locale={locale} messages={getMessages(locale).auth} />
    </section>
  );
}

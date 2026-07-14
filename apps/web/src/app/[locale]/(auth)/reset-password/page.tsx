import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { assertLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import type { TokenAuthPageProps } from "@/types/auth";

export default async function ResetPasswordPage({
  params,
  searchParams,
}: TokenAuthPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);

  assertLocale(locale);

  return (
    <section className="auth-workspace">
      <ResetPasswordForm
        locale={locale}
        messages={getMessages(locale).auth}
        token={query.token ?? null}
      />
    </section>
  );
}

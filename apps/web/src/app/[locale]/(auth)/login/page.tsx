import { AuthScreen } from "@/components/auth/auth-screen";
import { assertLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import type { AuthPageProps } from "@/types/auth";

export default async function LoginPage({
  params,
  searchParams,
}: AuthPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);

  assertLocale(locale);

  return (
    <AuthScreen
      initialMode="login"
      locale={locale}
      messages={getMessages(locale).auth}
      status={
        query.error
          ? "error"
          : query.notice === "cancelled"
            ? "cancelled"
            : "idle"
      }
    />
  );
}

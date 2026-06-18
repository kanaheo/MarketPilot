import { assertLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import type { DashboardPageProps } from "@/types/dashboard";

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;

  assertLocale(locale);

  const messages = getMessages(locale);

  return (
    <section className="page-placeholder">
      <p className="page-eyebrow">{messages.dashboard.phase}</p>
      <h1>{messages.dashboard.title}</h1>
      <p>{messages.dashboard.placeholder}</p>
    </section>
  );
}

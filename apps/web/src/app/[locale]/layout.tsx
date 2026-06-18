import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { siteMetadata } from "@/config/site";
import { isLocale, locales } from "@/i18n/config";
import type { LocaleLayoutProps } from "@/types/i18n";

import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return siteMetadata.ko;
  }

  return siteMetadata[locale];
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}

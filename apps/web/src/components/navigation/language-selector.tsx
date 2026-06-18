"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { localeLabels, locales } from "@/i18n/config";
import type { LanguageSelectorProps, Locale } from "@/types/i18n";

export function LanguageSelector({
  ariaLabel,
  locale,
}: LanguageSelectorProps) {
  const pathname = usePathname();
  const router = useRouter();

  function changeLocale(nextLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    router.replace(segments.join("/") || `/${nextLocale}`);
  }

  return (
    <label className="language-selector">
      <Languages size={17} aria-hidden="true" />
      <span className="sr-only">{ariaLabel}</span>
      <select
        aria-label={ariaLabel}
        onChange={(event) => changeLocale(event.target.value as Locale)}
        value={locale}
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {localeLabels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}

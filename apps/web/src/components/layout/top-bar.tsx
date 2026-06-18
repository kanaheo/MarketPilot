import { Bell, ChevronDown } from "lucide-react";

import { LanguageSelector } from "@/components/navigation/language-selector";
import { getMessages } from "@/i18n/messages";
import type { TopBarProps } from "@/types/common";

export function TopBar({ locale }: TopBarProps) {
  const messages = getMessages(locale);

  return (
    <header className="app-topbar">
      <div className="market-status">
        <span className="market-status-dot" aria-hidden="true" />
        <strong>{messages.topBar.marketOpen}</strong>
        <span>{messages.topBar.marketCloseTime}</span>
      </div>

      <div className="topbar-actions">
        <button
          className="icon-button"
          type="button"
          aria-label={messages.topBar.notifications}
        >
          <Bell size={19} />
        </button>
        <LanguageSelector
          ariaLabel={messages.languageSelector.label}
          locale={locale}
        />
        <button className="portfolio-selector" type="button">
          <span>{messages.topBar.portfolio}</span>
          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
}

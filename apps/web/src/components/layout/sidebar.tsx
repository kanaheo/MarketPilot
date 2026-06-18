import { Activity, Settings } from "lucide-react";

import { PrimaryNavigation } from "@/components/navigation/primary-navigation";
import { getMessages } from "@/i18n/messages";
import type { SidebarProps } from "@/types/common";

export function Sidebar({ locale }: SidebarProps) {
  const messages = getMessages(locale);

  return (
    <aside className="app-sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <Activity size={20} strokeWidth={2.4} />
        </span>
        <span>MarketPilot</span>
      </div>

      <PrimaryNavigation
        ariaLabel={messages.navigation.ariaLabel}
        labels={messages.navigation.items}
        locale={locale}
      />

      <div className="sidebar-footer">
        <button className="sidebar-action" type="button">
          <Settings size={19} />
          <span>{messages.navigation.settings}</span>
        </button>

        <div className="user-summary">
          <span className="user-avatar" aria-hidden="true">
            KH
          </span>
          <span>
            <strong>Kyungmin</strong>
            <small>{messages.user.role}</small>
          </span>
        </div>
      </div>
    </aside>
  );
}

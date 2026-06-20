import Image from "next/image";
import { Activity, Settings } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { PrimaryNavigation } from "@/components/navigation/primary-navigation";
import { getMessages } from "@/i18n/messages";
import type { SidebarProps } from "@/types/common";

function getInitials(name: string | null, email: string | null) {
  const source = name?.trim() || email?.split("@")[0] || "MP";
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export function Sidebar({ locale, user }: SidebarProps) {
  const messages = getMessages(locale);
  const displayName = user.name || user.email || messages.user.fallbackName;

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
        <SignOutButton
          label={messages.user.signOut}
          redirectTo={`/${locale}/login`}
        />

        <div className="user-summary">
          {user.image ? (
            <Image
              alt=""
              className="user-avatar-image"
              height={34}
              src={user.image}
              width={34}
            />
          ) : (
            <span className="user-avatar" aria-hidden="true">
              {getInitials(user.name, user.email)}
            </span>
          )}
          <span>
            <strong>{displayName}</strong>
            <small>{user.email || messages.user.role}</small>
          </span>
        </div>
      </div>
    </aside>
  );
}

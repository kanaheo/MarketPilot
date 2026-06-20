import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import type { AppShellProps } from "@/types/common";

export function AppShell({ children, locale, user }: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar locale={locale} user={user} />
      <div className="app-workspace">
        <TopBar locale={locale} />
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}

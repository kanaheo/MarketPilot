import { History, Plus } from "lucide-react";

import type { DashboardHeaderProps } from "@/types/dashboard";

export function DashboardHeader({ messages }: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div>
        <h1>{messages.greeting}</h1>
        <p>{messages.description}</p>
      </div>

      <div className="dashboard-actions">
        <button className="dashboard-action secondary" type="button">
          <History size={17} aria-hidden="true" />
          <span>{messages.actions.history}</span>
        </button>
        <button className="dashboard-action primary" type="button">
          <Plus size={18} aria-hidden="true" />
          <span>{messages.actions.addFunds}</span>
        </button>
      </div>
    </header>
  );
}

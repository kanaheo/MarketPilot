import type { Messages } from "@/types/i18n";

export const dashboard = {
  phase: "Phase 1",
  title: "Dashboard",
  placeholder:
    "The shared layout is ready. We will fill the screen in small steps from the next phase.",
} as const satisfies Messages["dashboard"];

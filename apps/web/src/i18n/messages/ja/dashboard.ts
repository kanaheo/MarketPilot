import type { Messages } from "@/types/i18n";

export const dashboard = {
  phase: "Phase 1",
  title: "ダッシュボード",
  placeholder:
    "共通レイアウトを準備しました。次の段階から画面を小さな単位で作成します。",
} as const satisfies Messages["dashboard"];

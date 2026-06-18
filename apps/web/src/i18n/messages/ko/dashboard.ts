import type { Messages } from "@/types/i18n";

export const dashboard = {
  phase: "Phase 1",
  title: "대시보드",
  placeholder:
    "공통 레이아웃이 준비되었습니다. 다음 단계부터 화면을 작은 단위로 채워갑니다.",
} as const satisfies Messages["dashboard"];

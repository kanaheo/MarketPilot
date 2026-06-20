import type { Messages } from "@/types/i18n";

export const common = {
  navigation: {
    ariaLabel: "주요 메뉴",
    items: {
      dashboard: "대시보드",
      portfolio: "포트폴리오",
      markets: "시장 탐색",
      backtests: "백테스트",
      data: "데이터",
    },
    settings: "설정",
  },
  topBar: {
    marketOpen: "미국 시장 개장 중",
    marketCloseTime: "마감까지 3시간 24분",
    notifications: "알림",
    portfolio: "성장형 포트폴리오",
  },
  languageSelector: {
    label: "언어 선택",
  },
  user: {
    fallbackName: "MarketPilot 사용자",
    role: "모의투자자",
    signOut: "로그아웃",
  },
  feedback: {
    loading: "대시보드를 불러오는 중입니다.",
    retry: "다시 시도",
    errorTitle: "대시보드를 불러오지 못했습니다",
    errorDescription:
      "잠시 후 다시 시도해 주세요. 문제가 계속되면 네트워크 상태를 확인해 주세요.",
  },
} as const satisfies Omit<Messages, "auth" | "dashboard">;

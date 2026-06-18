import type { Messages } from "@/types/i18n";

export const dashboard = {
  header: {
    greeting: "좋은 아침이에요, 경민님",
    description: "시장은 변동성이 높습니다. 근거와 위험을 함께 확인하세요.",
    actions: {
      history: "거래 내역",
      addFunds: "가상자금 추가",
    },
  },
  summary: {
    summaryLabel: "포트폴리오 주요 지표",
    cards: {
      totalValue: {
        label: "총 평가금액",
        value: "₩15,873,420",
        detail: "↗ +8.73%",
        detailAside: "투자수익 +₩873,420",
      },
      availableCash: {
        label: "투자 가능 현금",
        value: "₩3,214,800",
        detail: "현금 비중 20.3%",
        detailAside: "최근 입금 +₩5,000,000",
      },
      todayProfit: {
        label: "오늘의 손익",
        value: "+₩184,260",
        detail: "↗ +1.18%",
        detailAside: "S&P 500 대비 +0.62%",
      },
      maxDrawdown: {
        label: "최대 낙폭",
        value: "-4.82%",
        detail: "위험 예산의 48%",
        detailAside: "한도 -10%",
      },
    },
  },
} as const satisfies Messages["dashboard"];

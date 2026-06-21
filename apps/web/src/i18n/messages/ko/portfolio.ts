import type { Messages } from "@/types/i18n";

export const portfolio = {
  header: {
    title: "포트폴리오",
    description: "자산 배분, 보유 종목, 현금 흐름과 위험을 한곳에서 확인하세요.",
  },
  summary: {
    label: "포트폴리오 요약",
    cards: {
      totalValue: "총 평가금액",
      availableCash: "사용 가능 현금",
      totalReturn: "총 수익률",
      maxDrawdown: "최대 낙폭",
    },
  },
  valueChart: {
    title: "포트폴리오 가치",
    chartLabel: "포트폴리오 가치와 S&P 500 비교 차트",
    portfolio: "내 포트폴리오",
    benchmark: "S&P 500",
    periodLabel: "포트폴리오 가치 조회 기간",
    periods: [
      { label: "1개월", active: true },
      { label: "3개월", active: false },
      { label: "6개월", active: false },
      { label: "1년", active: false },
    ],
  },
  allocation: {
    title: "자산 배분",
    chartLabel: "자산 배분 도넛 차트",
    totalValue: "총 평가금액",
    items: {
      stocks: "주식",
      etfs: "ETF",
      cash: "현금",
    },
  },
  holdings: {
    title: "보유 종목",
    description: "현재 모의투자 포지션 · 현금 제외",
    shareUnit: "주",
    columns: {
      asset: "자산",
      quantity: "수량",
      averagePrice: "평균 매수가",
      currentPrice: "현재가",
      marketValue: "평가금액",
      returnRate: "수익률",
    },
    empty: {
      title: "보유 종목이 없습니다",
      description: "첫 모의주문이 체결되면 보유 종목이 이곳에 표시됩니다.",
    },
  },
} as const satisfies Messages["portfolio"];

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
        detail: "투자수익",
      },
      availableCash: {
        label: "투자 가능 현금",
        detail: "현금 비중",
        detailAside: "최근 입금",
      },
      todayProfit: {
        label: "오늘의 손익",
        detail: "S&P 500 대비",
      },
      maxDrawdown: {
        label: "최대 낙폭",
        detail: "위험 예산의",
        detailAside: "한도",
      },
    },
  },
  performance: {
    title: "포트폴리오 성과",
    description: "현금 흐름을 제외한 시간가중수익률",
    chartLabel: "포트폴리오와 S&P 500 성과 비교 차트",
    portfolio: "내 포트폴리오",
    benchmark: "S&P 500",
    periodLabel: "성과 조회 기간",
    periods: [
      { label: "1주", active: false },
      { label: "1개월", active: true },
      { label: "3개월", active: false },
      { label: "1년", active: false },
    ],
  },
  watchlist: {
    title: "관심 종목",
    updated: "10초 전 업데이트",
    realtime: "예시 시세",
    manage: "관심 종목 관리",
    columns: {
      symbol: "종목",
      price: "현재가",
      change: "등락률",
      trend: "추이(1일)",
    },
  },
  signals: {
    title: "AI 시장 신호",
    description: "오늘 09:30 기준 분석",
    viewAll: "전체 보기",
    probability: "상승 가능성",
    disclaimer:
      "신호는 투자 권유가 아니며, 모형의 과거 성과와 현재 위험 요인을 함께 검토해야 합니다.",
    risks: {
      low: "위험 낮음",
      medium: "위험 중간",
      high: "위험 높음",
    },
    items: {
      amd: {
        title: "상승 관찰",
        description: "AI 반도체 수요와 최근 실적 모멘텀 개선",
      },
      xle: {
        title: "관심 증가",
        description: "지정학적 위험과 유가 변동성 확대",
      },
      tlt: {
        title: "중립 전환",
        description: "미국 고용 둔화와 금리 기대 변화",
      },
    },
  },
  holdings: {
    title: "보유 종목",
    description: "현재 3개 종목 · 현금 제외",
    viewPortfolio: "포트폴리오 보기",
    viewAll: "전체 보유 종목 보기",
    shareUnit: "주",
    columns: {
      symbol: "종목",
      quantity: "보유량",
      value: "평가금액",
      returnRate: "수익률",
    },
  },
  activity: {
    title: "계좌 활동",
    description: "최근 현금 흐름 및 주문",
    more: "계좌 활동 메뉴",
    viewAll: "거래 내역 전체 보기",
    items: {
      deposit: {
        title: "추가 입금",
        detail: "가상자금",
      },
      nvdaBuy: {
        title: "NVDA 매수",
        detail: "4주 · $1,742.40",
      },
      amdSell: {
        title: "AMD 매도",
        detail: "2주 · $165.80",
      },
    },
  },
} as const satisfies Messages["dashboard"];

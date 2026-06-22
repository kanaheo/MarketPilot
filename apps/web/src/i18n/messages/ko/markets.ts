import type { Messages } from "@/types/i18n";

export const markets = {
  header: {
    eyebrow: "글로벌 종목 탐색",
    title: "시장 탐색",
    description: "미국, 한국, 일본 시장에서 새로운 기회를 탐색하세요.",
    dataBadge: "Fixture 종목군 · 3개 시장",
  },
  filters: {
    ariaLabel: "시장 검색 및 필터",
    searchLabel: "티커 또는 회사 검색",
    searchPlaceholder: "티커 또는 회사명을 검색하세요",
    detailsLabel: "상세 조건",
    reset: "초기화",
    resultsPrefix: "조건에 맞는 종목",
    resultsSuffix: "개",
    fixtureNotice: "Fixture 메타데이터 · 지연 시세는 추후 연결",
    groups: {
      country: "시장",
      assetClass: "자산군",
      session: "장 상태",
      sector: "섹터",
      exchange: "거래소",
      marketCap: "시가총액",
      change: "등락",
      volume: "거래량",
    },
    options: {
      country: [
        { label: "전체 시장", value: "all" },
        { label: "미국", value: "us" },
        { label: "한국", value: "kr" },
        { label: "일본", value: "jp" },
      ],
      assetClass: [
        { label: "전체 자산", value: "all" },
        { label: "주식", value: "stocks" },
        { label: "ETF", value: "etfs" },
      ],
      session: [
        { label: "전체 상태", value: "all" },
        { label: "개장 중", value: "open" },
        { label: "마감", value: "closed" },
      ],
      sector: [
        { label: "전체 섹터", value: "all" },
        { label: "기술", value: "technology" },
        { label: "금융", value: "financials" },
        { label: "산업재", value: "industrials" },
        { label: "소비재", value: "consumer" },
        { label: "헬스케어", value: "healthcare" },
      ],
      exchange: [
        { label: "전체 거래소", value: "all" },
        { label: "NASDAQ", value: "NASDAQ" },
        { label: "NYSE", value: "NYSE" },
        { label: "KOSPI", value: "KOSPI" },
        { label: "KOSDAQ", value: "KOSDAQ" },
        { label: "도쿄증권거래소", value: "TSE" },
      ],
      marketCap: [
        { label: "전체 시가총액", value: "all" },
        { label: "대형주", value: "large" },
        { label: "중형주", value: "mid" },
      ],
      change: [
        { label: "전체 등락", value: "all" },
        { label: "상승 종목", value: "gainers" },
        { label: "하락 종목", value: "losers" },
        { label: "보합권", value: "flat" },
      ],
      volume: [
        { label: "전체 거래량", value: "all" },
        { label: "이상 거래량", value: "high" },
        { label: "일반 거래량", value: "normal" },
      ],
    },
    aiSignals: {
      title: "AI 신호만 보기",
      description: "근거가 포함된 fixture 분석",
    },
  },
} as const satisfies Messages["markets"];

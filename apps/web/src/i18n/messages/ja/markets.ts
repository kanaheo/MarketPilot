import type { Messages } from "@/types/i18n";

export const markets = {
  header: {
    eyebrow: "グローバル銘柄検索",
    title: "市場検索",
    description: "米国、韓国、日本市場から新しい機会を探します。",
    dataBadge: "Fixture銘柄群 · 3市場",
  },
  filters: {
    ariaLabel: "市場検索とフィルター",
    searchLabel: "ティッカーまたは会社を検索",
    searchPlaceholder: "ティッカーまたは会社名を検索",
    detailsLabel: "詳細条件",
    reset: "リセット",
    resultsPrefix: "該当する銘柄",
    resultsSuffix: "件",
    fixtureNotice: "Fixtureメタデータ · 遅延価格は後で接続",
    groups: {
      country: "市場",
      assetClass: "資産クラス",
      session: "取引状態",
      sector: "セクター",
      exchange: "取引所",
      marketCap: "時価総額",
      change: "値動き",
      volume: "出来高",
    },
    options: {
      country: [
        { label: "すべての市場", value: "all" },
        { label: "米国", value: "us" },
        { label: "韓国", value: "kr" },
        { label: "日本", value: "jp" },
      ],
      assetClass: [
        { label: "すべての資産", value: "all" },
        { label: "株式", value: "stocks" },
        { label: "ETF", value: "etfs" },
      ],
      session: [
        { label: "すべての状態", value: "all" },
        { label: "取引中", value: "open" },
        { label: "終了", value: "closed" },
      ],
      sector: [
        { label: "すべてのセクター", value: "all" },
        { label: "テクノロジー", value: "technology" },
        { label: "金融", value: "financials" },
        { label: "資本財", value: "industrials" },
        { label: "消費財", value: "consumer" },
        { label: "ヘルスケア", value: "healthcare" },
      ],
      exchange: [
        { label: "すべての取引所", value: "all" },
        { label: "NASDAQ", value: "NASDAQ" },
        { label: "NYSE", value: "NYSE" },
        { label: "KOSPI", value: "KOSPI" },
        { label: "KOSDAQ", value: "KOSDAQ" },
        { label: "東京証券取引所", value: "TSE" },
      ],
      marketCap: [
        { label: "すべての時価総額", value: "all" },
        { label: "大型株", value: "large" },
        { label: "中型株", value: "mid" },
      ],
      change: [
        { label: "すべての値動き", value: "all" },
        { label: "上昇銘柄", value: "gainers" },
        { label: "下落銘柄", value: "losers" },
        { label: "横ばい", value: "flat" },
      ],
      volume: [
        { label: "すべての出来高", value: "all" },
        { label: "異常出来高", value: "high" },
        { label: "通常出来高", value: "normal" },
      ],
    },
    aiSignals: {
      title: "AIシグナルのみ",
      description: "根拠付きのfixture分析",
    },
  },
} as const satisfies Messages["markets"];

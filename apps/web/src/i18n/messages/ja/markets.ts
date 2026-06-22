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
  discovery: {
    title: "AI銘柄発見",
    description: "選択した市場で根拠とリスクを確認できるアイデア",
    updated: "Fixture分析 · 10分前に更新",
    evidence: "注目する理由",
    counterRisk: "反対リスク",
    fixtureLabel: "Fixtureシグナル · リアルタイム価格未接続",
    disclaimer:
      "AIシグナルは投資助言ではありません。ペーパー取引の判断前に根拠、反対リスク、データ時刻を確認してください。",
    countries: {
      us: "米国",
      kr: "韓国",
      jp: "日本",
    },
    risks: {
      low: "低リスク",
      medium: "中リスク",
    },
    items: {
      nvda: {
        signal: "モメンタム強化",
        evidence: "相対強度と異常出来高が同時に改善しています。",
        counterRisk: "直近の上昇により割高評価への余裕が減っています。",
      },
      samsung: {
        signal: "反発構造を形成",
        evidence: "半導体需要の期待と出来高が回復しています。",
        counterRisk: "メモリ価格と海外投資家フローは景気敏感です。",
      },
      toyota: {
        signal: "ディフェンシブな強さ",
        evidence: "安定した現金創出と円安が底堅さを支えています。",
        counterRisk: "為替反転と供給コストが利益率を下げる可能性があります。",
      },
    },
    empty: {
      title: "条件に一致するAIシグナルがありません",
      description:
        "市場または詳細条件を広げて、他のfixtureシグナルを確認してください。",
    },
  },
  table: {
    title: "市場銘柄",
    resultsPrefix: "検索結果",
    resultsSuffix: "件",
    sortLabel: "並び順",
    sortOptions: [
      { label: "AIスコア順", value: "aiScore" },
      { label: "騰落率順", value: "changeRate" },
      { label: "出来高順", value: "volume" },
      { label: "会社名順", value: "name" },
    ],
    columns: {
      company: "銘柄",
      market: "市場",
      price: "現在値",
      change: "騰落率",
      volume: "出来高",
      trend: "推移",
      aiScore: "AIスコア",
      watchlist: "注目",
    },
    countries: {
      us: "米国",
      kr: "韓国",
      jp: "日本",
    },
    sessions: {
      open: "取引中",
      closed: "終了",
    },
    noSignal: "—",
    addWatchlist: "ウォッチリストに追加",
    removeWatchlist: "ウォッチリストから削除",
    empty: {
      title: "条件に一致する銘柄がありません",
      description:
        "条件を一部リセットするか、別のティッカーや会社名を検索してください。",
    },
  },
} as const satisfies Messages["markets"];

const availableCash = 18_240;

const holdings = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    assetClass: "stocks",
    quantity: 120,
    averagePrice: 175.32,
    currentPrice: 198.92,
    marketValue: 23_870.4,
    returnRate: 0.1346,
    color: "#555b62",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    assetClass: "stocks",
    quantity: 80,
    averagePrice: 338.47,
    currentPrice: 347.21,
    marketValue: 27_776.8,
    returnRate: 0.0258,
    color: "#2878d7",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    assetClass: "stocks",
    quantity: 22,
    averagePrice: 874.19,
    currentPrice: 831.82,
    marketValue: 18_300,
    returnRate: -0.0485,
    color: "#76b900",
  },
  {
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    assetClass: "etfs",
    quantity: 150,
    averagePrice: 241.6,
    currentPrice: 242.62,
    marketValue: 36_393.2,
    returnRate: 0.0042,
    color: "#245ca6",
  },
] as const;

const getAssetClassValue = (
  assetClass: (typeof holdings)[number]["assetClass"],
) =>
  holdings
    .filter((holding) => holding.assetClass === assetClass)
    .reduce((total, holding) => total + holding.marketValue, 0);

const investedValue = holdings.reduce(
  (total, holding) => total + holding.marketValue,
  0,
);
const totalValue = investedValue + availableCash;

export const portfolioData = {
  summary: {
    totalValue: {
      value: totalValue,
      gain: 14_120.8,
      returnRate: 0.1284,
    },
    availableCash: {
      value: availableCash,
    },
    totalReturn: {
      value: 0.1284,
      gain: 14_120.8,
    },
    maxDrawdown: {
      value: -0.0642,
    },
  },
  valueHistory: [
    { date: "05/20", benchmark: 105_800, portfolio: 106_500 },
    { date: "05/23", benchmark: 106_300, portfolio: 108_200 },
    { date: "05/26", benchmark: 107_100, portfolio: 107_800 },
    { date: "05/29", benchmark: 108_500, portfolio: 112_300 },
    { date: "06/01", benchmark: 109_400, portfolio: 115_800 },
    { date: "06/04", benchmark: 110_800, portfolio: 117_600 },
    { date: "06/07", benchmark: 111_300, portfolio: 118_400 },
    { date: "06/10", benchmark: 113_700, portfolio: 122_100 },
    { date: "06/13", benchmark: 114_200, portfolio: 120_300 },
    { date: "06/16", benchmark: 114_800, portfolio: 124_300 },
    { date: "06/19", benchmark: 116_100, portfolio: totalValue },
  ],
  allocation: [
    {
      key: "stocks",
      value: getAssetClassValue("stocks"),
      color: "#11675f",
    },
    {
      key: "etfs",
      value: getAssetClassValue("etfs"),
      color: "#43a678",
    },
    {
      key: "cash",
      value: availableCash,
      color: "#b9d9b0",
    },
  ],
  holdings,
  cashActivity: [
    {
      key: "depositJune",
      type: "deposit",
      date: "2026-06-18",
      amount: 5_000,
      balance: availableCash,
    },
    {
      key: "applePurchase",
      type: "purchase",
      date: "2026-06-12",
      amount: -3_920,
      balance: 13_240,
    },
    {
      key: "depositMay",
      type: "deposit",
      date: "2026-06-05",
      amount: 10_000,
      balance: 17_160,
    },
  ],
  risk: [
    {
      key: "diversification",
      score: 0.74,
      status: "good",
    },
    {
      key: "concentration",
      score: 0.34,
      status: "moderate",
    },
    {
      key: "volatility",
      score: 0.1245,
      status: "measured",
    },
  ],
} as const;

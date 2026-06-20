export const portfolioData = {
  summary: {
    totalValue: {
      value: 124_580.4,
      gain: 14_120.8,
      returnRate: 0.1284,
    },
    availableCash: {
      value: 18_240,
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
    { date: "06/19", benchmark: 116_100, portfolio: 124_580.4 },
  ],
  allocation: [
    {
      key: "stocks",
      value: 77_639.45,
      ratio: 0.62,
      color: "#11675f",
    },
    {
      key: "etfs",
      value: 28_700.95,
      ratio: 0.23,
      color: "#43a678",
    },
    {
      key: "cash",
      value: 18_240,
      ratio: 0.15,
      color: "#b9d9b0",
    },
  ],
} as const;

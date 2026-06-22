import type {
  MarketFilterState,
  MarketInstrument,
  MarketSort,
} from "@/types/markets";

export function filterMarketInstruments(
  instruments: readonly MarketInstrument[],
  filters: MarketFilterState,
) {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase();

  return instruments.filter((instrument) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      instrument.symbol.toLocaleLowerCase().includes(normalizedQuery) ||
      instrument.name.toLocaleLowerCase().includes(normalizedQuery);

    return (
      matchesQuery &&
      (filters.country === "all" ||
        instrument.country === filters.country) &&
      (filters.assetClass === "all" ||
        instrument.assetClass === filters.assetClass) &&
      (filters.session === "all" ||
        instrument.session === filters.session) &&
      (filters.sector === "all" || instrument.sector === filters.sector) &&
      (filters.exchange === "all" ||
        instrument.exchange === filters.exchange) &&
      (filters.marketCap === "all" ||
        instrument.marketCap === filters.marketCap) &&
      (filters.changeBand === "all" ||
        instrument.changeBand === filters.changeBand) &&
      (filters.volumeBand === "all" ||
        instrument.volumeBand === filters.volumeBand) &&
      (!filters.aiSignalsOnly || instrument.hasAiSignal)
    );
  });
}

export function sortMarketInstruments(
  instruments: readonly MarketInstrument[],
  sort: MarketSort,
) {
  return [...instruments].sort((left, right) => {
    if (sort === "name") {
      return left.name.localeCompare(right.name);
    }

    if (sort === "volume") {
      return right.volume - left.volume;
    }

    if (sort === "changeRate") {
      return right.changeRate - left.changeRate;
    }

    return (right.aiScore ?? -1) - (left.aiScore ?? -1);
  });
}

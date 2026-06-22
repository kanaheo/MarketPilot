"use client";

import { useMemo, useState } from "react";

import { AiDiscovery } from "@/components/markets/ai-discovery";
import { MarketFilters } from "@/components/markets/market-filters";
import { MarketPulse } from "@/components/markets/market-pulse";
import { MarketTable } from "@/components/markets/market-table";
import { marketInstruments } from "@/data/markets";
import {
  filterMarketInstruments,
  sortMarketInstruments,
} from "@/lib/market-instruments";
import type {
  MarketExplorerProps,
  MarketFilterState,
  MarketSort,
} from "@/types/markets";

const defaultFilters: MarketFilterState = {
  query: "",
  country: "all",
  assetClass: "all",
  session: "all",
  sector: "all",
  exchange: "all",
  marketCap: "all",
  changeBand: "all",
  volumeBand: "all",
  aiSignalsOnly: false,
};

export function MarketExplorer({ locale, messages }: MarketExplorerProps) {
  const [filters, setFilters] = useState<MarketFilterState>(defaultFilters);
  const [sort, setSort] = useState<MarketSort>("aiScore");
  const [watchlist, setWatchlist] = useState<ReadonlySet<string>>(
    () => new Set(["AAPL", "005930"]),
  );

  const filteredInstruments = useMemo(
    () => filterMarketInstruments(marketInstruments, filters),
    [filters],
  );

  const sortedInstruments = useMemo(
    () => sortMarketInstruments(filteredInstruments, sort),
    [filteredInstruments, sort],
  );

  function updateFilter<Key extends keyof MarketFilterState>(
    key: Key,
    value: MarketFilterState[Key],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function toggleWatchlist(symbol: string) {
    setWatchlist((current) => {
      const next = new Set(current);

      if (next.has(symbol)) {
        next.delete(symbol);
      } else {
        next.add(symbol);
      }

      return next;
    });
  }

  return (
    <>
      <MarketFilters
        messages={messages.filters}
        onChange={updateFilter}
        onReset={() => setFilters(defaultFilters)}
        resultCount={filteredInstruments.length}
        state={filters}
      />
      <AiDiscovery
        instruments={filteredInstruments}
        messages={messages.discovery}
      />
      <div className="market-results-grid">
        <MarketTable
          instruments={sortedInstruments}
          locale={locale}
          messages={messages.table}
          onSortChange={setSort}
          onToggleWatchlist={toggleWatchlist}
          sort={sort}
          watchlist={watchlist}
        />
        <MarketPulse
          instruments={filteredInstruments}
          locale={locale}
          messages={messages.pulse}
        />
      </div>
    </>
  );
}

"use client";

import { RotateCcw, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { marketInstruments } from "@/data/markets";
import type {
  MarketAssetClass,
  MarketCountry,
  MarketFiltersProps,
  MarketSession,
} from "@/types/markets";

const defaultDetails = {
  sector: "all",
  exchange: "all",
  marketCap: "all",
  changeBand: "all",
  volumeBand: "all",
} as const;

export function MarketFilters({ messages }: MarketFiltersProps) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<MarketCountry>("all");
  const [assetClass, setAssetClass] = useState<MarketAssetClass>("all");
  const [session, setSession] = useState<MarketSession>("all");
  const [sector, setSector] = useState<string>(defaultDetails.sector);
  const [exchange, setExchange] = useState<string>(defaultDetails.exchange);
  const [marketCap, setMarketCap] = useState<string>(defaultDetails.marketCap);
  const [changeBand, setChangeBand] = useState<string>(
    defaultDetails.changeBand,
  );
  const [volumeBand, setVolumeBand] = useState<string>(
    defaultDetails.volumeBand,
  );
  const [aiSignalsOnly, setAiSignalsOnly] = useState(false);

  const resultCount = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return marketInstruments.filter((instrument) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        instrument.symbol.toLocaleLowerCase().includes(normalizedQuery) ||
        instrument.name.toLocaleLowerCase().includes(normalizedQuery);

      return (
        matchesQuery &&
        (country === "all" || instrument.country === country) &&
        (assetClass === "all" || instrument.assetClass === assetClass) &&
        (session === "all" || instrument.session === session) &&
        (sector === "all" || instrument.sector === sector) &&
        (exchange === "all" || instrument.exchange === exchange) &&
        (marketCap === "all" || instrument.marketCap === marketCap) &&
        (changeBand === "all" || instrument.changeBand === changeBand) &&
        (volumeBand === "all" || instrument.volumeBand === volumeBand) &&
        (!aiSignalsOnly || instrument.hasAiSignal)
      );
    }).length;
  }, [
    aiSignalsOnly,
    assetClass,
    changeBand,
    country,
    exchange,
    marketCap,
    query,
    sector,
    session,
    volumeBand,
  ]);

  function resetFilters() {
    setQuery("");
    setCountry("all");
    setAssetClass("all");
    setSession("all");
    setSector(defaultDetails.sector);
    setExchange(defaultDetails.exchange);
    setMarketCap(defaultDetails.marketCap);
    setChangeBand(defaultDetails.changeBand);
    setVolumeBand(defaultDetails.volumeBand);
    setAiSignalsOnly(false);
  }

  return (
    <section className="market-filter-shell" aria-label={messages.ariaLabel}>
      <label className="market-search">
        <Search size={20} aria-hidden="true" />
        <span className="sr-only">{messages.searchLabel}</span>
        <input
          onChange={(event) => setQuery(event.target.value)}
          placeholder={messages.searchPlaceholder}
          type="search"
          value={query}
        />
        <kbd>⌘ K</kbd>
      </label>

      <div className="market-filter-primary">
        <FilterGroup
          label={messages.groups.country}
          onChange={(value) => setCountry(value as MarketCountry)}
          options={messages.options.country}
          value={country}
        />
        <FilterGroup
          label={messages.groups.assetClass}
          onChange={(value) => setAssetClass(value as MarketAssetClass)}
          options={messages.options.assetClass}
          value={assetClass}
        />
        <FilterGroup
          label={messages.groups.session}
          onChange={(value) => setSession(value as MarketSession)}
          options={messages.options.session}
          value={session}
        />
      </div>

      <div className="market-filter-details">
        <div className="market-filter-details-heading">
          <span>
            <SlidersHorizontal size={15} aria-hidden="true" />
            {messages.detailsLabel}
          </span>
          <button onClick={resetFilters} type="button">
            <RotateCcw size={14} aria-hidden="true" />
            {messages.reset}
          </button>
        </div>

        <div className="market-select-grid">
          <MarketSelect
            label={messages.groups.sector}
            onChange={setSector}
            options={messages.options.sector}
            value={sector}
          />
          <MarketSelect
            label={messages.groups.exchange}
            onChange={setExchange}
            options={messages.options.exchange}
            value={exchange}
          />
          <MarketSelect
            label={messages.groups.marketCap}
            onChange={setMarketCap}
            options={messages.options.marketCap}
            value={marketCap}
          />
          <MarketSelect
            label={messages.groups.change}
            onChange={setChangeBand}
            options={messages.options.change}
            value={changeBand}
          />
          <MarketSelect
            label={messages.groups.volume}
            onChange={setVolumeBand}
            options={messages.options.volume}
            value={volumeBand}
          />
          <button
            aria-pressed={aiSignalsOnly}
            className="ai-signal-filter"
            data-active={aiSignalsOnly}
            onClick={() => setAiSignalsOnly((current) => !current)}
            type="button"
          >
            <Sparkles size={16} aria-hidden="true" />
            <span>
              <strong>{messages.aiSignals.title}</strong>
              <small>{messages.aiSignals.description}</small>
            </span>
          </button>
        </div>
      </div>

      <footer className="market-filter-footer">
        <span>
          {messages.resultsPrefix} <strong>{resultCount}</strong>{" "}
          {messages.resultsSuffix}
        </span>
        <span>{messages.fixtureNotice}</span>
      </footer>
    </section>
  );
}

type FilterOption = Readonly<{
  label: string;
  value: string;
}>;

type FilterGroupProps = Readonly<{
  label: string;
  onChange: (value: string) => void;
  options: readonly FilterOption[];
  value: string;
}>;

function FilterGroup({
  label,
  onChange,
  options,
  value,
}: FilterGroupProps) {
  return (
    <fieldset className="market-filter-group">
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <button
            aria-pressed={value === option.value}
            data-active={value === option.value}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

type MarketSelectProps = Readonly<{
  label: string;
  onChange: (value: string) => void;
  options: readonly FilterOption[];
  value: string;
}>;

function MarketSelect({
  label,
  onChange,
  options,
  value,
}: MarketSelectProps) {
  return (
    <label className="market-select">
      <span>{label}</span>
      <select
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

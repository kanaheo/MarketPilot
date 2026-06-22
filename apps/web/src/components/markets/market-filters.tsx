"use client";

import { RotateCcw, Search, SlidersHorizontal, Sparkles } from "lucide-react";

import type {
  MarketAssetClass,
  MarketCountry,
  MarketFiltersProps,
  MarketSession,
} from "@/types/markets";

export function MarketFilters({
  messages,
  onChange,
  onReset,
  resultCount,
  state,
}: MarketFiltersProps) {
  return (
    <section className="market-filter-shell" aria-label={messages.ariaLabel}>
      <label className="market-search">
        <Search size={20} aria-hidden="true" />
        <span className="sr-only">{messages.searchLabel}</span>
        <input
          onChange={(event) => onChange("query", event.target.value)}
          placeholder={messages.searchPlaceholder}
          type="search"
          value={state.query}
        />
        <kbd>⌘ K</kbd>
      </label>

      <div className="market-filter-primary">
        <FilterGroup
          label={messages.groups.country}
          onChange={(value) =>
            onChange("country", value as MarketCountry)
          }
          options={messages.options.country}
          value={state.country}
        />
        <FilterGroup
          label={messages.groups.assetClass}
          onChange={(value) =>
            onChange("assetClass", value as MarketAssetClass)
          }
          options={messages.options.assetClass}
          value={state.assetClass}
        />
        <FilterGroup
          label={messages.groups.session}
          onChange={(value) =>
            onChange("session", value as MarketSession)
          }
          options={messages.options.session}
          value={state.session}
        />
      </div>

      <div className="market-filter-details">
        <div className="market-filter-details-heading">
          <span>
            <SlidersHorizontal size={15} aria-hidden="true" />
            {messages.detailsLabel}
          </span>
          <button onClick={onReset} type="button">
            <RotateCcw size={14} aria-hidden="true" />
            {messages.reset}
          </button>
        </div>

        <div className="market-select-grid">
          <MarketSelect
            label={messages.groups.sector}
            onChange={(value) => onChange("sector", value)}
            options={messages.options.sector}
            value={state.sector}
          />
          <MarketSelect
            label={messages.groups.exchange}
            onChange={(value) => onChange("exchange", value)}
            options={messages.options.exchange}
            value={state.exchange}
          />
          <MarketSelect
            label={messages.groups.marketCap}
            onChange={(value) => onChange("marketCap", value)}
            options={messages.options.marketCap}
            value={state.marketCap}
          />
          <MarketSelect
            label={messages.groups.change}
            onChange={(value) => onChange("changeBand", value)}
            options={messages.options.change}
            value={state.changeBand}
          />
          <MarketSelect
            label={messages.groups.volume}
            onChange={(value) => onChange("volumeBand", value)}
            options={messages.options.volume}
            value={state.volumeBand}
          />
          <button
            aria-pressed={state.aiSignalsOnly}
            className="ai-signal-filter"
            data-active={state.aiSignalsOnly}
            onClick={() =>
              onChange("aiSignalsOnly", !state.aiSignalsOnly)
            }
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

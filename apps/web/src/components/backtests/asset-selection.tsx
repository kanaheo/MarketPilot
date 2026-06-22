"use client";

import { Equal, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { AssetMark } from "@/components/common/asset-mark";
import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { backtestAssets, getBacktestAsset } from "@/data/backtests";
import type { AssetSelectionProps } from "@/types/backtests";

export function AssetSelection({
  cashReserve,
  error,
  messages,
  onAdd,
  onEqualize,
  onRemove,
  onWeightChange,
  selectedAssets,
}: AssetSelectionProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const selectedSymbols = useMemo(
    () => new Set(selectedAssets.map((asset) => asset.symbol)),
    [selectedAssets],
  );
  const availableAssets = backtestAssets.filter((asset) => {
    if (selectedSymbols.has(asset.symbol)) {
      return false;
    }

    return (
      !normalizedQuery ||
      asset.symbol.toLocaleLowerCase().includes(normalizedQuery) ||
      asset.name.toLocaleLowerCase().includes(normalizedQuery)
    );
  });
  const selectedWeight = selectedAssets.reduce(
    (total, asset) => total + asset.weight,
    0,
  );
  const targetWeight = Math.max(0, 100 - cashReserve);

  return (
    <Panel className="backtest-assets-panel">
      <div className="backtest-assets-heading">
        <SectionHeader
          description={messages.description}
          title={messages.title}
        />
        <button
          className="backtest-equalize-button"
          disabled={selectedAssets.length === 0}
          onClick={onEqualize}
          type="button"
        >
          <Equal size={14} aria-hidden="true" />
          {messages.equalize}
        </button>
      </div>

      <div className="backtest-asset-search">
        <Search size={16} aria-hidden="true" />
        <input
          aria-label={messages.searchLabel}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={messages.searchPlaceholder}
          type="search"
          value={query}
        />
      </div>

      {query ? (
        <div className="backtest-asset-search-results">
          {availableAssets.length > 0 ? (
            availableAssets.slice(0, 4).map((asset) => (
              <button
                key={asset.symbol}
                onClick={() => {
                  onAdd(asset.symbol);
                  setQuery("");
                }}
                type="button"
              >
                <AssetMark color={asset.color} symbol={asset.symbol} />
                <span>
                  <strong>{asset.symbol}</strong>
                  <small>{asset.name}</small>
                </span>
                <Plus size={15} aria-hidden="true" />
              </button>
            ))
          ) : (
            <p>{messages.noResults}</p>
          )}
        </div>
      ) : null}

      <div className="backtest-selected-assets">
        <div className="backtest-selected-assets-header">
          <span>{messages.columns.asset}</span>
          <span>{messages.columns.weight}</span>
          <span>{messages.columns.remove}</span>
        </div>
        {selectedAssets.map((selectedAsset) => {
          const asset = getBacktestAsset(selectedAsset.symbol);

          if (!asset) {
            return null;
          }

          return (
            <div className="backtest-selected-asset" key={asset.symbol}>
              <div className="asset-cell">
                <AssetMark color={asset.color} symbol={asset.symbol} />
                <span>
                  <strong>{asset.symbol}</strong>
                  <small>{asset.name}</small>
                </span>
              </div>
              <div className="backtest-weight-input">
                <input
                  aria-label={`${asset.symbol} ${messages.columns.weight}`}
                  max="100"
                  min="0"
                  onChange={(event) =>
                    onWeightChange(asset.symbol, Number(event.target.value))
                  }
                  step="1"
                  type="number"
                  value={selectedAsset.weight}
                />
                <span>%</span>
              </div>
              <button
                aria-label={`${asset.symbol} ${messages.remove}`}
                onClick={() => onRemove(asset.symbol)}
                type="button"
              >
                <Trash2 size={15} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>

      <footer className="backtest-allocation-footer">
        <span>
          {messages.invested} <strong>{selectedWeight.toFixed(1)}%</strong>
        </span>
        <span>
          {messages.cash} <strong>{cashReserve.toFixed(1)}%</strong>
        </span>
        <span>
          {messages.target} <strong>{targetWeight.toFixed(1)}%</strong>
        </span>
      </footer>
      {error ? (
        <p className="backtest-assets-error" role="alert">
          {error}
        </p>
      ) : null}
    </Panel>
  );
}

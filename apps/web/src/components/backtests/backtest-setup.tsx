"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Play, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { AssetSelection } from "@/components/backtests/asset-selection";
import { BacktestResults } from "@/components/backtests/backtest-results";
import { RiskSettings } from "@/components/backtests/risk-settings";
import { SimulationSettings } from "@/components/backtests/simulation-settings";
import { defaultSelectedAssets } from "@/data/backtests";
import { generateBacktestResult } from "@/lib/backtests";
import { createBacktestSchema } from "@/lib/validation/backtests";
import type {
  BacktestFormValues,
  BacktestSetupProps,
  SelectedBacktestAsset,
} from "@/types/backtests";

const defaultValues: BacktestFormValues = {
  startDate: "2021-01-04",
  endDate: "2025-12-31",
  initialCapital: 100000,
  currency: "USD",
  benchmark: "SPY",
  strategy: "momentum",
  maxPositionWeight: 45,
  cashReserve: 10,
  stopLoss: 8,
  rebalanceFrequency: "monthly",
  feeRate: 0.1,
  slippageRate: 0.05,
  executionTiming: "nextOpen",
};

export function BacktestSetup({ locale, messages }: BacktestSetupProps) {
  const [selectedAssets, setSelectedAssets] = useState<
    readonly SelectedBacktestAsset[]
  >(defaultSelectedAssets);
  const [assetError, setAssetError] = useState("");
  const [result, setResult] = useState(() =>
    generateBacktestResult(defaultValues, defaultSelectedAssets),
  );
  const [isComplete, setIsComplete] = useState(false);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<BacktestFormValues>({
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(createBacktestSchema(messages.validation)),
  });
  const cashReserve = useWatch({ control, name: "cashReserve" });
  const selectedStrategy = useWatch({ control, name: "strategy" });

  function addAsset(symbol: string) {
    setAssetError("");
    setSelectedAssets((current) => {
      if (current.some((asset) => asset.symbol === symbol)) {
        return current;
      }

      return [...current, { symbol, weight: 0 }];
    });
  }

  function removeAsset(symbol: string) {
    setAssetError("");
    setSelectedAssets((current) =>
      current.filter((asset) => asset.symbol !== symbol),
    );
  }

  function updateWeight(symbol: string, weight: number) {
    setAssetError("");
    setSelectedAssets((current) =>
      current.map((asset) =>
        asset.symbol === symbol
          ? { ...asset, weight: Number.isFinite(weight) ? weight : 0 }
          : asset,
      ),
    );
  }

  function equalizeWeights() {
    if (selectedAssets.length === 0) {
      return;
    }

    const targetWeight = Math.max(0, 100 - cashReserve);
    const equalWeight = Number(
      (targetWeight / selectedAssets.length).toFixed(2),
    );
    const lastWeight = Number(
      (targetWeight - equalWeight * (selectedAssets.length - 1)).toFixed(2),
    );

    setAssetError("");
    setSelectedAssets((current) =>
      current.map((asset, index) => ({
        ...asset,
        weight: index === current.length - 1 ? lastWeight : equalWeight,
      })),
    );
  }

  async function runBacktest(values: BacktestFormValues) {
    const selectedWeight = selectedAssets.reduce(
      (total, asset) => total + asset.weight,
      0,
    );
    const targetWeight = 100 - values.cashReserve;

    if (selectedAssets.length === 0) {
      setAssetError(messages.validation.assetsRequired);
      return;
    }

    if (
      selectedAssets.some(
        (asset) =>
          asset.weight <= 0 || asset.weight > values.maxPositionWeight,
      )
    ) {
      setAssetError(messages.validation.assetWeight);
      return;
    }

    if (Math.abs(selectedWeight - targetWeight) > 0.01) {
      setAssetError(messages.validation.totalWeight);
      return;
    }

    setAssetError("");
    setIsComplete(false);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    setResult(generateBacktestResult(values, selectedAssets));
    setIsComplete(true);
  }

  return (
    <form
      className="backtest-setup"
      noValidate
      onSubmit={handleSubmit(runBacktest)}
    >
      <div className="backtest-configuration-grid">
        <SimulationSettings
          errors={errors}
          messages={messages}
          register={register}
          selectedStrategy={selectedStrategy}
        />
        <RiskSettings
          errors={errors}
          messages={messages}
          register={register}
        />
      </div>

      <AssetSelection
        cashReserve={cashReserve}
        error={assetError}
        messages={messages.assets}
        onAdd={addAsset}
        onEqualize={equalizeWeights}
        onRemove={removeAsset}
        onWeightChange={updateWeight}
        selectedAssets={selectedAssets}
      />

      <div className="backtest-run-bar">
        <div>
          <ShieldAlert size={17} aria-hidden="true" />
          <p>
            <strong>{messages.action.noticeTitle}</strong>
            <span>{messages.action.noticeDescription}</span>
          </p>
        </div>

        <div className="backtest-run-actions">
          <span aria-live="polite">
            {isComplete ? messages.action.completed : ""}
          </span>
          <button disabled={isSubmitting} type="submit">
            <Play size={16} fill="currentColor" aria-hidden="true" />
            {isSubmitting ? messages.action.running : messages.action.run}
          </button>
        </div>
      </div>

      <BacktestResults
        locale={locale}
        messages={messages}
        result={result}
        selectedAssets={selectedAssets}
      />
    </form>
  );
}

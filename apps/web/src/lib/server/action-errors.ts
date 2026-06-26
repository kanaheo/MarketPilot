import { MarketPilotApiError } from "@/lib/server/marketpilot-api";

type StatusFailureMap<FailureReason extends string> = Readonly<
  Partial<Record<number, FailureReason>>
>;

export function getMarketPilotActionFailureReason<FailureReason extends string>(
  error: unknown,
  statusFailureMap: StatusFailureMap<FailureReason>,
  fallbackReason: FailureReason,
): FailureReason {
  if (error instanceof MarketPilotApiError) {
    return statusFailureMap[error.status] ?? fallbackReason;
  }

  return fallbackReason;
}

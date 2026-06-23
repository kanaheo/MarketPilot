import { marketPilotApiFetch } from "@/lib/server/marketpilot-api";
import type {
  PortfolioApiItem,
  PortfolioDetailApiItem,
} from "@/types/marketpilot-api";

export class MarketPilotApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "MarketPilotApiError";
  }
}

async function readApiResponse<ResponseBody>(
  response: Response,
): Promise<ResponseBody> {
  if (!response.ok) {
    throw new MarketPilotApiError(
      `MarketPilot API request failed: ${response.status}`,
      response.status,
    );
  }

  return (await response.json()) as ResponseBody;
}

export async function getPortfolios(): Promise<readonly PortfolioApiItem[]> {
  const response = await marketPilotApiFetch("/portfolios");
  return readApiResponse<PortfolioApiItem[]>(response);
}

export async function getPortfolioDetail(
  portfolioId: string,
): Promise<PortfolioDetailApiItem> {
  const response = await marketPilotApiFetch(`/portfolios/${portfolioId}`);
  return readApiResponse<PortfolioDetailApiItem>(response);
}
